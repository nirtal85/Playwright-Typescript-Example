# Test info

- Name: Mark all as completed >> should allow me to mark all items as completed
- Location: /__w/Playwright-Typescript-Example/Playwright-Typescript-Example/tests/demo-todo-app.spec.ts:84:2

# Error details

```
Error: Timed out 30000ms waiting for expect(locator).toHaveClass(expected)

Locator: getByTestId('todo-item')
- Expected  - 5
+ Received  + 1

- Array [
-   "completed",
-   "completed",
-   "completed",
- ]
+ Array []
Call log:
  - expect.toHaveClass with timeout 30000ms
  - waiting for getByTestId('todo-item')
    34 × locator resolved to 0 elements

    at /__w/Playwright-Typescript-Example/Playwright-Typescript-Example/tests/demo-todo-app.spec.ts:89:47
```

# Page snapshot

```yaml
- text: This is just a demo of TodoMVC for testing, not the
- link "real TodoMVC app.":
  - /url: https://todomvc.com/
- heading "todos" [level=1]
- textbox "What needs to be done?"
- checkbox "❯Mark all as complete" [checked]
- text: ❯Mark all as complete
- list:
  - listitem:
    - checkbox "Toggle Todo" [checked]
    - text: buy some cheese
  - listitem:
    - checkbox "Toggle Todo" [checked]
    - text: feed the cat
  - listitem:
    - checkbox "Toggle Todo" [checked]
    - text: book a doctors appointment
- strong: "0"
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
- button "Clear completed"
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
   23 | 		await expect(page.getByTestId("todo-title")).toHaveText([TODO_ITEMS[0]]);
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
>  89 | 		await expect(page.getByTestId("todo-item")).toHaveClass([
      | 		                                            ^ Error: Timed out 30000ms waiting for expect(locator).toHaveClass(expected)
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
  124 | 		await firstTodo.getByRole("checkbox").check();
  125 | 		await checkNumberOfCompletedTodosInLocalStorage(page, 3);
  126 |
  127 | 		// Assert the toggle all is checked again.
  128 | 		await expect(toggleAll).toBeChecked();
  129 | 	});
  130 | });
  131 |
  132 | test.describe("Item", () => {
  133 | 	test("should allow me to mark items as complete", async ({ page }) => {
  134 | 		// create a new todo locator
  135 | 		const newTodo = page.getByPlaceholder("What needs to be done?");
  136 |
  137 | 		// Create two items.
  138 | 		for (const item of TODO_ITEMS.slice(0, 2)) {
  139 | 			await newTodo.fill(item);
  140 | 			await newTodo.press("Enter");
  141 | 		}
  142 |
  143 | 		// Check first item.
  144 | 		const firstTodo = page.getByTestId("todo-item").nth(0);
  145 | 		await firstTodo.getByRole("checkbox").check();
  146 | 		await expect(firstTodo).toHaveClass("completed");
  147 |
  148 | 		// Check second item.
  149 | 		const secondTodo = page.getByTestId("todo-item").nth(1);
  150 | 		await expect(secondTodo).not.toHaveClass("completed");
  151 | 		await secondTodo.getByRole("checkbox").check();
  152 |
  153 | 		// Assert completed class.
  154 | 		await expect(firstTodo).toHaveClass("completed");
  155 | 		await expect(secondTodo).toHaveClass("completed");
  156 | 	});
  157 |
  158 | 	test("should allow me to un-mark items as complete", async ({ page }) => {
  159 | 		// create a new todo locator
  160 | 		const newTodo = page.getByPlaceholder("What needs to be done?");
  161 |
  162 | 		// Create two items.
  163 | 		for (const item of TODO_ITEMS.slice(0, 2)) {
  164 | 			await newTodo.fill(item);
  165 | 			await newTodo.press("Enter");
  166 | 		}
  167 |
  168 | 		const firstTodo = page.getByTestId("todo-item").nth(0);
  169 | 		const secondTodo = page.getByTestId("todo-item").nth(1);
  170 | 		const firstTodoCheckbox = firstTodo.getByRole("checkbox");
  171 |
  172 | 		await firstTodoCheckbox.check();
  173 | 		await expect(firstTodo).toHaveClass("completed");
  174 | 		await expect(secondTodo).not.toHaveClass("completed");
  175 | 		await checkNumberOfCompletedTodosInLocalStorage(page, 1);
  176 |
  177 | 		await firstTodoCheckbox.uncheck();
  178 | 		await expect(firstTodo).not.toHaveClass("completed");
  179 | 		await expect(secondTodo).not.toHaveClass("completed");
  180 | 		await checkNumberOfCompletedTodosInLocalStorage(page, 0);
  181 | 	});
  182 |
  183 | 	test("should allow me to edit an item", async ({ page }) => {
  184 | 		await createDefaultTodos(page);
  185 |
  186 | 		const todoItems = page.getByTestId("todo-item");
  187 | 		const secondTodo = todoItems.nth(1);
  188 | 		await secondTodo.dblclick();
  189 | 		await expect(secondTodo.getByRole("textbox", { name: "Edit" })).toHaveValue(
```