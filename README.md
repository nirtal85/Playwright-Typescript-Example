<div align="center">

<img height="120" src="https://playwright.dev/img/playwright-logo.svg" alt="Playwright Logo"/>

# Enterprise-Grade Playwright TypeScript Architecture
### The Ultimate Boilerplate for Scalable, Robust, and Modern UI Automation

[![Twitter Follow](https://img.shields.io/twitter/follow/NirTal2?style=social)](https://twitter.com/NirTal2)
[![YouTube](https://img.shields.io/youtube/channel/subscribers/UCQjS-eoKl0a1nuP_dvpLsjQ?style=social)](https://www.youtube.com/channel/UCQjS-eoKl0a1nuP_dvpLsjQ)
[![Architecture by TestShift](https://raw.githubusercontent.com/nirtal85/TestShift-AI/main/assets/testshift-architecture-badge.svg)](https://www.test-shift.com/)
![CI Status](https://github.com/nirtal85/playwright-typescript-example/actions/workflows/devRun.yml/badge.svg)
![Nightly Build](https://github.com/nirtal85/playwright-typescript-example/actions/workflows/nightly.yml/badge.svg)
[![Tests](https://img.shields.io/endpoint?url=https%3A%2F%2Fflakiness.io%2Fapi%2Fbadge%3Finput%3D%257B%2522badgeToken%2522%253A%2522badge-17ujw24it9KdEcTuItIGmd%2522%257D)](https://flakiness.io/nirtal85/Playwright-Typescript-Example)
[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)

[View Live Report](https://nirtal85.github.io/Playwright-Typescript-Example/) • [Read The Docs](https://www.test-shift.com) • [Report Bug](https://github.com/nirtal85/playwright-typescript-example/issues)

</div>

---

## 🚀 About The Project

This repository serves as a **Production-Ready Reference Architecture** for building high-scale automated testing frameworks using **Playwright** and **TypeScript**.

It demonstrates advanced design patterns, seamless CI/CD integration, and strictly typed infrastructure that define modern Quality Engineering.

### ✨ Key Features
* **Modern Tooling:** Built with **Biome** for lightning-fast linting and formatting (replacing ESLint/Prettier).
* **Strict TypeScript:** Full type safety for robust and maintainable code.
* **Smart Reporting:** Full integration with **Allure Report**, including history, trends, and environment data.
* **CI/CD Ready:** Optimized GitHub Actions workflows with parallel execution and auto-merging of results.
* **Advanced Patterns:** Implementation of Dynamic Base URLs, Auto Fixtures, and Data-Driven Testing (DDT).

---

## 📃 Articles written about this project

This project implements the concepts discussed in the following **TestShift** articles:

* [Test Automation - Accelerating Playwright TypeScript Tests with Parallel Execution in GitHub Actions and Allure Reporting](https://www.linkedin.com/pulse/accelerating-playwright-typescript-tests-parallel-execution-nir-tal-yvehf/)
* [Test Automation - How to Use Dynamic Base URLs with Playwright TypeScript in GitHub Actions](https://www.linkedin.com/pulse/test-automation-how-use-dynamic-base-urls-playwright-nir-tal-dh32f/)
* [Test Automation - How To Attach Public IP Address to Allure Report using Playwright TypeScript Auto Fixtures](https://www.linkedin.com/pulse/test-automation-how-attach-public-ip-address-allure-nir-tal-5jtqf/)
* [Test Automation - Data-Driven Testing (DDT) with Playwright TypeScript Using Excel](https://www.linkedin.com/pulse/test-automation-data-driven-testing-ddt-playwright-typescript-tal-3minf/)
* [Test Automation - Efficient Element Selection with Playwright Typescript using Test IDs](https://www.linkedin.com/pulse/test-automation-efficient-element-selection-playwright-nir-tal-hhewf/)
* [Test Automation - Optimizing Playwright Test Reports: Automating Allure Results Merging with GitHub Actions](https://www.linkedin.com/pulse/test-automation-optimizing-playwright-reports-automating-nir-tal-luixf/)
* [Test Automation – Unleashing the Power of AI with Playwright and TypeScript](https://www.linkedin.com/pulse/test-automation-unleashing-power-ai-playwright-typescript-nir-tal-nd1yf/)
* [Guarding the Guards: Building a Pre-Merge Quality Gate for Your TypeScript Automation Framework](https://www.test-shift.com/posts/building-a-quality-gate-for-your-automation-project)
* [Your CI/CD Pipeline Is a Lie: The Case for On-Demand Environments as the Real Quality Gate](https://www.test-shift.com/posts/the-real-quality-gate-a-paradigm-shift)
* [Allure 3 Isn’t Just an Upgrade. It’s the Final Piece of the Quality Gate Architecture](https://www.test-shift.com/posts/allure-3-leave-the-swamp-ride-the-dragon)

---

## 🛠️ Tech Stack

| Tool                                                         | Description & Why We Use It                                                  |
|--------------------------------------------------------------|------------------------------------------------------------------------------|
| [Playwright](https://www.npmjs.com/package/@playwright/test) | The industry standard for reliable, flaky-free browser automation.           |
| [TypeScript](https://www.npmjs.com/package/typescript)       | For strict type safety and better developer experience (Intellisense).       |
| [Biome](https://www.npmjs.com/package/@biomejs/biome)        | Next-gen toolchain for formatting and linting (faster than Prettier/ESLint). |
| [Allure](https://www.npmjs.com/package/allure-playwright)    | For beautiful, data-rich test reports.                                       |
| [Husky](https://www.npmjs.com/package/husky)                 | Git hooks to ensure code quality before commit.                              |
| [Dotenv](https://www.npmjs.com/package/dotenv)               | For secure environment variable management.                                  |
| [XLSX](https://www.npmjs.com/package/xlsx)                   | For Data-Driven Testing (DDT) using Excel files.                             |

> **Pro Tip:** For the best development experience, we recommend installing the [Biome IntelliJ plugin](https://plugins.jetbrains.com/plugin/22761-biome).

---

## ⚙️ Setup Instructions

### 1. Clone

```bash
git clone https://github.com/nirtal85/playwright-typescript-example.git
cd playwright-typescript-example
```

### 2. Install Dependencies

We use `pnpm` for fast and efficient package management.

```bash
corepack enable
pnpm install
```

### 3. Install Browsers

```bash
playwright install --with-deps
```

### 4. Configuration

Create a `.env` file  in the project root directory.

#### General Configuration

| Parameter | Description             | Example Value         |
|-----------|-------------------------|-----------------------|
| DOMAIN    | Environment (DEV, PROD) | "DEV"                 |
| BASE_URL  | Application URL         | "https://example.com" |
| LD_TOKEN  | LaunchDarkly API Token  | "api-xxx"             |

#### Database & Services

| Parameter   | Description                       |
|-------------|-----------------------------------|
| DB_HOST     | MySQL Connection details          |
| DB_USER     | MySQL Connection details          |
| DB_PASSWORD | MySQL Connection details          |
| SFTP_HOST   | SFTP Connection details           |
| SFTP_USER   | SFTP Connection details           |
| VRT_APIURL  | Visual Regression Tracker details |
| VRT_APIKEY  | Visual Regression Tracker details |

## 🏃‍♂️ Execution

Run all tests:

```bash
playwright test
```

Run via UI Mode (Interactive):

```bash
playwright test --ui
```

## 📊 Viewing Test Results

We use Allure for reporting. To view results locally:

```bash
pnpm exec allure generate allure-results --output allure-report --open
```

👉 [See a Live Example of the Report Here](https://nirtal85.github.io/Playwright-Typescript-Example/)

---

<div align="center">

Found this project useful?
If this architecture helped you solve a problem or save time, consider supporting the work!

<a href="https://www.buymeacoffee.com/nirtal"> <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="60" alt="Buy Me A Coffee" /> </a>

<br />

[Visit TestShift.com for more Architectural Insights](https://www.test-shift.com)

</div>
