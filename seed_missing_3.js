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
  console.log('Seeding missing questions Part 3...');

  // 13. Highbourne Account
  let id = await getTopicId('Highbourne Account');
  if (id) {
    await addQ(id, "Hooks in react: useEffect, useCallback, useMemo, useReducer", "useEffect: Handles side effects (API calls, subscriptions).\nuseCallback: Memoizes a function definition to prevent re-creation.\nuseMemo: Memoizes a calculated value for performance.\nuseReducer: Alternative to useState for complex state logic.");
    await addQ(id, "weakmap vs weakset", "WeakSet holds weakly held object references (cannot contain primitives) and is not iterable. WeakMap holds weakly held key-value pairs where keys MUST be objects, allowing garbage collection if the key object is deleted.");
    console.log('  ✅ Highbourne missing done');
  }

  // 14. Caterpillar Project
  id = await getTopicId('Caterpillar Project');
  if (id) {
    await addQ(id, "How to print only object with value male?", "people.filter(person => person.gender === 'Male').forEach(p => console.log(p));");
    await addQ(id, "Angular Rxjs operators (switch map)", "switchMap cancels previous inner observables when a new outer value arrives. It's heavily used in search typeaheads to cancel previous API requests if the user types a new character before the last request finishes.");
    await addQ(id, "Angular directives", "Structural Directives (*ngIf, *ngFor) change the DOM layout by adding/removing elements. Attribute Directives (ngClass, ngStyle) change the appearance or behavior of an element.");
    console.log('  ✅ Caterpillar missing done');
  }

  // 15. Optum account
  id = await getTopicId('Optum account (DE EE HC Delivery)');
  if (id) {
    await addQ(id, "Authorization in nodejs", "Usually handled via middleware. The client sends a JWT in the Authorization header. Node (Express) verifies the token signature using a secret key. If valid, the user's role is checked to grant access to specific routes.");
    await addQ(id, "Secure Api in nodejs", "Use HTTPS, Helmet.js for security headers, rate limiting to prevent brute force, validate all inputs (e.g., Joi), prevent SQL injection (use ORMs/parameterized queries), and use JWT for stateless authentication.");
    console.log('  ✅ Optum missing done');
  }

  // 16. Adobe Account
  id = await getTopicId('Adobe Account');
  if (id) {
    await addQ(id, "Cloud UI or design system in a real-time project?", "We use a shared Design System (like Adobe Spectrum or a custom Storybook library) to maintain consistent UI/UX across all components, ensuring buttons, typography, and spacing are standardized and easily reusable.");
    await addQ(id, "How do you approach accessibility?", "Theoretically: Designing with WCAG guidelines in mind (color contrast, text sizes). Programmatically: Implementing semantic HTML, using ARIA attributes (aria-live, aria-expanded), and ensuring full keyboard navigability.");
    console.log('  ✅ Adobe missing done');
  }

  // 17. Gilead Account
  id = await getTopicId('Gilead Account');
  if (id) {
    await addQ(id, "How to copy object js different ways (Shallow vs Deep)", "Shallow copy: Object.assign({}, obj) or Spread Operator { ...obj }. Nested objects are still referenced.\nDeep copy: JSON.parse(JSON.stringify(obj)) or using structuredClone(obj).");
    await addQ(id, "What is bind in jQuery, and how is it different from on?", "bind() was the old way to attach event handlers directly to elements. on() is the modern standard (introduced in 1.7) because it supports event delegation (attaching to parent for dynamic children).");
    await addQ(id, "Will modifying referenced object affect original?", "var abc = { 'name': 'arun' }; var b = abc; b.name = 'prasanna';\nYes, it will affect abc. Both abc and b point to the exact same object in memory.");
    console.log('  ✅ Gilead missing done');
  }

  // 18. Abbot Account
  id = await getTopicId('Abbot Account');
  if (id) {
    await addQ(id, "Closure snippet: fn1() and fn2()", "fn1 and fn2 are separate instances of the outer function. Output of fn1() twice is 1, then 2. Calling fn2() starts its own count, outputting 1.");
    await addQ(id, "this context: obj.regular() vs obj.arrow()", "obj.regular() outputs 'JS' because 'this' refers to the object calling the method. obj.arrow() outputs undefined (or window scope) because arrow functions inherit 'this' from their enclosing lexical context, not the object.");
    console.log('  ✅ Abbot missing done');
  }

  console.log('🎉 Missing questions Part 3 done!');
}

run().catch(console.error);
