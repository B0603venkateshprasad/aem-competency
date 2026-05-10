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
  await fetch(`${BASE}/api/questions`, { method: 'POST', headers: headers(), body: JSON.stringify({ topicId, question: q, answer: a }) }); 
}

async function run() {
  await login();

  // Find existing TD Insurance topic
  let id = await getTopicId('TD Insurance');
  
  if (!id) {
    console.log('TD Insurance topic not found! Adding as new...');
    const r = await fetch(`${BASE}/api/topics`, { method: 'POST', headers: headers(), body: JSON.stringify({ name: 'TD Insurance' }) });
    const d = await r.json();
    id = d.id;
  }

  console.log('📁 Found TD Insurance ID:', id, 'Adding missing questions...');

  await addQ(id, "What are Structural Directives in Angular?", "Structural directives change the DOM layout by adding and removing DOM elements.\nExamples:\n• *ngIf: Conditionally includes a template.\n• *ngFor: Iterates through a list and creates HTML for each item.\n• *ngSwitch: Similar to a JS switch statement, swapping out templates.");
  await addQ(id, "What are Pipes in Angular?", "Pipes take data as input and transform it to a desired output format in the template.\n\nBuilt-in pipes:\n• DatePipe: {{ today | date:'short' }}\n• UpperCasePipe: {{ name | uppercase }}\n• CurrencyPipe: {{ price | currency:'USD' }}\n• AsyncPipe: Subscribes to an Observable/Promise and returns the latest value.");
  await addQ(id, "What are Services in Angular?", "Services are singleton classes used to share data, logic, and functions across multiple components. They are typically injected using Dependency Injection (DI) in the constructor.\n\nUsage: API calls, state management, sharing data between unrelated components.");
  await addQ(id, "GET vs POST?", "GET:\n• Used to retrieve data.\n• Parameters are sent in the URL string.\n• Can be cached and bookmarked.\n• Has size limits.\n\nPOST:\n• Used to send/submit data to the server (e.g., submitting a form).\n• Parameters are sent in the HTTP message body.\n• Cannot be cached or bookmarked.\n• No size limits, more secure for sensitive data.");
  await addQ(id, "Methods/APIs available in Angular Signals?", "Signals (Angular 16+) provide reactive state.\n\nAPIs:\n1. signal(initialValue): Creates a writable signal.\n2. set(newValue): Completely replaces the signal's value.\n3. update(fn): Updates the value based on the previous value.\n4. computed(fn): Creates a read-only derived signal that auto-updates.\n5. effect(fn): Runs a side effect (like logging or manual DOM updates) whenever a signal it reads changes.");
  await addQ(id, "Execute multiple API calls in parallel in Angular?", "Use the RxJS `forkJoin` operator.\n\nIt takes an array of Observables and waits for all of them to complete. It then emits a single array containing all the results.\n\nforkJoin([\n  this.http.get('/api/users'),\n  this.http.get('/api/accounts')\n]).subscribe(([users, accounts]) => {\n  // UI renders here, after both succeed\n});");
  await addQ(id, "How to handle heavy data processing in frontend?", "1. Web Workers: Offload heavy processing to a background thread so the main UI thread doesn't freeze.\n2. Pagination / Infinite Scroll: Only load and render a small chunk of data at a time.\n3. Virtual Scrolling: Using Angular CDK Virtual Scroll to only render the DOM nodes visible in the viewport.\n4. Memoization/Caching: Don't recalculate data unnecessarily.");
  await addQ(id, "How does minification work in Angular?", "During a production build (`ng build --configuration production`), Angular CLI uses Terser/Webpack to minify the code.\nIt removes whitespace, comments, shortens variable names, and performs Tree Shaking (removing unused code). This drastically reduces bundle size, leading to faster download times and parsing, improving overall performance.");
  await addQ(id, "Best practices to improve Angular performance?", "1. ChangeDetectionStrategy.OnPush: Reduces unnecessary change detection cycles.\n2. Lazy Loading Modules: Only load code when the user navigates to that route.\n3. TrackBy in *ngFor: Prevents re-rendering the whole list when an item changes.\n4. Avoid complex computations in templates.\n5. Unsubscribe from Observables (or use async pipe) to prevent memory leaks.\n6. Use Ahead-of-Time (AOT) compilation.");
  await addQ(id, "How to handle dynamic data in Reactive Forms?", "Use `FormArray`.\nFormArray is a variant of FormGroup used to manage an unnamed array of FormControls, FormGroups, or FormArrays.\n\nExample:\nget aliases() { return this.profileForm.get('aliases') as FormArray; }\n\naddAlias() { this.aliases.push(new FormControl('')); }\n\nIn HTML, you iterate over `aliases.controls` with *ngFor.");
  await addQ(id, "How do you handle errors effectively in Angular?", "1. Global Error Handler: Implement Angular's `ErrorHandler` class to catch unhandled frontend exceptions and log them to a service (e.g., Sentry).\n2. HTTP Interceptors: Catch backend API errors (e.g., 401, 500) globally, show generic toast notifications, or redirect to login.\n3. RxJS catchError: Handle specific errors on individual API calls within the service before passing data to the component.");

  console.log('  ✅ Missing TD Insurance questions added!');
}
run().catch(console.error);
