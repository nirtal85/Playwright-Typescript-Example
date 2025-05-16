# Test info

- Name: New Todo >> should allow me to add todo items
- Location: /__w/Playwright-Typescript-Example/Playwright-Typescript-Example/tests/demo-todo-app.spec.ts:14:2

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveText(expected)

Locator: getByTestId('todo-title')
- Expected  - 3
+ Received  + 1

- Array [
-   "buy some cheese",
- ]
+ Array []
Call log:
  - expect.toHaveText with timeout 5000ms
  - waiting for getByTestId('todo-title')
    9 × locator resolved to 0 elements

    at /__w/Playwright-Typescript-Example/Playwright-Typescript-Example/tests/demo-todo-app.spec.ts:23:48
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
- strong: "1"
- text: item left
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
   1 | import { type Page, expect, test } from "@playwright/test";
   2 |
   3 | test.beforeEach(async ({ page }) => {
   4 | 	await page.goto("https://demo.playwright.dev/todomvc");
   5 | });
   6 |
   7 | const TODO_ITEMS = [
   8 | 	"buy some cheese",
   9 | 	"feed the cat",
   10 | 	"book a doctors appointment",
   11 | ] as const;
   12 |
   13 | test.describe("New Todo", () => {
   14 | 	test("should allow me to add todo items", async ({ page }) => {
   15 | 		// create a new todo locator
   16 | 		const newTodo = page.getByPlaceholder("What needs to be done?");
   17 |
   18 | 		// Create 1st todo.
   19 | 		await newTodo.fill(TODO_ITEMS[0]);
   20 | 		await newTodo.press("Enter");
   21 |
   22 | 		// Make sure the list only has one todo item.
>  23 | 		await expect(page.getByTestId("todo-title")).toHaveText([TODO_ITEMS[0]]);
      | 		                                             ^ Error: Timed out 5000ms waiting for expect(locator).toHaveText(expected)
   24 |
   25 | 		// Create 2nd todo.
   26 | 		await newTodo.fill(TODO_ITEMS[1]);
   27 | 		await newTodo.press("Enter");
   28 |
   29 | 		// Make sure the list now has two todo items.
   30 | 		await expect(page.getByTestId("todo-title")).toHaveText([
   31 | 			TODO_ITEMS[0],
   32 | 			TODO_ITEMS[1],
   33 | 		]);
   34 |
   35 | 		await checkNumberOfTodosInLocalStorage(page, 2);
   36 | 	});
   37 |
   38 | 	test("should clear text input field when an item is added", async ({
   39 | 		page,
   40 | 	}) => {
   41 | 		// create a new todo locator
   42 | 		const newTodo = page.getByPlaceholder("What needs to be done?");
   43 |
   44 | 		// Create one todo item.
   45 | 		await newTodo.fill(TODO_ITEMS[0]);
   46 | 		await newTodo.press("Enter");
   47 |
   48 | 		// Check that input is empty.
   49 | 		await expect(newTodo).toBeEmpty();
   50 | 		await checkNumberOfTodosInLocalStorage(page, 1);
   51 | 	});
   52 |
   53 | 	test("should append new items to the bottom of the list", async ({
   54 | 		page,
   55 | 	}) => {
   56 | 		// Create 3 items.
   57 | 		await createDefaultTodos(page);
   58 |
   59 | 		// create a todo count locator
   60 | 		const todoCount = page.getByTestId("todo-count");
   61 |
   62 | 		// Check test using different methods.
   63 | 		await expect(page.getByText("3 items left")).toBeVisible();
   64 | 		await expect(todoCount).toHaveText("3 items left");
   65 | 		await expect(todoCount).toContainText("3");
   66 | 		await expect(todoCount).toHaveText(/3/);
   67 |
   68 | 		// Check all items in one call.
   69 | 		await expect(page.getByTestId("todo-title")).toHaveText(TODO_ITEMS);
   70 | 		await checkNumberOfTodosInLocalStorage(page, 3);
   71 | 	});
   72 | });
   73 |
   74 | test.describe("Mark all as completed", () => {
   75 | 	test.beforeEach(async ({ page }) => {
   76 | 		await createDefaultTodos(page);
   77 | 		await checkNumberOfTodosInLocalStorage(page, 3);
   78 | 	});
   79 |
   80 | 	test.afterEach(async ({ page }) => {
   81 | 		await checkNumberOfTodosInLocalStorage(page, 3);
   82 | 	});
   83 |
   84 | 	test("should allow me to mark all items as completed", async ({ page }) => {
   85 | 		// Complete all todos.
   86 | 		await page.getByLabel("Mark all as complete").check();
   87 |
   88 | 		// Ensure all todos have 'completed' class.
   89 | 		await expect(page.getByTestId("todo-item")).toHaveClass([
   90 | 			"completed",
   91 | 			"completed",
   92 | 			"completed",
   93 | 		]);
   94 | 		await checkNumberOfCompletedTodosInLocalStorage(page, 3);
   95 | 	});
   96 |
   97 | 	test("should allow me to clear the complete state of all items", async ({
   98 | 		page,
   99 | 	}) => {
  100 | 		const toggleAll = page.getByLabel("Mark all as complete");
  101 | 		// Check and then immediately uncheck.
  102 | 		await toggleAll.check();
  103 | 		await toggleAll.uncheck();
  104 |
  105 | 		// Should be no completed classes.
  106 | 		await expect(page.getByTestId("todo-item")).toHaveClass(["", "", ""]);
  107 | 	});
  108 |
  109 | 	test("complete all checkbox should update state when items are completed / cleared", async ({
  110 | 		page,
  111 | 	}) => {
  112 | 		const toggleAll = page.getByLabel("Mark all as complete");
  113 | 		await toggleAll.check();
  114 | 		await expect(toggleAll).toBeChecked();
  115 | 		await checkNumberOfCompletedTodosInLocalStorage(page, 3);
  116 |
  117 | 		// Uncheck first todo.
  118 | 		const firstTodo = page.getByTestId("todo-item").nth(0);
  119 | 		await firstTodo.getByRole("checkbox").uncheck();
  120 |
  121 | 		// Reuse toggleAll locator and make sure its not checked.
  122 | 		await expect(toggleAll).not.toBeChecked();
  123 |
```