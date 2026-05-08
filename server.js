require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'aem_competency_secret_2024';

const WebSocket = require('ws');

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  { realtime: { transport: WebSocket } }
);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Auth Middleware ───────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// ── Auth Routes ──────────────────────────────────────────────────
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if username exists
    const { data: existingUser } = await supabase
      .from('users').select('id').ilike('username', username).single();
    if (existingUser) return res.status(400).json({ error: 'Username already exists' });

    // Check if email exists
    const { data: existingEmail } = await supabase
      .from('users').select('id').ilike('email', email).single();
    if (existingEmail) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({ username, email, password: hashedPassword, role: 'user', status: 'approved' })
      .select('id, username, email, role, status')
      .single();

    if (error) throw error;

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, role: newUser.role, email: newUser.email },
      JWT_SECRET, { expiresIn: '24h' }
    );

    res.json({ token, user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const { data: user, error } = await supabase
      .from('users').select('*').ilike('username', username).single();

    if (error || !user) return res.status(401).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    if (user.status === 'revoked') {
      return res.status(403).json({ error: 'Your account has been revoked. Contact admin.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, email: user.email },
      JWT_SECRET, { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role, status: user.status }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  const { data: user } = await supabase
    .from('users').select('id, username, email, role, status').eq('id', req.user.id).single();
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// ── Topics Routes ────────────────────────────────────────────────
app.get('/api/topics', authMiddleware, async (req, res) => {
  const { data: topics, error } = await supabase
    .from('topics').select('*').order('created_at');
  if (error) return res.status(500).json({ error: error.message });

  // Get question counts
  const { data: questions } = await supabase.from('questions').select('topic_id');
  const counts = {};
  (questions || []).forEach(q => { counts[q.topic_id] = (counts[q.topic_id] || 0) + 1; });

  const result = topics.map(t => ({
    id: t.id, name: t.name, createdAt: t.created_at,
    questionCount: counts[t.id] || 0
  }));
  res.json(result);
});

app.post('/api/topics', authMiddleware, adminMiddleware, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Topic name is required' });

  const { data, error } = await supabase
    .from('topics').insert({ name }).select().single();
  if (error) return res.status(400).json({ error: error.message.includes('duplicate') ? 'Topic already exists' : error.message });
  res.json({ id: data.id, name: data.name, createdAt: data.created_at });
});

app.delete('/api/topics/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { error } = await supabase.from('topics').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

app.put('/api/topics/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Topic name is required' });

  const { data, error } = await supabase
    .from('topics').update({ name }).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id, name: data.name, createdAt: data.created_at });
});

// ── Questions Routes ─────────────────────────────────────────────
app.get('/api/questions', authMiddleware, async (req, res) => {
  let query = supabase.from('questions').select('*, topics(name)').order('created_at');

  if (req.query.topicId) query = query.eq('topic_id', req.query.topicId);

  if (req.query.search) {
    const search = `%${req.query.search}%`;
    query = query.or(`question.ilike.${search},answer.ilike.${search}`);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  const result = (data || []).map(q => ({
    id: q.id, question: q.question, answer: q.answer,
    topicId: q.topic_id, topicName: q.topics?.name || 'Unknown',
    createdAt: q.created_at
  }));
  res.json(result);
});

app.post('/api/questions', authMiddleware, adminMiddleware, async (req, res) => {
  const { question, answer, topicId } = req.body;
  if (!question || !answer || !topicId) {
    return res.status(400).json({ error: 'Question, answer, and topicId are required' });
  }

  const { data: topic } = await supabase.from('topics').select('name').eq('id', topicId).single();
  if (!topic) return res.status(404).json({ error: 'Topic not found' });

  const { data, error } = await supabase
    .from('questions').insert({ question, answer, topic_id: topicId }).select().single();
  if (error) return res.status(500).json({ error: error.message });

  res.json({ id: data.id, question: data.question, answer: data.answer, topicId: data.topic_id, topicName: topic.name, createdAt: data.created_at });
});

app.put('/api/questions/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { question, answer, topicId } = req.body;
  const updates = {};
  if (question) updates.question = question;
  if (answer) updates.answer = answer;
  if (topicId) updates.topic_id = topicId;

  const { data, error } = await supabase
    .from('questions').update(updates).eq('id', req.params.id).select('*, topics(name)').single();
  if (error) return res.status(500).json({ error: error.message });

  res.json({ id: data.id, question: data.question, answer: data.answer, topicId: data.topic_id, topicName: data.topics?.name || 'Unknown', createdAt: data.created_at });
});

app.delete('/api/questions/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { error } = await supabase.from('questions').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ── Users Routes (Admin) ────────────────────────────────────────
app.get('/api/users', authMiddleware, adminMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('users').select('id, username, email, role, status, created_at').order('created_at');
  if (error) return res.status(500).json({ error: error.message });
  res.json((data || []).map(u => ({ ...u, createdAt: u.created_at })));
});

app.put('/api/users/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'revoked'].includes(status)) {
    return res.status(400).json({ error: 'Status must be approved or revoked' });
  }

  const { data: user } = await supabase.from('users').select('role').eq('id', req.params.id).single();
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.role === 'admin') return res.status(400).json({ error: 'Cannot change admin status' });

  const { data, error } = await supabase
    .from('users').update({ status }).eq('id', req.params.id).select('id, username, email, role, status').single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete('/api/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { data: user } = await supabase.from('users').select('role').eq('id', req.params.id).single();
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.role === 'admin') return res.status(400).json({ error: 'Cannot delete admin' });

  const { error } = await supabase.from('users').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ── SPA Fallback ─────────────────────────────────────────────────
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'public', 'signup.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

// ── Start Server ─────────────────────────────────────────────────
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`\n  🚀 AEM of Competency server running at http://localhost:${PORT}\n`);
  });
}

module.exports = app;
