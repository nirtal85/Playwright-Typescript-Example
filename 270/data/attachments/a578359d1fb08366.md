# Test info

- Name: Routing >> should allow me to display active items
- Location: /__w/Playwright-Typescript-Example/Playwright-Typescript-Example/tests/demo-todo-app.spec.ts:325:3

# Error details

```
Error: locator.check: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('todo-item').nth(1).getByRole('checkbox')

    at /__w/Playwright-Typescript-Example/Playwright-Typescript-Example/tests/demo-todo-app.spec.ts:327:70
```

# Page snapshot

```yaml
- text: This is just a demo of TodoMVC for testing, not the
- link "real TodoMVC app.":
  - /url: https://todomvc.com/
- heading "todos" [level=1]
- textbox "What needs to be done?"
- checkbox "❯Mark all as complete"
- text: ❯Mark all as complete
- list:
  - listitem:
    - checkbox "Toggle Todo"
    - text: buy some cheese
  - listitem:
    - checkbox "Toggle Todo"
    - text: feed the cat
  - listitem:
    - checkbox "Toggle Todo"
    - text: book a doctors appointment
    - button "Delete": ×
- strong: "3"
- text: items left
- list:
  - listitem:
    - link "All":
      - /url: "#/"
  - listitem:
    - link "Active":
      - /url: "#/active"
  - listitem:
    - link "Completed":
      - /url: "#/completed"
- contentinfo:
  - paragraph: Double-click to edit a todo
  - paragraph:
    - text: Created by
    - link "Remo H. Jansen":
      - /url: http://github.com/remojansen/
  - paragraph:
    - text: Part of
    - link "TodoMVC":
      - /url: http://todomvc.com
```

# Test source

