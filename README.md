# CRUD API

A lightweight and scalable CRUD API built with TypeScript and Node.js, featuring in-memory database storage, multi-process support, and a clean code architecture.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Response Codes](#response-codes)
- [Scripts](#scripts)
- [Technology Stack](#technology-stack)
- [License](#license)

## Features

- Full CRUD functionality for managing users.
- Horizontal scaling support using Node.js Cluster API.
- Lightweight in-memory database for simplicity and speed.
- Optimized build and development scripts for a smooth workflow.
- Linting and formatting with ESLint and Prettier.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/JuliaBel5/crud-api.git
   cd crud-api
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and define your environment variables:

   ```plaintext
   PORT=4000
   ```

## Usage

### Development

To start the development server with hot-reloading, run:

```bash
npm run start:dev
```

### Production

To build and start the server for production:

```bash
npm run build
npm run start:prod
```

### Multi-Mode (Cluster Support)

To start the server in multi-process mode with cluster support:

```bash
 npm run start:multi
```

API Endpoints
User Routes:

### API Endpoints

- **GET /api/users** - Retrieve all users.
- **GET /api/users/userId** - Retrieve a user by their ID.
- **POST /api/users** - Create a new user.
- **PUT /api/users/userId** - Update an existing user.
- **DELETE /api/users/userId** - Delete a user by their ID.

### Response Codes

- **200 OK** - The request was successful.
- **201 Created** - The resource was successfully created.
- **204 No Content** - The resource was successfully deleted.
- **400 Bad Request** - The request data is invalid or malformed.
- **404 Not Found** - The specified resource was not found.

### Scripts

- **build**: Compiles the TypeScript code into JavaScript.
- **start:dev**: Runs the server in development mode with `tsx` and hot-reloading.
- **start:prod**: Runs the production build.
- **start:multi**: Runs the server in production with multiple processes (Node.js Cluster API).
- **lint**: Runs ESLint on the codebase to ensure code quality.
- **test**: Executes tests using Jest.

### Technology Stack

- **Node.js** - JavaScript runtime used for building the API.
- **TypeScript** - Provides type safety and modern JavaScript features.
- **Webpack** - For handling TypeScript files in development.
- **Jest** - Testing framework for running unit tests.
- **Supertest** - HTTP assertions for testing API endpoints.
- **ESLint & Prettier** - Linting and code formatting tools for maintaining code quality.

### License

This project is licensed under the ISC License.
