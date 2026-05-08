// Seed script — run once to populate Supabase with initial data
require('dotenv').config();
const ws = require('ws');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, { realtime: { transport: ws } });

async function seed() {
  console.log('🌱 Seeding database...\n');

  // 1. Insert admin user
  const { data: existingAdmin } = await supabase.from('users').select('id').eq('username', 'admin').single();
  if (!existingAdmin) {
    await supabase.from('users').insert({
      username: 'admin', email: 'admin@aemcompetency.com',
      password: '$2a$10$cXfFC0j67zQA6DDfehNq9O3/PBiHr18yBr58DjYUR7wgQ6kewYFM.',
      role: 'admin', status: 'approved'
    });
    console.log('✅ Admin user created (admin / 1234)');
  } else { console.log('⏭️  Admin already exists'); }

  // 2. Insert topics
  const topicNames = ['JavaScript', 'React', 'CSS', 'HTML', 'Angular', 'Node.js'];
  const topicIds = {};
  for (const name of topicNames) {
    const { data } = await supabase.from('topics').insert({ name }).select('id').single();
    if (data) { topicIds[name] = data.id; console.log(`✅ Topic: ${name}`); }
    else { const { data: existing } = await supabase.from('topics').select('id').eq('name', name).single(); topicIds[name] = existing?.id; console.log(`⏭️  Topic exists: ${name}`); }
  }

  // 3. Insert questions
  const questions = [
    { topic: 'JavaScript', q: 'What is the event loop in JavaScript?', a: 'The event loop is a mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded. It continuously checks the call stack and the callback queue. When the call stack is empty, it takes the first event from the queue and pushes it to the call stack for execution.' },
    { topic: 'JavaScript', q: 'What is the difference between == and === in JavaScript?', a: "'==' is the loose equality operator that compares values after type coercion. '===' is the strict equality operator that compares both value and type without coercion. It is generally recommended to use '===' for more predictable comparisons." },
    { topic: 'JavaScript', q: 'What are Promises and how do they work?', a: 'Promises are objects representing the eventual completion or failure of an asynchronous operation. A Promise can be Pending, Fulfilled, or Rejected. They are consumed using .then(), .catch(), and .finally() methods.' },
    { topic: 'JavaScript', q: 'What are closures in JavaScript?', a: 'A closure is a function that retains access to its outer function variables even after the outer function has returned. Closures enable data privacy, function factories, and maintaining state.' },
    { topic: 'JavaScript', q: 'What is hoisting in JavaScript?', a: 'Hoisting is JavaScript behavior of moving declarations to the top of their scope during compilation. var declarations are hoisted as undefined. let and const are hoisted but remain in the temporal dead zone.' },
    { topic: 'React', q: 'What are React Hooks and why were they introduced?', a: 'React Hooks are functions that let you use state and other React features in functional components. Key hooks include useState, useEffect, useContext, useRef, and useMemo/useCallback.' },
    { topic: 'React', q: 'What is the Virtual DOM and how does React use it?', a: 'The Virtual DOM is a lightweight JavaScript representation of the actual DOM. React creates a new Virtual DOM tree on state changes and only applies differences to the real DOM (reconciliation).' },
    { topic: 'React', q: 'Explain the difference between useMemo and useCallback.', a: 'useMemo memoizes a computed value. useCallback memoizes a function reference. Both re-compute only when dependencies change and help prevent unnecessary re-renders.' },
    { topic: 'React', q: 'What is the difference between controlled and uncontrolled components?', a: 'Controlled components have form data handled by React state via onChange handlers. Uncontrolled components store form data in the DOM, accessed via refs.' },
    { topic: 'React', q: 'What is React Context API and when should you use it?', a: 'React Context API passes data through the component tree without prop drilling. Use it for global data like themes, authentication, locale. Avoid for frequently changing data.' },
    { topic: 'CSS', q: 'Explain the CSS Box Model.', a: 'The Box Model: Content, Padding, Border, Margin (inside out). box-sizing: content-box applies width to content only. box-sizing: border-box includes content + padding + border.' },
    { topic: 'CSS', q: 'What is the difference between Flexbox and CSS Grid?', a: 'Flexbox is one-dimensional (row OR column). CSS Grid is two-dimensional (rows AND columns). Use Grid for page structure and Flexbox for component-level alignment.' },
    { topic: 'CSS', q: 'What are CSS specificity rules?', a: 'Specificity: inline (1,0,0,0), IDs (0,1,0,0), classes/attributes (0,0,1,0), elements (0,0,0,1). !important overrides all but should be used sparingly.' },
    { topic: 'CSS', q: 'What are CSS media queries and how do they work?', a: 'Media queries apply styles based on device characteristics. Syntax: @media (max-width: 768px) { ... }. They are the foundation of responsive web design.' },
    { topic: 'CSS', q: 'Explain CSS positioning (static, relative, absolute, fixed, sticky).', a: 'static: default. relative: offset from normal position. absolute: positioned relative to nearest positioned ancestor. fixed: relative to viewport. sticky: hybrid relative/fixed.' },
    { topic: 'HTML', q: 'What are semantic HTML elements and why are they important?', a: 'Semantic elements describe their meaning: <header>, <nav>, <main>, <article>, <section>, <footer>. Benefits: accessibility, SEO, cleaner code.' },
    { topic: 'HTML', q: 'What is the difference between <div> and <span>?', a: '<div> is block-level (full width, new line). <span> is inline (content width only). Both are non-semantic containers.' },
    { topic: 'HTML', q: 'What are HTML data attributes and how are they used?', a: 'Data attributes (data-*) store custom data on HTML elements. Access in JS via element.dataset. Useful for passing data to JavaScript without extra requests.' },
    { topic: 'HTML', q: 'What is the difference between localStorage, sessionStorage, and cookies?', a: 'localStorage: persists until cleared, ~5MB. sessionStorage: cleared on tab close, ~5MB. Cookies: can expire, ~4KB, sent with HTTP requests.' },
    { topic: 'HTML', q: 'Explain the HTML document structure and DOCTYPE.', a: '<!DOCTYPE html> declares HTML5. Structure: <html> root, <head> metadata (title, meta, links), <body> visible content.' },
    { topic: 'Angular', q: 'What is Angular and how does it differ from React?', a: 'Angular is a full TypeScript framework by Google. Angular: complete framework, two-way binding, DI. React: library, one-way flow, JSX.' },
    { topic: 'Angular', q: 'What are Angular components and how do they work?', a: 'Components: TypeScript class + HTML template + CSS styles + @Component decorator. They have lifecycle hooks (ngOnInit, ngOnDestroy) and communicate via @Input/@Output.' },
    { topic: 'Angular', q: 'Explain Angular dependency injection.', a: 'DI: Angular injector provides dependencies to classes instead of classes creating their own. Services use @Injectable(). Benefits: loose coupling, testability.' },
    { topic: 'Angular', q: 'What are Angular directives?', a: 'Three types: Component directives (with templates), Structural (*ngIf, *ngFor), Attribute (ngClass, ngStyle). Custom directives use @Directive().' },
    { topic: 'Angular', q: 'What is Angular routing and how does it work?', a: 'Angular Router enables SPA navigation. Features: lazy loading, route guards (canActivate), route parameters, child routes, <router-outlet>.' },
    { topic: 'Node.js', q: 'What is Node.js and why is it used?', a: 'Node.js is a JavaScript runtime on V8 engine for server-side code. Event-driven, non-blocking I/O. Use cases: REST APIs, real-time apps, microservices.' },
    { topic: 'Node.js', q: 'What is the Node.js event loop?', a: 'Six phases: timers, pending callbacks, idle/prepare, poll, check, close callbacks. Each phase has a FIFO queue. Handles async operations.' },
    { topic: 'Node.js', q: 'What is the difference between require and import in Node.js?', a: 'require: CommonJS, synchronous, dynamic. import: ES Module, async, static, enables tree-shaking. ESM requires type:module in package.json.' },
    { topic: 'Node.js', q: 'Explain middleware in Express.js.', a: 'Middleware functions access req, res, next. Types: application-level, router-level, error-handling, built-in (express.json), third-party (cors).' },
    { topic: 'Node.js', q: 'What is the Node.js cluster module?', a: 'Cluster creates child processes sharing the same port to utilize multiple CPU cores. Workers handle requests independently. PM2 simplifies clustering.' },
  ];

  let count = 0;
  for (const item of questions) {
    const tid = topicIds[item.topic];
    if (!tid) continue;
    const { error } = await supabase.from('questions').insert({ topic_id: tid, question: item.q, answer: item.a });
    if (!error) count++;
  }
  console.log(`\n✅ ${count} questions inserted`);
  console.log('\n🎉 Seeding complete!');
  process.exit(0);
}

seed().catch(err => { console.error('Seed error:', err); process.exit(1); });
