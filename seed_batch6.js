const BASE = 'http://localhost:3000';
let token = '';
const headers = () => ({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
async function login() { const r = await fetch(`${BASE}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'admin', password: '1234' }) }); const d = await r.json(); token = d.token; }
async function addTopic(name) { const r = await fetch(`${BASE}/api/topics`, { method: 'POST', headers: headers(), body: JSON.stringify({ name }) }); const d = await r.json(); console.log('📁', name); return d.id; }
async function addQ(topicId, q, a) { await fetch(`${BASE}/api/questions`, { method: 'POST', headers: headers(), body: JSON.stringify({ topicId, question: q, answer: a }) }); }

async function run() {
  await login();

  // Highbourne Account
  let id = await addTopic('Highbourne Account');
  await addQ(id, "Output of console.log(1 + '2') and console.log('6' - 1)", "1 + '2' Outputs: '12'\n(Type coercion: The number 1 is converted to a string and concatenated).\n\n'6' - 1 Outputs: 5\n(Type coercion: The minus operator triggers numeric conversion, turning string '6' into number 6).");
  await addQ(id, "Output of console.log(null == undefined)", "Outputs: true\n\nExplanation: Using loose equality (==), null and undefined are considered equal. (However, null === undefined is false because they are different types).");
  await addQ(id, "Sum array function output sumArray([15, 6, 10, 2])", "Outputs: 33\n\nExplanation: The function loops through the array and adds each number to the `sum` variable.\n15 + 6 + 10 + 2 = 33.");
  console.log('  ✅ Highbourne done');

  // Caterpillar Project
  id = await addTopic('Caterpillar Project');
  await addQ(id, "Output of object assignment snippet?", "let a = { name: 'Ross', age: 33 };\nlet b = a;\nb.age = 35;\nconsole.log(a);\n\nOutput: { name: 'Ross', age: 35 }\nReason: Objects are assigned by reference. `a` and `b` point to the exact same object in memory, so changing `b` changes `a`.");
  await addQ(id, "How to empty an array?", "const a = [1, 2, 3, 4, 5];\n\nMethod 1 (Best if 'let'): a = [];\nMethod 2: a.length = 0;\nMethod 3: a.splice(0, a.length);\nMethod 4: while(a.length > 0) { a.pop(); }");
  await addQ(id, "Will `const a = [1,2,3]; a[0]=5;` throw an error?", "No, it will NOT throw an error.\n\nExplanation: `const` prevents reassignment of the variable itself (e.g., `a = [5]`), but it does NOT make the array immutable. You can modify the contents (push, pop, change index) of a const array or object.");
  await addQ(id, "How to share data between components in Angular?", "1. Parent to Child: @Input()\n2. Child to Parent: @Output() with EventEmitter\n3. Unrelated/Siblings: Services using RxJS Subjects or BehaviorSubjects\n4. ViewChild / ContentChild: For parent to access child instance directly.\n5. NgRx: Global state management.");
  console.log('  ✅ Caterpillar done');

  // Optum account
  id = await addTopic('Optum account (DE EE HC Delivery)');
  await addQ(id, "What is React Reconciliation?", "Reconciliation is the process React uses to update the DOM.\nWhen a component's state or props change, React creates a new Virtual DOM tree. It compares this new tree with the previous Virtual DOM tree (Diffing Algorithm) and calculates the minimum number of changes needed to update the real DOM.");
  await addQ(id, "What is React Fiber?", "React Fiber is the new reconciliation engine in React 16+.\n\nMain features:\n• Incremental rendering (can split work into chunks).\n• Ability to pause, abort, or reuse work.\n• Prioritization: Can prioritize high-priority updates (like animations) over low-priority ones (like data fetching).\n• Improves perceived performance and smoothness.");
  await addQ(id, "What is JWT?", "JWT (JSON Web Token) is a standard for securely transmitting information between parties as a JSON object.\n\nStructure (3 parts separated by dots):\n1. Header (Algorithm & token type)\n2. Payload (The data/claims, e.g., user ID)\n3. Signature (Verifies the token wasn't altered)\n\nUsed heavily for authorization in Node.js APIs.");
  console.log('  ✅ Optum done');

  // Adobe Account
  id = await addTopic('Adobe Account');
  await addQ(id, "Key differences between AEM and EDS (Edge Delivery Services)?", "AEM Core/Cloud:\n• Heavyweight CMS, robust UI authoring.\n• Stores content in JCR.\n• Rendered via HTL/Sling.\n• Best for complex, highly structured sites.\n\nEDS (Edge Delivery Services / Project Franklin):\n• Lightweight, document-based authoring (Google Docs, MS Word).\n• Extremely fast performance (perfect Lighthouse scores).\n• No JCR; content is fetched from Google Drive/Sharepoint.\n• Rendered using Vanilla JS/CSS directly at the edge.\n• Best for marketing sites needing extreme speed.");
  await addQ(id, "What is PII?", "PII stands for Personally Identifiable Information.\nExamples: Names, SSN, email addresses, phone numbers, bank details.\n\nBest Practices:\n• Encrypt data in transit (HTTPS) and at rest.\n• Do not log PII in browser consoles or server logs.\n• Mask PII on the UI (e.g., ****-1234).\n• Use secure HTTPOnly cookies for auth tokens.");
  console.log('  ✅ Adobe done');

  // Gilead Account
  id = await addTopic('Gilead Account');
  await addQ(id, "Difference between float and flex?", "Float:\n• Originally meant for wrapping text around images.\n• Hacky when used for layout (requires clearfix).\n• Elements are taken out of normal flow slightly.\n\nFlexbox:\n• Specifically designed for 1D layouts.\n• Easy alignment (vertical/horizontal).\n• Auto space distribution.\n• No clearfix needed. Modern and robust.");
  await addQ(id, "Difference between object-fit: cover and fill?", "object-fit: cover\n• Scales the image to fill the container completely, maintaining its aspect ratio.\n• The image will be cropped if its aspect ratio doesn't match the container.\n\nobject-fit: fill (Default)\n• Stretches the image to completely fill the container.\n• Does NOT maintain aspect ratio (image may look squished or distorted).");
  console.log('  ✅ Gilead done');

  // Abbot Account
  id = await addTopic('Abbot Account');
  await addQ(id, "Output of Promise setTimeout snippet?", "Snippet:\nconsole.log('start');\nsetTimeout(() => console.log('timeout'), 0);\nPromise.resolve().then(() => console.log('promise'));\nconsole.log('end');\n\nOutput:\nstart\nend\npromise\ntimeout\n\nWhy? Promises go to the Microtask queue (higher priority), setTimeout goes to the Macrotask queue.");
  await addQ(id, "Output of `var a=10; let b=20;` logged before init?", "console.log(a); // undefined (var is hoisted but not initialized)\nconsole.log(b); // ReferenceError: Cannot access 'b' before initialization (let is in Temporal Dead Zone)\nvar a = 10;\nlet b = 20;");
  console.log('  ✅ Abbot done');

  // TD Insurance
  id = await addTopic('TD Insurance');
  await addQ(id, "What are Signals in Angular?", "Signals (introduced in Angular 16) are a reactive primitive that tracks state and automatically updates the UI when the state changes.\n\nThey provide fine-grained reactivity, meaning Angular only updates the specific parts of the DOM that depend on that signal, without needing Zone.js or checking the whole component tree.");
  await addQ(id, "Reactive Forms vs Template-Driven Forms?", "Template-Driven Forms:\n• Defined in HTML using ngModel.\n• Asynchronous.\n• Logic is heavily in the template.\n• Harder to unit test.\n• Good for simple forms.\n\nReactive Forms:\n• Defined in TypeScript using FormControl/FormGroup.\n• Synchronous.\n• Logic is in the component class.\n• Easy to unit test.\n• Good for complex, dynamic forms.");
  await addQ(id, "What are HTTP Interceptors in Angular?", "Interceptors are classes that implement HttpInterceptor. They can intercept and modify outgoing HTTP requests and incoming responses globally.\n\nUse cases:\n• Attaching Auth Tokens (JWT) to headers.\n• Global Error handling.\n• Showing/hiding loading spinners.\n• Modifying request URLs.");
  console.log('  ✅ TD Insurance done');

  console.log('\n🎉 Batch 6 done!');
}
run().catch(console.error);