```ts
  227 |     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).fill('');
  228 |     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).press('Enter');
  229 |
  230 |     await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  231 |   });
  232 |
  233 |   test('should cancel edits on escape', async ({ page }) => {
  234 |     const todoItems = page.getByTestId('todo-item');
  235 |     await todoItems.nth(1).dblclick();
  236 |     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).fill('buy some sausages');
  237 |     await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).press('Escape');
  238 |     await expect(todoItems).toHaveText(TODO_ITEMS);
  239 |   });
  240 | });
  241 |
  242 | test.describe('Counter', () => {
  243 |   test('should display the current number of todo items', async ({ page }) => {
  244 |     // create a new todo locator
  245 |     const newTodo = page.getByPlaceholder('What needs to be done?');
  246 |
  247 |     // create a todo count locator
  248 |     const todoCount = page.getByTestId('todo-count');
  249 |
  250 |     await newTodo.fill(TODO_ITEMS[0]);
  251 |     await newTodo.press('Enter');
  252 |
  253 |     await expect(todoCount).toContainText('1');
  254 |
  255 |     await newTodo.fill(TODO_ITEMS[1]);
  256 |     await newTodo.press('Enter');
  257 |     await expect(todoCount).toContainText('2');
  258 |
  259 |     await checkNumberOfTodosInLocalStorage(page, 2);
  260 |   });
  261 | });
  262 |
  263 | test.describe('Clear completed button', () => {
  264 |   test.beforeEach(async ({ page }) => {
  265 |     await createDefaultTodos(page);
  266 |   });
  267 |
  268 |   test('should display the correct text', async ({ page }) => {
  269 |     await page.locator('.todo-list li .toggle').first().check();
  270 |     await expect(page.getByRole('button', { name: 'Clear completed' })).toBeVisible();
  271 |   });
  272 |
  273 |   test('should remove completed items when clicked', async ({ page }) => {
  274 |     const todoItems = page.getByTestId('todo-item');
  275 |     await todoItems.nth(1).getByRole('checkbox').check();
  276 |     await page.getByRole('button', { name: 'Clear completed' }).click();
  277 |     await expect(todoItems).toHaveCount(2);
  278 |     await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  279 |   });
  280 |
  281 |   test('should be hidden when there are no items that are completed', async ({ page }) => {
  282 |     await page.locator('.todo-list li .toggle').first().check();
  283 |     await page.getByRole('button', { name: 'Clear completed' }).click();
  284 |     await expect(page.getByRole('button', { name: 'Clear completed' })).toBeHidden();
  285 |   });
  286 | });
  287 |
  288 | test.describe('Persistence', () => {
  289 |   test('should persist its data', async ({ page }) => {
  290 |     // create a new todo locator
  291 |     const newTodo = page.getByPlaceholder('What needs to be done?');
  292 |
  293 |     for (const item of TODO_ITEMS.slice(0, 2)) {
  294 |       await newTodo.fill(item);
  295 |       await newTodo.press('Enter');
  296 |     }
  297 |
  298 |     const todoItems = page.getByTestId('todo-item');
  299 |     const firstTodoCheck = todoItems.nth(0).getByRole('checkbox');
  300 |     await firstTodoCheck.check();
  301 |     await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
  302 |     await expect(firstTodoCheck).toBeChecked();
  303 |     await expect(todoItems).toHaveClass(['completed', '']);
  304 |
  305 |     // Ensure there is 1 completed item.
  306 |     await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  307 |
  308 |     // Now reload.
  309 |     await page.reload();
  310 |     await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
  311 |     await expect(firstTodoCheck).toBeChecked();
  312 |     await expect(todoItems).toHaveClass(['completed', '']);
  313 |   });
  314 | });
  315 |
  316 | test.describe('Routing', () => {
  317 |   test.beforeEach(async ({ page }) => {
  318 |     await createDefaultTodos(page);
  319 |     // make sure the app had a chance to save updated todos in storage
  320 |     // before navigating to a new view, otherwise the items can get lost :(
  321 |     // in some frameworks like Durandal
  322 |     await checkTodosInLocalStorage(page, TODO_ITEMS[0]);
  323 |   });
  324 |
  325 |   test('should allow me to display active items', async ({ page }) => {
  326 |     const todoItem = page.getByTestId('todo-item');
> 327 |     await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();
      |                                                                      ^ Error: locator.check: Test timeout of 30000ms exceeded.
  328 |
  329 |     await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  330 |     await page.getByRole('link', { name: 'Active' }).click();
  331 |     await expect(todoItem).toHaveCount(2);
  332 |     await expect(todoItem).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  333 |   });
  334 |
  335 |   test('should respect the back button', async ({ page }) => {
  336 |     const todoItem = page.getByTestId('todo-item');
  337 |     await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();
  338 |
  339 |     await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  340 |
  341 |     await test.step('Showing all items', async () => {
  342 |       await page.getByRole('link', { name: 'All' }).click();
  343 |       await expect(todoItem).toHaveCount(3);
  344 |     });
  345 |
  346 |     await test.step('Showing active items', async () => {
  347 |       await page.getByRole('link', { name: 'Active' }).click();
  348 |     });
  349 |
  350 |     await test.step('Showing completed items', async () => {
  351 |       await page.getByRole('link', { name: 'Completed' }).click();
  352 |     });
  353 |
  354 |     await expect(todoItem).toHaveCount(1);
  355 |     await page.goBack();
  356 |     await expect(todoItem).toHaveCount(2);
  357 |     await page.goBack();
  358 |     await expect(todoItem).toHaveCount(3);
  359 |   });
  360 |
  361 |   test('should allow me to display completed items', async ({ page }) => {
  362 |     await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();
  363 |     await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  364 |     await page.getByRole('link', { name: 'Completed' }).click();
  365 |     await expect(page.getByTestId('todo-item')).toHaveCount(1);
  366 |   });
  367 |
  368 |   test('should allow me to display all items', async ({ page }) => {
  369 |     await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();
  370 |     await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  371 |     await page.getByRole('link', { name: 'Active' }).click();
  372 |     await page.getByRole('link', { name: 'Completed' }).click();
  373 |     await page.getByRole('link', { name: 'All' }).click();
  374 |     await expect(page.getByTestId('todo-item')).toHaveCount(3);
  375 |   });
  376 |
  377 |   test('should highlight the currently applied filter', async ({ page }) => {
  378 |     await expect(page.getByRole('link', { name: 'All' })).toHaveClass('selected');
  379 |
  380 |     // create locators for active and completed links
  381 |     const activeLink = page.getByRole('link', { name: 'Active' });
  382 |     const completedLink = page.getByRole('link', { name: 'Completed' });
  383 |     await activeLink.click();
  384 |
  385 |     // Page change - active items.
  386 |     await expect(activeLink).toHaveClass('selected');
  387 |     await completedLink.click();
  388 |
  389 |     // Page change - completed items.
  390 |     await expect(completedLink).toHaveClass('selected');
  391 |   });
  392 | });
  393 |
  394 | async function createDefaultTodos(page: Page) {
  395 |   // create a new todo locator
  396 |   const newTodo = page.getByPlaceholder('What needs to be done?');
  397 |
  398 |   for (const item of TODO_ITEMS) {
  399 |     await newTodo.fill(item);
  400 |     await newTodo.press('Enter');
  401 |   }
  402 | }
  403 |
  404 | async function checkNumberOfTodosInLocalStorage(page: Page, expected: number) {
  405 |   return await page.waitForFunction((e) => {
  406 |     return JSON.parse(localStorage['react-todos']).length === e;
  407 |   }, expected);
  408 | }
  409 |
  410 | async function checkNumberOfCompletedTodosInLocalStorage(page: Page, expected: number) {
  411 |   return await page.waitForFunction((e) => {
  412 |     return (
  413 |       JSON.parse(localStorage['react-todos']).filter((todo: any) => todo.completed).length === e
  414 |     );
  415 |   }, expected);
  416 | }
  417 |
  418 | async function checkTodosInLocalStorage(page: Page, title: string) {
  419 |   return await page.waitForFunction((t) => {
  420 |     return JSON.parse(localStorage['react-todos'])
  421 |       .map((todo: any) => todo.title)
  422 |       .includes(t);
  423 |   }, title);
  424 | }
  425 |
```