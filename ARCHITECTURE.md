# Architecture Documentation

## Overview

The Profile Data Handler follows a modular, layered architecture pattern that separates concerns and promotes maintainability, scalability, and testability.

## Architecture Layers

```
┌─────────────────────────────────────┐
│         Client / Frontend           │
└─────────────────┬───────────────────┘
                  │ HTTP Requests
┌─────────────────▼───────────────────┐
│          Routes Layer               │
│  (API Endpoint Definitions)         │
│  - competitionRoutes.js             │
│  - studentRoutes.js                 │
│  - eventRoutes.js                   │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│        Middleware Layer             │
│  (Validation & Processing)          │
│  - validator.js                     │
│  - rate limiting                    │
│  - CORS                             │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│       Controllers Layer             │
│  (Business Logic)                   │
│  - competitionController.js         │
│  - studentController.js             │
│  - eventController.js               │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│        Services Layer               │
│  (Data Access & External APIs)      │
│  - userService.js                   │
│  - leetcodeService.js               │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│         Models Layer                │
│  (Data Schemas)                     │
│  - User.js                          │
│  - Event.js                         │
│  - QuestionCache.js                 │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│        Database Layer               │
│  (MongoDB with Mongoose ODM)        │
└─────────────────────────────────────┘
```

## Layer Descriptions

### 1. Routes Layer
**Location**: `src/routes/`

**Purpose**: Define API endpoints and map HTTP requests to controller methods.

**Responsibilities**:
- URL routing and HTTP method mapping
- Request validation middleware attachment
- Parameter extraction from URLs
- Response formatting

**Files**:
- `competitionRoutes.js`: Competition-related endpoints
- `studentRoutes.js`: Student management endpoints
- `eventRoutes.js`: Event management endpoints

### 2. Middleware Layer
**Location**: `src/middleware/`

**Purpose**: Process requests before they reach controllers.

**Responsibilities**:
- Input validation
- Authentication (if implemented)
- Rate limiting
- CORS handling
- Error handling

**Files**:
- `validator.js`: Request validation logic

### 3. Controllers Layer
**Location**: `src/controllers/`

**Purpose**: Handle HTTP requests and orchestrate business logic.

**Responsibilities**:
- Request handling and response generation
- Calling appropriate service methods
- Error handling and status code management
- Data transformation for API responses
- Business logic orchestration

**Files**:
- `competitionController.js`: Competition data updates and leaderboards
- `studentController.js`: Student CRUD operations
- `eventController.js`: Event CRUD operations

### 4. Services Layer
**Location**: `src/services/`

**Purpose**: Encapsulate business logic and data access.

**Responsibilities**:
- Database queries and data manipulation
- External API calls (LeetCode API)
- Complex business logic
- Data transformation
- Caching logic

**Files**:
- `userService.js`: User/Student data operations
- `leetcodeService.js`: LeetCode API integration

### 5. Models Layer
**Location**: `src/models/`

**Purpose**: Define data structures and database schemas.

**Responsibilities**:
- Schema definitions
- Data validation rules
- Indexes for performance
- Virtual fields and methods
- Relationships between collections

**Files**:
- `User.js`: Student/User schema
- `Event.js`: Competition event schema
- `QuestionCache.js`: LeetCode question cache schema

### 6. Utils Layer
**Location**: `src/utils/`

**Purpose**: Provide reusable utility functions.

**Files**:
- `helpers.js`: Score calculation and other helpers

## Data Flow Example

### Creating a Student

```
1. Client Request
   POST /api/students
   Body: { username, name, enrollment, year }
   
2. Routes Layer (studentRoutes.js)
   - Maps POST /api/students to studentController.createStudent
   - Applies validation middleware
   
3. Middleware Layer (validator.js)
   - Validates required fields
   - Checks data types
   - Returns 400 if validation fails
   
4. Controller Layer (studentController.js)
   - Receives validated request
   - Checks for duplicate username
   - Calls User model to create document
   - Returns 201 with created student
   
5. Model Layer (User.js)
   - Creates new user document
   - Applies schema validation
   - Saves to database
   - Returns created document
   
6. Database Layer (MongoDB)
   - Stores document
   - Returns saved document with _id
```

### Updating Competition Data

```
1. Client Request
   POST /api/events/:eventId/update-data
   
2. Routes Layer (competitionRoutes.js)
   - Maps to competitionController.updateCompetitionDataByEvent
   
3. Controller Layer (competitionController.js)
   - Validates event exists
   - Fetches all users
   - Batches usernames
   
4. Service Layer (leetcodeService.js)
   - Calls external LeetCode API
   - Returns submission data
   
5. Service Layer (userService.js)
   - Processes submissions
   - Fetches question difficulties
   - Calculates scores
   - Updates user documents
   - Updates rankings
   
6. Model Layer (User.js)
   - Updates user documents in batch
   - Applies schema validation
   
7. Response
   - Returns success message to client
```

