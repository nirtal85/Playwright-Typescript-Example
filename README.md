# 🎭 Playwright TypeScript Example 🎭

![twitter](https://img.shields.io/twitter/follow/NirTal2)
![dev run](https://github.com/nirtal85/playwright-typescript-example/actions/workflows/devRun.yml/badge.svg)

## 🛠️ Tech Stack

| Tool                                                                        | Description                                                  |
|-----------------------------------------------------------------------------|--------------------------------------------------------------|
| [Playwright](https://www.npmjs.com/package/playwright)                      | A framework for Web Testing and Automation                   |
| [@types/node](https://www.npmjs.com/package/@types/node)                    | TypeScript definitions for Node.js                           |
| [allure-playwright](https://www.npmjs.com/package/allure-playwright)        | Allure framework integration for Playwright Test framework   |

## ⚙️ Setup Instructions

### Step 1: Clone the project

```bash
git clone https://github.com/nirtal85/playwright-typescript-example.git
cd playwright-typescript-example
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Install playwright browsers

```bash
npx playwright install --with-deps
```

## 🏃‍♂️ Running Tests

```bash
npx playwright test
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