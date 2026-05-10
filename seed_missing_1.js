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
  console.log('Seeding missing questions Part 1...');

  // 1. Merk ACCOUNT
  let id = await getTopicId('Merk ACCOUNT');
  if (id) {
    await addQ(id, "Different properties available for clientlib", "categories (String[]), dependencies (String[]), embed (String[]), allowProxy (Boolean).");
    await addQ(id, "What is the structure of clientLib", "A folder of type cq:ClientLibraryFolder containing css.txt, js.txt, and the actual .css and .js files inside subfolders.");
    await addQ(id, "In clientlib particular css or js is not being minified what is the issue", "It might be missing the 'min' selector in the build configuration, or syntax errors in the JS/CSS preventing the minifier (YUI Compressor or GCC) from parsing it.");
    await addQ(id, "How to only include JS in a particular page", "In the page component HTL, use: <sly data-sly-call=\"${clientlib.js @ categories='my.category'}\"/>");
    await addQ(id, "USE API in AEM", "The Use-API allows HTL to execute logic written in Java (Sling Models/WCMUsePojo) or JavaScript. Syntax: data-sly-use.myObj=\"com.my.Class\".");
    await addQ(id, "Different ways to call the API", "1. Fetch API\n2. Axios\n3. XMLHttpRequest (legacy)\n4. jQuery $.ajax()");
    await addQ(id, "POST method using fetch", "fetch('/api/data', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ key: 'value' })\n});");
    console.log('  ✅ Merk missing done');
  }

  // 2. AGCOaccount
  id = await getTopicId('AGCOaccount');
  if (id) {
    await addQ(id, "Explain promise", "A Promise represents a value that may be available now, in the future, or never. It solves 'callback hell'. States: Pending, Fulfilled, Rejected.");
    await addQ(id, "If Href is target to one link but we need to target it to another link", "Use JavaScript to prevent default and redirect: element.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'newlink.com'; });");
    await addQ(id, "What are cookies and how to set them", "Cookies are small data strings stored in the browser sent with HTTP requests. Set them via JS: document.cookie = 'name=value; expires=Thu, 18 Dec 2025 12:00:00 UTC; path=/';");
    await addQ(id, "How to fetch API", "fetch('url').then(res => res.json()).then(data => console.log(data)).catch(err => console.error(err));");
    await addQ(id, "What is error handling", "Anticipating and resolving runtime errors gracefully. In JS: try...catch blocks. For Promises: .catch().");
    await addQ(id, "Where do local storage save?", "Client-side only. It is saved in the browser's SQLite database on the user's hard drive.");
    await addQ(id, "Fetch module.json", "fetch('./module.json').then(res => res.json()).then(data => console.log(data));");
    await addQ(id, "Pseudo classes and elements", "Pseudo-class (:) targets state (e.g. :hover, :focus). Pseudo-element (::) targets a part of an element (e.g. ::before, ::after).");
    await addQ(id, "Content fragment", "AEM headless content element. It contains pure data (text, numbers, references) without layout, based on a Content Fragment Model.");
    await addQ(id, "Manual deployment - crxde", "Using CRXDE Lite, you can right-click a node and select 'Replicate' to manually publish it, or build a package via Package Manager and install it on the target instance.");
    console.log('  ✅ AGCO missing done');
  }

  // 3. PEARSON ACCOUNT
  id = await getTopicId('PEARSON ACCOUNT');
  if (id) {
    await addQ(id, "Why are we using object? write example", "Objects group related data and functions together using key-value pairs.\nlet car = { make: 'Toyota', model: 'Camry', start() { console.log('Vroom'); } };");
    await addQ(id, "Explain hoisting in JS", "Hoisting moves variable and function declarations to the top of their scope before execution. var is initialized to undefined; let/const are in the Temporal Dead Zone.");
    await addQ(id, "Diff local storage and session storage", "Local storage persists until explicitly deleted. Session storage deletes when the browser tab/window is closed.");
    await addQ(id, "Diff null and undefined", "undefined: A variable has been declared but not assigned a value.\nnull: An intentional assignment representing 'no value'.");
    await addQ(id, "Purpose of 'this' operator?", "It refers to the object it belongs to. In a method, 'this' refers to the owner object. In a standalone function (non-strict), it refers to the global window.");
    await addQ(id, "How to create style policies", "In AEM Editable Templates, click the Policy icon on a component layout. Define allowed components or create Style System classes that authors can select.");
    await addQ(id, "Explain CRXDELite & Package managers", "CRXDE Lite: A web-based IDE for AEM to browse and edit the JCR tree.\nPackage Manager: Used to bundle JCR content/code into ZIP files for deployment or backup.");
    console.log('  ✅ PEARSON missing done');
  }

  // 4. QIB Project
  id = await getTopicId('QIB Project');
  if (id) {
    await addQ(id, "Define Event Listener and Event handler", "Event Listener: A function that waits for an event to occur (addEventListener). Event Handler: The callback function executed when the event occurs.");
    await addQ(id, "What is callback and example", "A callback is a function passed as an argument to another function to be executed later.\nExample: setTimeout(function() { console.log('Done'); }, 1000);");
    await addQ(id, "Define Var, Let, Const", "var: function-scoped, hoisted.\nlet: block-scoped, can be updated but not re-declared.\nconst: block-scoped, cannot be updated or re-declared.");
    await addQ(id, "What is specificity in CSS", "The rules browsers use to determine which CSS property is applied. Order of weight: Inline styles > IDs > Classes/Attributes/Pseudo-classes > Elements/Pseudo-elements.");
    await addQ(id, "What is DOM Tree in HTML", "The Document Object Model tree is a hierarchical representation of the HTML document, where each element, attribute, and text is a node.");
    console.log('  ✅ QIB missing done');
  }

  // 5. RJR
  id = await getTopicId('RJR');
  if (id) {
    await addQ(id, "Define Async and await.", "async marks a function to return a Promise. await pauses execution inside that async function until the Promise resolves.");
    console.log('  ✅ RJR missing done');
  }

  // 6. SS
  id = await getTopicId('SS');
  if (id) {
    await addQ(id, "What is the difference between call() and apply() methods?", "Both invoke a function with a specified 'this' context.\ncall(): Takes arguments separately. func.call(this, arg1, arg2)\napply(): Takes arguments as an array. func.apply(this, [arg1, arg2])");
    await addQ(id, "Explain Promise states in JavaScript.", "1. Pending: Initial state, operation incomplete.\n2. Fulfilled (Resolved): Operation completed successfully.\n3. Rejected: Operation failed.");
    await addQ(id, "What is DOCTYPE in HTML?", "DOCTYPE (Document Type Declaration) tells the browser which version of HTML the page is written in (e.g., <!DOCTYPE html> for HTML5).");
    await addQ(id, "How to create a component in AEM?", "Create a node under /apps/project/components with jcr:primaryType cq:Component. Add a .content.xml, an HTL file (component.html), and a dialog (_cq_dialog).");
    console.log('  ✅ SS missing done');
  }

  console.log('🎉 Missing questions Part 1 done!');
}

run().catch(console.error);
