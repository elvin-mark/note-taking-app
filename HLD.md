# High-Level Design (HLD)

## 1. Overview

This document outlines the high-level architecture and design of the Notion-like note-taking application. The application is designed to be a single-page application (SPA) with a backend-as-a-service (BaaS).

## 2. Architecture

The system is composed of two main components:

-   **Frontend Application:** A Vue.js Single-Page Application (SPA) that runs in the user's browser. It is responsible for the user interface, user experience, and all client-side logic.
-   **Backend Service:** A PocketBase instance that provides the database, user authentication, and a real-time API.

### 2.1. Frontend (Vue.js)

-   **Framework:** Vue.js 3 with the Composition API.
-   **Build Tool:** Vite for fast development and optimized builds.
-   **Routing:** `vue-router` handles all client-side routing, enabling seamless navigation without full page reloads.
-   **State Management:** `pinia` is used to manage global application state, including the authenticated user's session and cached data like the page tree.
-   **Styling:** TailwindCSS is used for a utility-first styling approach.

### 2.2. Backend (PocketBase)

-   **Service:** A pre-built PocketBase executable.
-   **Authentication:** PocketBase's built-in authentication will be used to manage users, sessions, and access control.
-   **Database:** PocketBase's integrated database will store all application data.

## 3. Data Models (PocketBase Collections)

The following collections will be created in PocketBase:

### `users` (built-in)

-   Standard PocketBase users collection.

### `pages`

-   `title` (text, required)
-   `content` (json) - To store rich-text content from the editor (e.g., TipTap JSON output).
-   `parent` (relation to `pages`) - For creating hierarchical structures. Null for top-level pages.
-   `owner` (relation to `users`, required) - To enforce ownership and permissions.

### `tasks`

-   `title` (text, required)
-   `completed` (boolean, default: false)
-   `page` (relation to `pages`) - The page this task belongs to.
-   `owner` (relation to `users`, required)

## 4. Core Feature Flow: Creating a Page

1.  User clicks "New Page" in the UI.
2.  The Pinia store updates the local state to show a new, unsaved page in the sidebar.
3.  The Vue.js client sends a `create` request to the PocketBase `pages` collection via the JS SDK. The request includes the `title`, an empty `content` object, the `owner` (current user's ID), and a `parent` ID if it's a sub-page.
4.  PocketBase creates the record and returns the new page object, including its ID.
5.  The client updates the page in the Pinia store with the ID received from the backend.

## 5. Core Feature Flow: Task Management

1.  When a user selects a page, the `TaskList` component is displayed.
2.  The `TaskList` component's `watch` hook on the `pageId` prop calls the `fetchTasks` action in the `tasks` Pinia store.
3.  The `tasks` store sends a `getList` request to the PocketBase `tasks` collection, filtering by the `pageId`.
4.  The UI displays the list of tasks.
5.  A user can add a new task by typing in the input field and clicking "Add". This calls the `createTask` action in the `tasks` store.
6.  A user can mark a task as complete by clicking the checkbox. This calls the `updateTask` action.
7.  A user can delete a task by clicking the delete button. This calls the `deleteTask` action.
