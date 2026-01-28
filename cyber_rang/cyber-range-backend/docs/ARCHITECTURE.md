
### Architecture
The Cyber Range follows a microservices-ready structure built on Node.js/Express.

#### Core Modules
- **Controllers**: Handle HTTP requests/validation.
- **Services**: Business logic decoupled from protocols. (e.g. `LabManager`, `SessionManager`).
- **Models**: Mongoose schemas for MongoDB.
- **Infrastructure**: Services that talk to external systems (e.g. `DockerService` for containers).

#### Database Schema
- **User**: Stores profile, RBAC roles, and progression stats.
- **Lab**: Defines vulnerabilities (points, difficulty, attached Docker image).
- **ActiveSession**: Tracks running Docker containers mapped to users.
- **LabCategory**: Taxonomy for labs.

#### Security
- **Authentication**: JWT Access Token (15m) + Reference Refresh Token (7d).
- **Authorization**: Middleware-based RBAC (`authorize('admin')`).
- **Isolation**: Each user lab runs in a separate Docker container with ephemeral networks.

#### Flow
1. User logs in -> Receive JWT.
2. User requests lab start -> `SessionController` checks limits.
3. `SessionManager` calls `DockerService` -> Containers spin up.
4. User receives connection details (IP/Port).
