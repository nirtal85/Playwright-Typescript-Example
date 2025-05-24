# Test info

- Name: Routing >> should allow me to display completed items
- Location: /__w/Playwright-Typescript-Example/Playwright-Typescript-Example/tests/demo-todo-app.spec.ts:419:2

# Error details

```
TimeoutError: locator.check: Timeout 30000ms exceeded.
Call log:
  - waiting for getByTestId('todo-item').nth(1).getByRole('checkbox')

    at /__w/Playwright-Typescript-Example/Playwright-Typescript-Example/tests/demo-todo-app.spec.ts:420:68
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
  320 | 	test("should display the correct text", async ({ page }) => {
  321 | 		await page.locator(".todo-list li .toggle").first().check();
  322 | 		await expect(
  323 | 			page.getByRole("button", { name: "Clear completed" }),
  324 | 		).toBeVisible();
  325 | 	});
  326 |
  327 | 	test("should remove completed items when clicked", async ({ page }) => {
  328 | 		const todoItems = page.getByTestId("todo-item");
  329 | 		await todoItems.nth(1).getByRole("checkbox").check();
  330 | 		await page.getByRole("button", { name: "Clear completed" }).click();
  331 | 		await expect(todoItems).toHaveCount(2);
  332 | 		await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  333 | 	});
  334 |
  335 | 	test("should be hidden when there are no items that are completed", async ({
  336 | 		page,
  337 | 	}) => {
  338 | 		await page.locator(".todo-list li .toggle").first().check();
  339 | 		await page.getByRole("button", { name: "Clear completed" }).click();
  340 | 		await expect(
  341 | 			page.getByRole("button", { name: "Clear completed" }),
  342 | 		).toBeHidden();
  343 | 	});
  344 | });
  345 |
  346 | test.describe("Persistence", () => {
  347 | 	test("should persist its data", async ({ page }) => {
  348 | 		// create a new todo locator
  349 | 		const newTodo = page.getByPlaceholder("What needs to be done?");
  350 |
  351 | 		for (const item of TODO_ITEMS.slice(0, 2)) {
  352 | 			await newTodo.fill(item);
  353 | 			await newTodo.press("Enter");
  354 | 		}
  355 |
  356 | 		const todoItems = page.getByTestId("todo-item");
  357 | 		const firstTodoCheck = todoItems.nth(0).getByRole("checkbox");
  358 | 		await firstTodoCheck.check();
  359 | 		await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
  360 | 		await expect(firstTodoCheck).toBeChecked();
  361 | 		await expect(todoItems).toHaveClass(["completed", ""]);
  362 |
  363 | 		// Ensure there is 1 completed item.
  364 | 		await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  365 |
  366 | 		// Now reload.
  367 | 		await page.reload();
  368 | 		await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
  369 | 		await expect(firstTodoCheck).toBeChecked();
  370 | 		await expect(todoItems).toHaveClass(["completed", ""]);
  371 | 	});
  372 | });
  373 |
  374 | test.describe("Routing", () => {
  375 | 	test.beforeEach(async ({ page }) => {
  376 | 		await createDefaultTodos(page);
  377 | 		// make sure the app had a chance to save updated todos in storage
  378 | 		// before navigating to a new view, otherwise the items can get lost :(
  379 | 		// in some frameworks like Durandal
  380 | 		await checkTodosInLocalStorage(page, TODO_ITEMS[0]);
  381 | 	});
  382 |
  383 | 	test("should allow me to display active items", async ({ page }) => {
  384 | 		const todoItem = page.getByTestId("todo-item");
  385 | 		await page.getByTestId("todo-item").nth(1).getByRole("checkbox").check();
  386 |
  387 | 		await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  388 | 		await page.getByRole("link", { name: "Active" }).click();
  389 | 		await expect(todoItem).toHaveCount(2);
  390 | 		await expect(todoItem).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  391 | 	});
  392 |
  393 | 	test("should respect the back button", async ({ page }) => {
  394 | 		const todoItem = page.getByTestId("todo-item");
  395 | 		await page.getByTestId("todo-item").nth(1).getByRole("checkbox").check();
  396 |
  397 | 		await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  398 |
  399 | 		await test.step("Showing all items", async () => {
  400 | 			await page.getByRole("link", { name: "All" }).click();
  401 | 			await expect(todoItem).toHaveCount(3);
  402 | 		});
  403 |
  404 | 		await test.step("Showing active items", async () => {
  405 | 			await page.getByRole("link", { name: "Active" }).click();
  406 | 		});
  407 |
  408 | 		await test.step("Showing completed items", async () => {
  409 | 			await page.getByRole("link", { name: "Completed" }).click();
  410 | 		});
  411 |
  412 | 		await expect(todoItem).toHaveCount(1);
  413 | 		await page.goBack();
  414 | 		await expect(todoItem).toHaveCount(2);
  415 | 		await page.goBack();
  416 | 		await expect(todoItem).toHaveCount(3);
  417 | 	});
  418 |
  419 | 	test("should allow me to display completed items", async ({ page }) => {
> 420 | 		await page.getByTestId("todo-item").nth(1).getByRole("checkbox").check();
      | 		                                                                 ^ TimeoutError: locator.check: Timeout 30000ms exceeded.
  421 | 		await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  422 | 		await page.getByRole("link", { name: "Completed" }).click();
  423 | 		await expect(page.getByTestId("todo-item")).toHaveCount(1);
  424 | 	});
  425 |
  426 | 	test("should allow me to display all items", async ({ page }) => {
  427 | 		await page.getByTestId("todo-item").nth(1).getByRole("checkbox").check();
  428 | 		await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  429 | 		await page.getByRole("link", { name: "Active" }).click();
  430 | 		await page.getByRole("link", { name: "Completed" }).click();
  431 | 		await page.getByRole("link", { name: "All" }).click();
  432 | 		await expect(page.getByTestId("todo-item")).toHaveCount(3);
  433 | 	});
  434 |
  435 | 	test("should highlight the currently applied filter", async ({ page }) => {
  436 | 		await expect(page.getByRole("link", { name: "All" })).toHaveClass(
  437 | 			"selected",
  438 | 		);
  439 |
  440 | 		// create locators for active and completed links
  441 | 		const activeLink = page.getByRole("link", { name: "Active" });
  442 | 		const completedLink = page.getByRole("link", { name: "Completed" });
  443 | 		await activeLink.click();
  444 |
  445 | 		// Page change - active items.
  446 | 		await expect(activeLink).toHaveClass("selected");
  447 | 		await completedLink.click();
  448 |
  449 | 		// Page change - completed items.
  450 | 		await expect(completedLink).toHaveClass("selected");
  451 | 	});
  452 | });
  453 |
  454 | async function createDefaultTodos(page: Page) {
  455 | 	// create a new todo locator
  456 | 	const newTodo = page.getByPlaceholder("What needs to be done?");
  457 |
  458 | 	for (const item of TODO_ITEMS) {
  459 | 		await newTodo.fill(item);
  460 | 		await newTodo.press("Enter");
  461 | 	}
  462 | }
  463 |
  464 | async function checkNumberOfTodosInLocalStorage(page: Page, expected: number) {
  465 | 	return await page.waitForFunction((e) => {
  466 | 		return JSON.parse(localStorage["react-todos"]).length === e;
  467 | 	}, expected);
  468 | }
  469 |
  470 | async function checkNumberOfCompletedTodosInLocalStorage(
  471 | 	page: Page,
  472 | 	expected: number,
  473 | ) {
  474 | 	return await page.waitForFunction((e) => {
  475 | 		return (
  476 | 			JSON.parse(localStorage["react-todos"]).filter(
  477 | 				(todo: any) => todo.completed,
  478 | 			).length === e
  479 | 		);
  480 | 	}, expected);
  481 | }
  482 |
  483 | async function checkTodosInLocalStorage(page: Page, title: string) {
  484 | 	return await page.waitForFunction((t) => {
  485 | 		return JSON.parse(localStorage["react-todos"])
  486 | 			.map((todo: any) => todo.title)
  487 | 			.includes(t);
  488 | 	}, title);
  489 | }
  490 |
```