# 🎭 Playwright TypeScript Example 🎭

![twitter](https://img.shields.io/twitter/follow/NirTal2)
![YouTube Channel](https://img.shields.io/youtube/channel/subscribers/UCQjS-eoKl0a1nuP_dvpLsjQ?label=YouTube%20Channel)
![dev run](https://github.com/nirtal85/playwright-typescript-example/actions/workflows/devRun.yml/badge.svg)
![nightly](https://github.com/nirtal85/playwright-typescript-example/actions/workflows/nightly.yml/badge.svg)

## 📃 Articles written about this project

* [Test Automation - Accelerating Playwright TypeScript Tests with Parallel Execution in GitHub Actions and Allure Reporting](https://www.linkedin.com/pulse/accelerating-playwright-typescript-tests-parallel-execution-nir-tal-yvehf/)
* [Test Automation - How to Use Dynamic Base URLs with Playwright TypeScript in GitHub Actions](https://www.linkedin.com/pulse/test-automation-how-use-dynamic-base-urls-playwright-nir-tal-dh32f/)
* [Test Automation - How To Attach Public IP Address to Allure Report using Playwright TypeScript Auto Fixtures](https://www.linkedin.com/pulse/test-automation-how-attach-public-ip-address-allure-nir-tal-5jtqf/)


## 🛠️ Tech Stack

| Tool                                                                                     | Description                                                  |
|------------------------------------------------------------------------------------------|--------------------------------------------------------------|
| [@stylistic/eslint-plugin](https://www.npmjs.com/package/@stylistic/eslint-plugin)        | Stylistic formatting rules for ESLint                        |
| [@types/node](https://www.npmjs.com/package/@types/node)                                 | TypeScript definitions for Node.js                           |
| [@typescript-eslint/eslint-plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin) | ESLint plugin for TypeScript                                 |
| [@typescript-eslint/parser](https://www.npmjs.com/package/@typescript-eslint/parser)     | Parser for TypeScript-specific linting rules                 |
| [allure-playwright](https://www.npmjs.com/package/allure-playwright)                      | Allure framework integration for Playwright Test framework   |
| [dotenv](https://www.npmjs.com/package/dotenv)                                           | Loads environment variables from a `.env` file into `process.env` |
| [ESLint](https://www.npmjs.com/package/eslint)                                           | A tool for identifying and reporting on patterns in JavaScript |
| [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier)             | Turns off all rules that are unnecessary or might conflict with Prettier |
| [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)                | ESLint plugin with rules that help validate proper imports   |
| [eslint-plugin-playwright](https://www.npmjs.com/package/eslint-plugin-playwright)        | ESLint plugin for Playwright tests                           |
| [eslint-plugin-prettier](https://www.npmjs.com/package/eslint-plugin-prettier)             | Runs Prettier as an ESLint rule                              |
| [Playwright](https://www.npmjs.com/package/playwright)                                    | A framework for Web Testing and Automation                   |
| [Prettier](https://www.npmjs.com/package/prettier)                                        | An opinionated code formatter                                |
| [TypeScript](https://www.npmjs.com/package/typescript)                                    | A typed superset of JavaScript                              |
## ⚙️ Setup Instructions

### Clone the project

```bash
git clone https://github.com/nirtal85/playwright-typescript-example.git
cd playwright-typescript-example
```

### Install dependencies

```bash
npm install
```

### Install playwright browsers

```bash
npx playwright install --with-deps
```

### Create .env File

Create a `.env` file in the project root directory to securely store project secrets and configuration variables. This file will be used to define key-value pairs for various parameters required by the project. Add the following properties to the `.env` file:

| Parameter  | Description                  | Example Value         |
|------------|------------------------------|-----------------------|
| BASE_URL   | The base URL for the application | "https://example.com" |


## 🏃‍♂️ Running Tests

Run tests:

```bash
npx playwright test
```

Run the test with UI mode:

```bash
npx playwright test --ui
```

## 📊 Viewing Test Results

### Install Allure Commandline To View Test results

#### For Windows:

Follow the instructions [here](https://scoop.sh/) to install Scoop.<br>
Run the following command to install Allure using Scoop:

```bash
scoop install allure
```

#### For Mac:

```bash
brew install allure
```

### View Results Locally:

```bash
allure serve allure-results
```

### View Results Online:

[View allure results via Github pages](https://nirtal85.github.io/Playwright-Typescript-Example/)

## ℹ️  View Help And Other CLI Options

```bash
npx playwright test --help
```