# COMP4442_springboot-aws

# Task Manager – Spring Boot on AWS

## Features
- User registration and login with JWT authentication
- Task CRUD operations (each user sees only their own tasks)
- Redis caching for task lists (10 minutes TTL)
- PostgreSQL database (RDS ready)
- Swagger UI API documentation at `/swagger-ui.html`
- Fully containerized with Docker
- CI/CD with GitHub Actions to AWS Elastic Beanstalk
- Responsive frontend built with Bootstrap

## Tech Stack
- Spring Boot 3.2.5
- Spring Security + JWT
- Spring Data JPA + PostgreSQL
- Redis (caching)
- Docker
- AWS Elastic Beanstalk + RDS + ElastiCache
- GitHub Actions

## Local Development
1. Start PostgreSQL and Redis (or use H2 for quick test)
2. Update `application.properties` with your DB or Redis credentials
3. Run `./gradlew bootRun`
4. Access `http://localhost:8080`

## Deployment to AWS
- Push to `main` branch triggers GitHub Actions
- Automatically builds Docker image, uploads to Elastic Beanstalk
- Ensure you have set AWS secrets in GitHub

## API Endpoints (Protected by JWT)
| Method | Endpoint          | Description |
|--------|-------------------|-------------|
| POST   | /api/auth/login   | Login, returns JWT |
| POST   | /api/auth/register| Register new user |
| GET    | /api/tasks        | Get all tasks of current user |
| POST   | /api/tasks        | Create a task |
| PUT    | /api/tasks/{id}   | Update task |
| DELETE | /api/tasks/{id}   | Delete task |