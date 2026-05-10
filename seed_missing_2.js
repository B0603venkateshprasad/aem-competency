const BASE = 'http://localhost:3000';
let token = '';
const headers = () => ({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

async function login() { 
  const r = await fetch(`${BASE}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'admin', password: '1234' }) }); 
  const d = await r.json(); token = d.token; 
}

async function getTopicId(name) {
  const r = await fetch(`${BASE}/api/topics`, { headers: headers() });
  const topics = await r.json();
  const topic = topics.find(t => t.name === name);
  return topic ? topic.id : null;
}

async function addQ(topicId, q, a) { 
  if (!topicId) return;
  await fetch(`${BASE}/api/questions`, { method: 'POST', headers: headers(), body: JSON.stringify({ topicId, question: q, answer: a }) }); 
}

async function run() {
  await login();
  console.log('Seeding missing questions Part 2...');

  // 7. US Bank
  let id = await getTopicId('US Bank');
  if (id) {
    await addQ(id, "Use Strict, let vs Var", "'use strict' enforces stricter parsing and error handling in JS. let is block-scoped and cannot be re-declared in the same scope, whereas var is function-scoped and hoisted.");
    await addQ(id, "How you handled async requests in JavaScript?", "Using modern fetch API with async/await (e.g., const res = await fetch(url); const data = await res.json();) or using Axios library for automatic JSON parsing and interceptors.");
    await addQ(id, "Without AEM Backend what can you create in frontend", "You can create static prototypes, UI mockups, styling systems (ClientLibs), or a Single Page Application (SPA in React/Angular) that fetches data via headless APIs rather than relying on AEM HTL rendering.");
    await addQ(id, "Have you worked in CRXDE explain", "Yes, CRXDE Lite is the browser-based development environment in AEM. It's used to navigate the JCR, create nodes, edit HTL/CSS/JS, and configure components and templates directly on the server.");
    console.log('  ✅ US Bank missing done');
  }

  // 8. US Bank (AIA Digital Analytics)
  id = await getTopicId('US Bank (AIA Digital Analytics)');
  if (id) {
    await addQ(id, "Event delegate", "Event delegation attaches a single event listener to a parent element to handle events for all of its child elements. It leverages event bubbling and is highly efficient for dynamically added elements.");
    await addQ(id, "Use of this keyword", "The 'this' keyword refers to the object that is executing the current function. In a method, it refers to the owner object; in an arrow function, it retains the 'this' value of the enclosing lexical context.");
    console.log('  ✅ US Bank AIA missing done');
  }

  // 9. US Bank (DE EE BFS Delivery)
  id = await getTopicId('US Bank (DE EE BFS Delivery)');
  if (id) {
    await addQ(id, "promise vs promise all", "Promise handles a single async operation. Promise.all() takes an array of promises and resolves ONLY when ALL of them have resolved, or rejects immediately if any one of them rejects.");
    await addQ(id, "lazy loading - React, suspense", "Lazy loading delays the initialization of components until they are needed (e.g., React.lazy(() => import('./Component'))). <Suspense> wraps lazy components to show a fallback UI (like a spinner) while loading.");
    await addQ(id, "reconciliation", "The process by which React updates the DOM. It compares the newly returned Virtual DOM tree with the previous one (diffing) and applies only the necessary changes to the real DOM.");
    await addQ(id, "Testcase", "A set of conditions or variables under which a tester determines whether a system under test satisfies requirements. In React, usually written with Jest and React Testing Library.");
    console.log('  ✅ US Bank BFS missing done');
  }

  // 10. ABBVIE
  id = await getTopicId('ABBVIE');
  if (id) {
    await addQ(id, "How are OOTB components created from core components?", "By using the Proxy Component Pattern. You create a new component under /apps/project/components and set its sling:resourceSuperType property to point to the Core Component path (e.g., core/wcm/components/text/v2/text).");
    await addQ(id, "What is style system and alternate", "The Style System allows authors to apply visual variations via CSS classes without developer intervention. The alternate approach is creating entirely separate components or adding custom dialog fields for styling.");
    await addQ(id, "Component not rendered in page. Possible errors?", "1. Not added to the template's allowed components policy. 2. HTL syntax error. 3. Missing or incorrect sling:resourceSuperType. 4. Caching issue in dispatcher.");
    console.log('  ✅ ABBVIE missing done');
  }

  // 11. Boehringer Ingelheim
  id = await getTopicId('Boehringer Ingelheim');
  if (id) {
    await addQ(id, "What is CSS Box Model?", "A box that wraps around every HTML element. It consists of: Content (the text/image), Padding (clear area around content), Border (around the padding), and Margin (clear area outside the border).");
    await addQ(id, "What is accessibility and uses?", "Accessibility (a11y) ensures digital content is usable by people with disabilities (e.g., visual impairment). Uses: Screen readers (ARIA attributes), keyboard navigation, color contrast, semantic HTML.");
    await addQ(id, "Difference Between block and Inlineblock?", "Block elements take full width and start on a new line. Inline-block elements stay on the same line (like inline) but allow setting width, height, margin, and padding (unlike inline).");
    console.log('  ✅ Boehringer missing done');
  }

  // 12. Etihad
  id = await getTopicId('Etihad');
  if (id) {
    await addQ(id, "Display none vs visibility hidden", "display: none removes the element completely from the document layout flow. visibility: hidden hides the element visually but it still occupies its exact space in the layout.");
    await addQ(id, "CSS Optimization techniques", "Minification, using CSS variables, avoiding overly deep nesting, combining files to reduce HTTP requests, loading critical CSS first, and deferring non-critical CSS.");
    await addQ(id, "Responsive mobile layout without media queries?", "Using CSS Flexbox or Grid with relative units (%, vw) and functions like calc(), min(), max(), or clamp() to create fluid typography and layouts.");
    console.log('  ✅ Etihad missing done');
  }

  console.log('🎉 Missing questions Part 2 done!');
}

run().catch(console.error);
