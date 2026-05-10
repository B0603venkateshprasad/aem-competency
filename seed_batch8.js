const BASE = 'http://localhost:3000';
let token = '';
const headers = () => ({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
async function login() { const r = await fetch(`${BASE}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'admin', password: '1234' }) }); const d = await r.json(); token = d.token; }
async function addTopic(name) { const r = await fetch(`${BASE}/api/topics`, { method: 'POST', headers: headers(), body: JSON.stringify({ name }) }); const d = await r.json(); console.log('📁', name); return d.id; }
async function addQ(topicId, q, a) { await fetch(`${BASE}/api/questions`, { method: 'POST', headers: headers(), body: JSON.stringify({ topicId, question: q, answer: a }) }); }

async function run() {
  await login();

  // Vertex Medical Site
  let id = await addTopic('Vertex Medical Site');
  await addQ(id, "What is DOM (Document Object Model)?", "The DOM is a programming interface for web documents. It represents the page so that programs can change the document structure, style, and content. The DOM represents the document as nodes and objects (a tree structure).");
  await addQ(id, "Difference between .empty() and .remove() in jQuery", ".empty(): Removes all child nodes and content from the selected element, but keeps the element itself.\n.remove(): Removes the selected element entirely, including all its children and data/events.");
  await addQ(id, "What are parent() and siblings() functions in jQuery?", "parent(): Traverses exactly one level up the DOM tree to get the direct parent of the selected element.\nsiblings(): Gets all sibling elements of the selected element (elements that share the same parent).");
  await addQ(id, "How to get text using jQuery?", "Use the .text() method.\nExample: var myText = $('#myElement').text();\nTo get HTML including tags, use .html().\nTo get the value of an input field, use .val().");
  await addQ(id, "Scenario: Navigation bar & Pop-up positions", "Navigation bar: Use position: sticky (or fixed) so it stays visible at the top while scrolling.\nPop-up with fixed size: Use position: fixed. Center it using top/left 50% and transform: translate(-50%, -50%). It will stay in the center of the viewport regardless of scrolling.");
  await addQ(id, "Scenario: Select button and text in jQuery", "$('button').on('click', function() {\n  var text = $(this).siblings('p').text(); // get text of sibling paragraph\n  $(this).text('Clicked!'); // manipulate button text\n});");
  console.log('  ✅ Vertex Medical Site done');

  // PEARSON PART II
  id = await addTopic('PEARSON-Interview Questions PART II');
  await addQ(id, "Difference between EM, REM, and px?", "px (Pixels): Absolute unit. 1px is a fixed size. Does not scale well for accessibility.\n\nem: Relative to the font-size of its PARENT element. If parent is 16px, 2em = 32px.\n\nrem (Root em): Relative to the root (<html>) font-size. Usually defaults to 16px. Safer than 'em' because it avoids compounding issues in nested elements.");
  await addQ(id, "AJAX concept", "AJAX (Asynchronous JavaScript and XML) allows web pages to be updated asynchronously by exchanging data with a web server behind the scenes. This means you can update parts of a web page without reloading the whole page.\nModern equivalent: Fetch API.");
  await addQ(id, "How to export content and exp fragment outside AEM?", "1. Export as JSON via Content Services / Sling Model Exporter.\n2. Expose fragments as headless APIs using GraphQL (especially for Content Fragments).\n3. Experience Fragments can be exported directly to Adobe Target as HTML offers.");
  await addQ(id, "AEM Grid System", "The AEM Responsive Grid is based on a 12-column layout.\nIt allows authors to drag and drop components and resize them differently for various breakpoints (Desktop, Tablet, Mobile). It works by injecting AEM-specific CSS classes (like aem-GridColumn--default--4) into the component wrapper.");
  await addQ(id, "Sling URL resolution", "Sling resolves URLs by breaking them down into:\n1. Content Path (e.g., /content/my-site/home)\n2. Selectors (e.g., .print.a4)\n3. Extension (e.g., .html or .json)\n4. Suffix (e.g., /2023/report)\nIt then searches the JCR tree for the resource, finds its resourceType, and locates the script/servlet registered to handle that type and selector/extension.");
  await addQ(id, "Difference between useMemo and useCallback?", "useMemo:\n• Memoizes the RESULT of a computation.\n• Use when doing heavy calculations so they don't run every render.\n• const memoizedValue = useMemo(() => computeHeavyValue(a, b), [a, b]);\n\nuseCallback:\n• Memoizes a FUNCTION DEFINITION.\n• Use when passing callbacks to optimized child components to prevent unnecessary child re-renders.\n• const memoizedFn = useCallback(() => doSomething(a), [a]);");
  console.log('  ✅ PEARSON PART II done');

  // Internal Evaluation Topics
  id = await addTopic('Internal Evaluation Topics');
  await addQ(id, "Typescript", "A strict syntactical superset of JavaScript that adds optional static typing. It helps catch errors at compile-time rather than runtime. Compiles down to plain JS.");
  await addQ(id, "BEM", "Block, Element, Modifier. A methodology for naming CSS classes in a way that is easy to understand and maintain.\nExample: .card (Block) > .card__title (Element) > .card--dark (Modifier).");
  await addQ(id, "Jest", "A delightful JavaScript Testing Framework with a focus on simplicity. Widely used for unit testing React and standard JS applications. Features include snapshot testing and mocking.");
  await addQ(id, "AEM Archetype", "A Maven template used to generate a best-practice AEM project structure. It includes modules for core (Java), ui.apps (components/HTL), ui.content, ui.frontend (React/Webpack), and dispatcher configs.");
  await addQ(id, "Babel & Webpack", "Webpack: A module bundler that takes JS, CSS, images, and bundles them into static assets for the browser.\n\nBabel: A JS compiler that converts modern ES6+ JS code into backward-compatible ES5 code so older browsers can understand it.");
  await addQ(id, "GraphQL", "A query language for APIs. Unlike REST, GraphQL allows clients to request exactly the data they need and nothing more. Highly used in AEM headless implementations to query Content Fragments.");
  await addQ(id, "MSM (Multi Site Manager)", "AEM feature that allows you to manage multiple websites that share common content. You create a 'Blueprint' (source) and 'Live Copies' (targets). When the Blueprint is updated, the changes can be rolled out to the Live Copies.");
  console.log('  ✅ Internal Evaluation Topics done');

  console.log('\n🎉 Batch 8 done!');
}
run().catch(console.error);