## Key Design Patterns

### 1. Separation of Concerns
Each layer has a specific responsibility and doesn't directly interact with non-adjacent layers.

### 2. Dependency Injection
Controllers depend on services, services depend on models. Dependencies are injected through require statements.

### 3. Repository Pattern
Services act as repositories, abstracting data access logic from controllers.

### 4. Factory Pattern
Models use Mongoose schemas which act as factories for creating documents.

### 5. Middleware Pattern
Express middleware for cross-cutting concerns like validation and rate limiting.

## Modularity Benefits

### 1. Easy to Test
- Each layer can be tested independently
- Mock dependencies for unit testing
- Integration tests can test entire flows

### 2. Easy to Maintain
- Changes in one layer don't affect others
- Clear responsibility boundaries
- Easy to locate bugs

### 3. Easy to Scale
- Add new features by adding new routes, controllers, and services
- Horizontal scaling by adding more instances
- Database optimization through model indexes

### 4. Easy to Extend
- Add new event types without changing core logic
- Support new competition rules by extending services
- Add authentication by adding middleware

## Configuration Management

**Location**: `src/config/`

**Purpose**: Centralize configuration settings.

**Files**:
- `database.js`: Database connection configuration

**Environment Variables**:
- `USER`: MongoDB username
- `PASSWORD`: MongoDB password
- `CLUSTER`: MongoDB cluster URL
- `PORT`: Server port
- `LEETSCAN_API_URL`: External LeetCode API URL
- `COMPETITION_START_TIME`: Legacy start time
- `COMPETITION_END_TIME`: Legacy end time

## Error Handling Strategy

### Controller Level
- Catch errors from services
- Return appropriate HTTP status codes
- Log errors for debugging

### Service Level
- Handle data validation errors
- Handle external API errors
- Throw errors to be caught by controllers

### Model Level
- Schema validation errors
- Unique constraint violations
- Required field violations

## Performance Optimizations

### 1. Database Indexes
- Indexed fields: `year`, `score`, `username`, `isActive`
- Compound indexes for common queries

### 2. Caching
- Question difficulty cached in `QuestionCache` collection
- Reduces external API calls

### 3. Batch Processing
- Process LeetCode data in batches of 30 users
- Reduces memory usage and improves throughput

### 4. Pagination
- All list endpoints support pagination
- Default limits prevent large data transfers

## Future Enhancements

### Potential Additions
1. **Authentication Layer**: Add JWT-based authentication
2. **Logging Service**: Centralized logging with Winston or Bunyan
3. **Caching Layer**: Redis for frequently accessed data
4. **Message Queue**: For async processing of competition updates
5. **Analytics Service**: Generate statistics and insights
6. **Notification Service**: Email/SMS notifications for events
7. **WebSocket Support**: Real-time leaderboard updates

### Scalability Considerations
1. **Microservices**: Split into separate services (Students, Events, Competition)
2. **Load Balancing**: Multiple server instances behind a load balancer
3. **Database Sharding**: Distribute data across multiple database instances
4. **CDN**: Serve static assets through CDN
5. **Containerization**: Docker containers for easy deployment

## Development Guidelines

### Adding a New Feature

1. **Define the Model** (if needed)
   - Create schema in `src/models/`
   - Add indexes for performance

2. **Create Service Methods**
   - Add data access logic in `src/services/`
   - Keep business logic here

3. **Create Controller**
   - Add request handling in `src/controllers/`
   - Call service methods
   - Handle errors

4. **Define Routes**
   - Add endpoints in `src/routes/`
   - Apply middleware

5. **Update App.js**
   - Register new routes

6. **Document**
   - Update README.md
   - Add examples to EXAMPLES.md
   - Update API collection

### Code Style
- Use async/await for asynchronous operations
- Always handle errors with try-catch
- Use meaningful variable names
- Add comments for complex logic
- Follow existing file structure

## Monitoring and Debugging

### Logging
- Console logging for development
- Should implement structured logging for production

### Health Checks
- `/health` endpoint for monitoring
- Returns server status

### Debugging Tips
1. Check MongoDB connection first
2. Verify environment variables
3. Check external API availability
4. Review request/response logs
5. Monitor database query performance

## Conclusion

This modular architecture provides a solid foundation for a scalable, maintainable application. Each layer has clear responsibilities, making it easy to understand, test, and extend the codebase.
