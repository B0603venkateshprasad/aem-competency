const BASE = 'http://localhost:3000';
let token = '';
const headers = () => ({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
async function login() { const r = await fetch(`${BASE}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'admin', password: '1234' }) }); const d = await r.json(); token = d.token; }
async function addTopic(name) { const r = await fetch(`${BASE}/api/topics`, { method: 'POST', headers: headers(), body: JSON.stringify({ name }) }); const d = await r.json(); console.log('📁', name); return d.id; }
async function addQ(topicId, q, a) { await fetch(`${BASE}/api/questions`, { method: 'POST', headers: headers(), body: JSON.stringify({ topicId, question: q, answer: a }) }); }

async function run() {
  await login();

  // US Bank (AIA Digital Analytics)
  let id = await addTopic('US Bank (AIA Digital Analytics)');
  await addQ(id, "Program to find anchor and display label name in alert", "const links = document.querySelectorAll('a');\nlinks.forEach(link => {\n  link.addEventListener('click', (e) => {\n    e.preventDefault();\n    alert(link.textContent || link.innerText);\n  });\n});");
  await addQ(id, "Reverse string program", "function reverseString(str) {\n  return str.split('').reverse().join('');\n}\nconsole.log(reverseString('hello')); // 'olleh'");
  await addQ(id, "Find even numbers program", "function getEvens(arr) {\n  return arr.filter(num => num % 2 === 0);\n}\nconsole.log(getEvens([1, 2, 3, 4, 5, 6])); // [2, 4, 6]");
  await addQ(id, "Remove duplicate from array", "function removeDuplicates(arr) {\n  return [...new Set(arr)];\n}\nconsole.log(removeDuplicates([1, 2, 2, 3, 4, 4])); // [1, 2, 3, 4]");
  await addQ(id, "Palindrome program", "function isPalindrome(str) {\n  const reversed = str.split('').reverse().join('');\n  return str === reversed;\n}\nconsole.log(isPalindrome('racecar')); // true");
  console.log('  ✅ US Bank AIA done');

  // US Bank (DE EE BFS Delivery)
  id = await addTopic('US Bank (DE EE BFS Delivery)');
  await addQ(id, "useRef vs useState", "useState:\n• Triggers a re-render when the state value changes.\n• Used for data that affects the UI.\n\nuseRef:\n• Does NOT trigger a re-render when its value (.current) changes.\n• Used to store mutable values across renders without causing UI updates.\n• Commonly used to directly access DOM elements.");
  await addQ(id, "useMemo vs useCallback", "Both are used for performance optimization.\n\nuseMemo:\n• Memoizes the RESULT of a computation.\n• Use when doing heavy calculations so they don't run every render.\n• const memoizedValue = useMemo(() => computeHeavyValue(a, b), [a, b]);\n\nuseCallback:\n• Memoizes a FUNCTION DEFINITION.\n• Use when passing callbacks to optimized child components to prevent unnecessary child re-renders.\n• const memoizedFn = useCallback(() => doSomething(a), [a]);");
  await addQ(id, "HOC (Higher Order Component)", "An HOC is a pattern where a function takes a component and returns a new enhanced component.\n\nconst withLogging = (WrappedComponent) => {\n  return function(props) {\n    console.log('Component rendered');\n    return <WrappedComponent {...props} />;\n  }\n}\n\nBuilt-in React HOC: React.memo() (memoizes a component to prevent re-renders if props don't change).");
  await addQ(id, "Props drilling", "Props drilling is the process of passing data from a high-level parent component down to a deeply nested child component through intermediate components that don't actually need the data.\n\nSolutions:\n• React Context API (useContext)\n• Redux / State management libraries\n• Component composition");
  await addQ(id, "Negative margin vs negative padding", "Negative Margin:\n• Valid in CSS.\n• Pulls the element outside its normal boundaries or pulls sibling elements closer.\n• Often used for overlapping elements.\n\nNegative Padding:\n• INVALID in CSS.\n• Padding cannot be negative (the browser will ignore it or default to 0).");
  console.log('  ✅ US Bank BFS done');

  // ABBVIE
  id = await addTopic('ABBVIE');
  await addQ(id, "How to set themes for various websites in AEM (entire flow)?", "1. Create a base ClientLib with variables/CSS custom properties.\n2. Create brand-specific ClientLibs overriding those CSS variables.\n3. In AEM Editable Templates, define Policies for the Page component.\n4. Map the specific brand's ClientLib category in the template policy.\n5. When a page is created using that template, it automatically loads the theme specific to that site.");
  await addQ(id, "Explain cq:dialog, categories, dependencies in AEM", "cq:dialog: XML node structure that defines the authoring UI (fields, tabs) for a component in Touch UI.\n\ncategories: Property on a clientlib node that acts as its identifier. You include the clientlib in HTL using this category name.\n\ndependencies: Property on a clientlib listing other clientlibs that MUST be loaded before it (e.g., depending on jQuery).");
  await addQ(id, "data-sly-set vs list vs repeat", "data-sly-set: Defines a variable.\n<sly data-sly-set.name=\"${'John'}\"/>\n\ndata-sly-list: Iterates over a collection. Does NOT render the host element.\n<sly data-sly-list=\"${items}\"><li>${item}</li></sly>\n\ndata-sly-repeat: Iterates over a collection AND repeats the host element.\n<li data-sly-repeat=\"${items}\">${item}</li>");
  await addQ(id, "What is the output of the JS snippet?", "Snippet:\nfunction a() {\n  let b;\n  var c;\n  console.log(c); // undefined\n  console.log(b); // undefined\n  b=10;\n  c=20;\n}\na();\n\nVariables are declared but not initialized when logged, so both output 'undefined'.");
  console.log('  ✅ ABBVIE done');

  // Boehringer Ingelheim
  id = await addTopic('Boehringer Ingelheim');
  await addQ(id, "When to use Grid vs Flexbox for layout?", "Grid:\n• 2D Layouts (Rows AND Columns).\n• Use for overall page architecture (e.g., Header, Sidebar, Main, Footer).\n• When you need strict alignment in both directions.\n\nFlexbox:\n• 1D Layouts (Row OR Column).\n• Use for aligning elements within a container (e.g., Navbar links, centering a div).\n• Content-first design.");
  await addQ(id, "Difference between Class and ID?", "Class (.classname):\n• Can be used multiple times on a page.\n• Lower specificity (10).\n• Used for styling reusable elements.\n\nID (#idname):\n• Must be UNIQUE per page.\n• Higher specificity (100).\n• Used for unique elements (like a specific header) or JS targeting/anchor links.");
  console.log('  ✅ Boehringer Ingelheim done');

  // Etihad
  id = await addTopic('Etihad');
  await addQ(id, "How to switch position of Cancel and Submit buttons on mobile?", "Use Flexbox order property or flex-direction:\n\n.button-container {\n  display: flex;\n}\n/* Desktop: Submit first, Cancel second */\n.btn-submit { order: 1; }\n.btn-cancel { order: 2; }\n\n@media (max-width: 768px) {\n  /* Mobile: Cancel first, Submit second */\n  .btn-cancel { order: 1; }\n  .btn-submit { order: 2; }\n}");
  await addQ(id, "What is the parent selector in SASS?", "The ampersand (&) is the parent selector.\nIt refers to the parent element it is nested inside.\n\n.btn {\n  color: black;\n  &:hover { color: red; } /* Compiles to .btn:hover */\n  &--active { font-weight: bold; } /* Compiles to .btn--active */\n}");
  await addQ(id, "Difference between pseudo-elements and pseudo-classes?", "Pseudo-class (:)\n• Selects elements based on their STATE or DOM position.\n• Ex: :hover, :active, :nth-child(2)\n\nPseudo-element (::)\n• Styles a specific PART of an element or creates virtual elements.\n• Ex: ::before, ::after (creates virtual content), ::first-letter");
  console.log('  ✅ Etihad done');

  console.log('\n🎉 Batch 5 done!');
}
run().catch(console.error);
