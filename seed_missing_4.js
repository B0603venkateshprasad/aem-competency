const BASE = 'http://localhost:3000';
let token = '';
const headers = () => ({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

async function login() { 
  const r = await fetch(`${BASE}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'admin', password: '1234' }) }); 
  const d = await r.json(); token = d.token; 
}

async function addTopic(name) { 
  const r = await fetch(`${BASE}/api/topics`, { method: 'POST', headers: headers(), body: JSON.stringify({ name }) }); 
  const d = await r.json(); console.log('📁', name); return d.id; 
}

async function addQ(topicId, q, a) { 
  await fetch(`${BASE}/api/questions`, { method: 'POST', headers: headers(), body: JSON.stringify({ topicId, question: q, answer: a }) }); 
}

async function run() {
  await login();

  // AZ Account
  let id = await addTopic('AZ Account');
  await addQ(id, "Remove negative values from array", "Use the filter method: arr.filter(num => num >= 0);");
  await addQ(id, "Single function for sum(2,3) and sum(2)(3)", "function sum(a, b) { if (b !== undefined) return a + b; return function(c) { return a + c; }; }");
  await addQ(id, "What is the use of Promises?", "Promises are used to handle asynchronous operations in JavaScript. They represent a value that may be available now, in the future, or never. They help avoid 'callback hell' by providing .then() and .catch() methods for chaining async logic.");
  await addQ(id, "What is site level configuration in AEM?", "Context-Aware Configurations (CA Configs) are used to manage site-level settings. They are stored in /conf and automatically apply to the corresponding site content tree in /content.");
  await addQ(id, "What is SLY and how can we loop that sly for component?", "SLY (HTL/Sightly) is the HTML templating language for AEM.\nTo loop over a collection, use data-sly-list or data-sly-repeat.\n\nExample:\n<ul data-sly-list=\"${properties.myArray}\">\n  <li>${item}</li>\n</ul>");
  await addQ(id, "What are the properties used in sly tag?", "Common HTL block statements (properties) include:\n• data-sly-use: Initializes a Java/JS helper object.\n• data-sly-test: Evaluates a condition (if/else).\n• data-sly-list / data-sly-repeat: Iterates over collections.\n• data-sly-resource: Includes the result of rendering a resource.\n• data-sly-include: Includes another HTL script.\n• data-sly-template / data-sly-call: Defines and calls reusable templates.");
  await addQ(id, "How can we declare variables and write conditional statements in HTL (sly tag)?", "Variables: Use data-sly-set to declare a variable.\n<sly data-sly-set.myVar=\"${'Hello World'}\" />\n\nConditionals: Use data-sly-test to evaluate a condition. You can also assign the result of the test to a variable for an 'else' block.\n<div data-sly-test.isTrue=\"${properties.showComponent}\">It is true!</div>\n<div data-sly-test=\"${!isTrue}\">It is false (Else block)!</div>");
  await addQ(id, "Flex column desktop to row mobile", "Use CSS media queries:\n\n.parent { display: flex; flex-direction: column; }\n\n@media (max-width: 768px) {\n  .parent { flex-direction: row; }\n}");
  console.log('  ✅ AZ Account done');

  // Merck Front-End Questions
  id = await addTopic('Merck Front-End Questions');
  await addQ(id, "What are rest and spread operator?", "Rest (...args) collects multiple elements into an array (used in function parameters). Spread (...arr) unpacks elements from an array or object into individual elements.");
  await addQ(id, "What are closures?", "A closure is a function that remembers the variables from its lexical scope even after the outer function has finished executing.");
  await addQ(id, "What is lexical scope?", "Lexical scope means that a variable defined outside a function can be accessible inside another function defined after the variable declaration. But the opposite is not true.");
  await addQ(id, "What are different css positions and what’s the difference?", "static: default, normal flow.\nrelative: positioned relative to its normal position.\nabsolute: positioned relative to closest positioned ancestor.\nfixed: positioned relative to the viewport.\nsticky: toggles between relative and fixed depending on scroll position.");
  await addQ(id, "Difference between template and components in aem?", "A Component is a reusable module that renders specific content (like a text block or image). A Template is a blueprint that defines the structure and allowed components for a page.");
  await addQ(id, "Authentication vs Authorization?", "Authentication confirms WHO the user is (logging in). Authorization confirms WHAT the user is allowed to do (permissions/roles).");
  await addQ(id, "What is usestrict in JS?", "'use strict' enforces stricter parsing and error handling, preventing the use of undeclared variables and throwing errors for unsafe actions.");
  await addQ(id, "What are arrow functions?", "A concise syntax for writing function expressions. They do not have their own 'this' binding, inheriting it from the enclosing scope instead.");
  console.log('  ✅ Merck Front-End done');

  // NNI
  id = await addTopic('NNI');
  await addQ(id, "Difference between class & functional componenet", "Class components use ES6 classes, extend React.Component, and have lifecycle methods and state. Functional components are plain JS functions that use Hooks (useState, useEffect) to manage state and side effects.");
  await addQ(id, "Explain useEffect with dependencies", "useEffect(fn, [deps]) runs the function when the component mounts and whenever any value in the dependency array changes. An empty array [] means it runs only once on mount.");
  await addQ(id, "Props drilling", "Passing data from a top-level component down to deeply nested child components through intermediate components that don't need the data. Solved by Context API or Redux.");
  await addQ(id, "“this” scope In class based component", "'this' refers to the component instance. You must bind methods in the constructor or use arrow functions to ensure 'this' doesn't become undefined when passing the method as a callback.");
  await addQ(id, "Redux vs useContext", "Redux is a global state management library with strict unidirectional data flow (actions -> reducers -> store), great for complex apps. useContext is a built-in React Hook for sharing state without prop drilling, good for simpler state.");
  await addQ(id, "How to find typeof object", "Use the typeof operator. E.g., typeof obj === 'object'. (Note: typeof null is also 'object', so a stricter check is obj !== null && typeof obj === 'object' or Array.isArray() for arrays).");
  await addQ(id, "Preventdefault and stop propagation difference", "preventDefault() stops the default browser action (e.g., following a link or submitting a form). stopPropagation() stops the event from bubbling up the DOM tree to parent elements.");
  await addQ(id, "Mutation observer in js", "A built-in Web API that allows you to watch for changes being made to the DOM tree (like nodes being added, removed, or attributes changed) and fire a callback when they occur.");
  await addQ(id, "Event loop", "The mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded. It constantly checks the Call Stack and the Task Queue, pushing queued callbacks to the stack when it's empty.");
  await addQ(id, "Splice method", "An array method that changes the contents of an array by removing or replacing existing elements and/or adding new elements in place. Syntax: array.splice(start, deleteCount, item1, item2, ...)");
  await addQ(id, "Explain about AEM", "Adobe Experience Manager is an enterprise-grade CMS. It combines digital asset management (DAM) with content management, allowing authors to build pages using reusable components stored in a hierarchical JCR database.");
  console.log('  ✅ NNI done');

  console.log('🎉 Missing Accounts AZ, Merck, and NNI done!');
}

run().catch(console.error);
