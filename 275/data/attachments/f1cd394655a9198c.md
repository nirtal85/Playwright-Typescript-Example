# Test info

- Name: Editing >> should trim entered text
- Location: /__w/Playwright-Typescript-Example/Playwright-Typescript-Example/tests/demo-todo-app.spec.ts:245:2

# Error details

```
Error: locator.dblclick: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('todo-item').nth(1)

    at /__w/Playwright-Typescript-Example/Playwright-Typescript-Example/tests/demo-todo-app.spec.ts:247:26
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
  190 | 			TODO_ITEMS[1],
  191 | 		);
  192 | 		await secondTodo
  193 | 			.getByRole("textbox", { name: "Edit" })
  194 | 			.fill("buy some sausages");
  195 | 		await secondTodo.getByRole("textbox", { name: "Edit" }).press("Enter");
  196 |
  197 | 		// Explicitly assert the new text value.
  198 | 		await expect(todoItems).toHaveText([
  199 | 			TODO_ITEMS[0],
  200 | 			"buy some sausages",
  201 | 			TODO_ITEMS[2],
  202 | 		]);
  203 | 		await checkTodosInLocalStorage(page, "buy some sausages");
  204 | 	});
  205 | });
  206 |
  207 | test.describe("Editing", () => {
  208 | 	test.beforeEach(async ({ page }) => {
  209 | 		await createDefaultTodos(page);
  210 | 		await checkNumberOfTodosInLocalStorage(page, 3);
  211 | 	});
  212 |
  213 | 	test("should hide other controls when editing", async ({ page }) => {
  214 | 		const todoItem = page.getByTestId("todo-item").nth(1);
  215 | 		await todoItem.dblclick();
  216 | 		await expect(todoItem.getByRole("checkbox")).toBeHidden();
  217 | 		await expect(
  218 | 			todoItem.locator("label", {
  219 | 				hasText: TODO_ITEMS[1],
  220 | 			}),
  221 | 		).toBeHidden();
  222 | 		await checkNumberOfTodosInLocalStorage(page, 3);
  223 | 	});
  224 |
  225 | 	test("should save edits on blur", async ({ page }) => {
  226 | 		const todoItems = page.getByTestId("todo-item");
  227 | 		await todoItems.nth(1).dblclick();
  228 | 		await todoItems
  229 | 			.nth(1)
  230 | 			.getByRole("textbox", { name: "Edit" })
  231 | 			.fill("buy some sausages");
  232 | 		await todoItems
  233 | 			.nth(1)
  234 | 			.getByRole("textbox", { name: "Edit" })
  235 | 			.dispatchEvent("blur");
  236 |
  237 | 		await expect(todoItems).toHaveText([
  238 | 			TODO_ITEMS[0],
  239 | 			"buy some sausages",
  240 | 			TODO_ITEMS[2],
  241 | 		]);
  242 | 		await checkTodosInLocalStorage(page, "buy some sausages");
  243 | 	});
  244 |
  245 | 	test("should trim entered text", async ({ page }) => {
  246 | 		const todoItems = page.getByTestId("todo-item");
> 247 | 		await todoItems.nth(1).dblclick();
      | 		                       ^ Error: locator.dblclick: Test timeout of 30000ms exceeded.
  248 | 		await todoItems
  249 | 			.nth(1)
  250 | 			.getByRole("textbox", { name: "Edit" })
  251 | 			.fill("    buy some sausages    ");
  252 | 		await todoItems
  253 | 			.nth(1)
  254 | 			.getByRole("textbox", { name: "Edit" })
  255 | 			.press("Enter");
  256 |
  257 | 		await expect(todoItems).toHaveText([
  258 | 			TODO_ITEMS[0],
  259 | 			"buy some sausages",
  260 | 			TODO_ITEMS[2],
  261 | 		]);
  262 | 		await checkTodosInLocalStorage(page, "buy some sausages");
  263 | 	});
  264 |
  265 | 	test("should remove the item if an empty text string was entered", async ({
  266 | 		page,
  267 | 	}) => {
  268 | 		const todoItems = page.getByTestId("todo-item");
  269 | 		await todoItems.nth(1).dblclick();
  270 | 		await todoItems.nth(1).getByRole("textbox", { name: "Edit" }).fill("");
  271 | 		await todoItems
  272 | 			.nth(1)
  273 | 			.getByRole("textbox", { name: "Edit" })
  274 | 			.press("Enter");
  275 |
  276 | 		await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  277 | 	});
  278 |
  279 | 	test("should cancel edits on escape", async ({ page }) => {
  280 | 		const todoItems = page.getByTestId("todo-item");
  281 | 		await todoItems.nth(1).dblclick();
  282 | 		await todoItems
  283 | 			.nth(1)
  284 | 			.getByRole("textbox", { name: "Edit" })
  285 | 			.fill("buy some sausages");
  286 | 		await todoItems
  287 | 			.nth(1)
  288 | 			.getByRole("textbox", { name: "Edit" })
  289 | 			.press("Escape");
  290 | 		await expect(todoItems).toHaveText(TODO_ITEMS);
  291 | 	});
  292 | });
  293 |
  294 | test.describe("Counter", () => {
  295 | 	test("should display the current number of todo items", async ({ page }) => {
  296 | 		// create a new todo locator
  297 | 		const newTodo = page.getByPlaceholder("What needs to be done?");
  298 |
  299 | 		// create a todo count locator
  300 | 		const todoCount = page.getByTestId("todo-count");
  301 |
  302 | 		await newTodo.fill(TODO_ITEMS[0]);
  303 | 		await newTodo.press("Enter");
  304 |
  305 | 		await expect(todoCount).toContainText("1");
  306 |
  307 | 		await newTodo.fill(TODO_ITEMS[1]);
  308 | 		await newTodo.press("Enter");
  309 | 		await expect(todoCount).toContainText("2");
  310 |
  311 | 		await checkNumberOfTodosInLocalStorage(page, 2);
  312 | 	});
  313 | });
  314 |
  315 | test.describe("Clear completed button", () => {
  316 | 	test.beforeEach(async ({ page }) => {
  317 | 		await createDefaultTodos(page);
  318 | 	});
  319 |
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
```