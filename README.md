# Notion-Like Note-Taking App

A web application for knowledge sharing, organization, project management, and task tracking, inspired by Notion.

## Tech Stack

- **Frontend:** Vue.js, Vite, Vue Router, Pinia, TailwindCSS
- **Backend:** Go, PocketBase (as a library)
- **Containerization:** Docker, Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js and npm (for frontend development, if not using Docker for frontend)

### Running with Docker Compose (Recommended)

1.  Ensure Docker and Docker Compose are installed and running.
2.  From the project root directory, build and start the services:
    ```sh
    docker compose up --build
    ```
3.  The frontend will be accessible at `http://localhost:8080` and the backend API at `http://localhost:8090`.

### Frontend Development Setup (without Docker Compose)

1.  Ensure the backend is running (e.g., via `docker compose up backend`).
2.  Navigate to the `frontend` directory:
    ```sh
    cd frontend
    ```
3.  Install dependencies:
    ```sh
    npm install
    ```
4.  Start the development server:
    ```sh
    npm run dev
    ```

### Backend Development Setup (without Docker Compose)

1.  Navigate to the `backend` directory:
    ```sh
    cd backend
    ```
2.  Run the Go application:
    ```sh
    go run main.go
    ```
    (Note: This assumes Go is installed and configured. For a full development setup, refer to the `backend/Makefile`.)

## Features (Planned)

- [ ] User Authentication (Login/Register)
- [ ] CRUD operations for Pages
- [ ] Rich-text editor for page content with preview toggle
- [ ] Hierarchical page organization with collapsible sections
- [ ] Real-time collaboration
- [ ] Task management
