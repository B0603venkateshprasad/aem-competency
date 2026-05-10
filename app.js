try { require('dotenv').config(); } catch (e) {}
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'aem_competency_secret_2024';
const SUPA_URL = process.env.SUPABASE_URL + '/rest/v1';
const SUPA_KEY = process.env.SUPABASE_KEY;

// Supabase REST helper (no SDK needed — works everywhere)
async function supa(table, { method = 'GET', filters = '', body, single = false, select = '*' } = {}) {
  const url = `${SUPA_URL}/${table}?${filters ? filters + '&' : ''}select=${encodeURIComponent(select)}`;
  const headers = {
    'apikey': SUPA_KEY,
    'Authorization': `Bearer ${SUPA_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': method === 'POST' ? 'return=representation' : method === 'PATCH' ? 'return=representation' : method === 'DELETE' ? 'return=representation' : ''
  };
  if (single) headers['Accept'] = 'application/vnd.pgrst.object+json';

  const opts = { method, headers };
  if (body && (method === 'POST' || method === 'PATCH')) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.details || `Supabase error ${res.status}`);
  }
  if (method === 'DELETE' && !single) return { success: true };
  const data = await res.json().catch(() => null);
  return data;
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Auth Middleware ───────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(header.split(' ')[1], JWT_SECRET);
    next();
  } catch (err) { return res.status(401).json({ error: 'Invalid token' }); }
}

function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
}

// ── Auth Routes ──────────────────────────────────────────────────
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'All fields required' });

    try { await supa('users', { filters: `username=ilike.${username}`, single: true }); return res.status(400).json({ error: 'Username exists' }); } catch (e) {}
    try { await supa('users', { filters: `email=ilike.${email}`, single: true }); return res.status(400).json({ error: 'Email registered' }); } catch (e) {}

    const hashed = await bcrypt.hash(password, 10);
    const user = await supa('users', { method: 'POST', body: { username, email, password: hashed, role: 'user', status: 'pending' }, single: true, select: 'id,username,email,role,status' });

    res.json({ message: 'Registration successful! Please wait for admin approval before you can sign in.', pending: true, user: { username: user.username, email: user.email } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    let user;
    try { user = await supa('users', { filters: `username=ilike.${username}`, single: true, select: '*' }); }
    catch (e) { return res.status(401).json({ error: 'Invalid credentials' }); }

    if (!await bcrypt.compare(password, user.password)) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.status === 'pending') return res.status(403).json({ error: 'Your account is pending admin approval. Please check back later.' });
    if (user.status === 'revoked') return res.status(403).json({ error: 'Account revoked. Contact admin.' });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role, status: user.status } });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await supa('users', { filters: `id=eq.${req.user.id}`, single: true, select: 'id,username,email,role,status' });
    res.json(user);
  } catch (e) { res.status(404).json({ error: 'User not found' }); }
});

// ── Topics Routes ────────────────────────────────────────────────
app.get('/api/topics', authMiddleware, async (req, res) => {
  try {
    const topics = await supa('topics', { filters: 'order=created_at.asc' });
    const questions = await supa('questions', { select: 'topic_id' });
    const counts = {};
    (questions || []).forEach(q => { counts[q.topic_id] = (counts[q.topic_id] || 0) + 1; });
    res.json((topics || []).map(t => ({ id: t.id, name: t.name, createdAt: t.created_at, questionCount: counts[t.id] || 0 })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/topics', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Topic name required' });
    const data = await supa('topics', { method: 'POST', body: { name }, single: true });
    res.json({ id: data.id, name: data.name, createdAt: data.created_at });
  } catch (err) { res.status(400).json({ error: err.message.includes('duplicate') ? 'Topic already exists' : err.message }); }
});

app.put('/api/topics/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Topic name required' });
    const data = await supa('topics', { method: 'PATCH', filters: `id=eq.${req.params.id}`, body: { name }, single: true });
    res.json({ id: data.id, name: data.name, createdAt: data.created_at });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/topics/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await supa('questions', { method: 'DELETE', filters: `topic_id=eq.${req.params.id}` });
    await supa('topics', { method: 'DELETE', filters: `id=eq.${req.params.id}` });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Questions Routes ─────────────────────────────────────────────
app.get('/api/questions', authMiddleware, async (req, res) => {
  try {
    let filters = 'order=created_at.asc';
    if (req.query.topicId) filters += `&topic_id=eq.${req.query.topicId}`;
    if (req.query.search) filters += `&or=(question.ilike.*${req.query.search}*,answer.ilike.*${req.query.search}*)`;

    const questions = await supa('questions', { filters, select: '*,topics(name)' });
    res.json((questions || []).map(q => ({
      id: q.id, question: q.question, answer: q.answer,
      topicId: q.topic_id, topicName: q.topics?.name || 'Unknown', createdAt: q.created_at
    })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/questions', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { question, answer, topicId } = req.body;
    if (!question || !answer || !topicId) return res.status(400).json({ error: 'Question, answer, and topicId required' });

    let topic;
    try { topic = await supa('topics', { filters: `id=eq.${topicId}`, single: true, select: 'name' }); }
    catch (e) { return res.status(404).json({ error: 'Topic not found' }); }

    const data = await supa('questions', { method: 'POST', body: { question, answer, topic_id: topicId }, single: true });
    res.json({ id: data.id, question: data.question, answer: data.answer, topicId: data.topic_id, topicName: topic.name, createdAt: data.created_at });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/questions/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updates = {};
    if (req.body.question) updates.question = req.body.question;
    if (req.body.answer) updates.answer = req.body.answer;
    if (req.body.topicId) updates.topic_id = req.body.topicId;

    const data = await supa('questions', { method: 'PATCH', filters: `id=eq.${req.params.id}`, body: updates, single: true, select: '*,topics(name)' });
    res.json({ id: data.id, question: data.question, answer: data.answer, topicId: data.topic_id, topicName: data.topics?.name || 'Unknown', createdAt: data.created_at });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/questions/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await supa('questions', { method: 'DELETE', filters: `id=eq.${req.params.id}` });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Users Routes (Admin) ────────────────────────────────────────
app.get('/api/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const data = await supa('users', { filters: 'order=created_at.asc', select: 'id,username,email,role,status,created_at' });
    res.json((data || []).map(u => ({ ...u, createdAt: u.created_at })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/users/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'revoked', 'pending'].includes(status)) return res.status(400).json({ error: 'Invalid status' });

    const user = await supa('users', { filters: `id=eq.${req.params.id}`, single: true, select: 'role' });
    if (user.role === 'admin') return res.status(400).json({ error: 'Cannot change admin status' });

    const data = await supa('users', { method: 'PATCH', filters: `id=eq.${req.params.id}`, body: { status }, single: true, select: 'id,username,email,role,status' });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await supa('users', { filters: `id=eq.${req.params.id}`, single: true, select: 'role' });
    if (user.role === 'admin') return res.status(400).json({ error: 'Cannot delete admin' });
    await supa('users', { method: 'DELETE', filters: `id=eq.${req.params.id}` });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// ── SPA Fallback ─────────────────────────────────────────────────
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'public', 'signup.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

// ── Start Server ─────────────────────────────────────────────────
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => console.log(`\n  🚀 AEM of Competency running at http://localhost:${PORT}\n`));
}

module.exports = app;
