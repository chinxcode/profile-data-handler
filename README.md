# Profile Data Handler - LeetCode Competition API

A modular Node.js application for managing LeetCode competition data, students, and events.

## Features

- **Student Management**: Full CRUD operations for managing students
- **Event Management**: Create and manage multiple competition events
- **Competition Tracking**: Track student performance across different events
- **Leaderboard System**: Dynamic leaderboards with ranking system
- **Flexible Year Support**: Support for any year values (not limited to 1, 2, 3)
- **Bulk Operations**: Import multiple students at once

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file with the following variables:

```
USER=<mongodb_username>
PASSWORD=<mongodb_password>
CLUSTER=<mongodb_cluster>
PORT=3000
LEETSCAN_API_URL=<leetcode_api_url>

# Legacy support (optional)
COMPETITION_START_TIME=<unix_timestamp>
COMPETITION_END_TIME=<unix_timestamp>
```

## Running the Application

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Student Management

#### Get All Students
```
GET /api/students?year=<year>&isActive=<true|false>&page=<page>&limit=<limit>
```

#### Get Student by Username
```
GET /api/students/:username
```

#### Get Students by Year
```
GET /api/students/year/:year
```

#### Create Student
```
POST /api/students
Content-Type: application/json

{
  "username": "john_doe",
  "name": "John Doe",
  "enrollment": "12345",
  "year": 2
}
```

#### Update Student
```
PUT /api/students/:username
Content-Type: application/json

{
  "name": "John Doe Updated",
  "year": 3,
  "isActive": true
}
```

#### Delete Student (Soft Delete)
```
DELETE /api/students/:username
```

#### Permanently Delete Student
```
DELETE /api/students/:username/permanent
```

#### Bulk Import Students
```
POST /api/students/bulk-import
Content-Type: application/json

{
  "students": [
    {
      "username": "user1",
      "name": "User One",
      "enrollment": "12345",
      "year": 1
    },
    {
      "username": "user2",
      "name": "User Two",
      "enrollment": "12346",
      "year": 2
    }
  ]
}
```

### Event Management

#### Get All Events
```
GET /api/events?isActive=<true|false>&page=<page>&limit=<limit>
```

#### Get Active Events
```
GET /api/events/active
```

#### Get Event by ID
```
GET /api/events/:id
```

#### Create Event
```
POST /api/events
Content-Type: application/json

{
  "name": "Spring 2024 LeetCode Competition",
  "description": "Annual coding competition for all years",
  "startTime": 1704067200000,
  "endTime": 1709251200000,
  "years": [1, 2, 3, 4],
  "isActive": true
}
```

#### Update Event
```
PUT /api/events/:id
Content-Type: application/json

{
  "name": "Updated Event Name",
  "isActive": false
}
```

#### Delete Event (Soft Delete)
```
DELETE /api/events/:id
```

#### Permanently Delete Event
```
DELETE /api/events/:id/permanent
```

### Competition Data

#### Update Competition Data (Legacy)
```
GET /api/update-competition-data
```

#### Update Competition Data by Event
```
POST /api/events/:eventId/update-data
```

#### Get Leaderboard (Legacy)
```
GET /api/leaderboard-data?year=<year>
```

#### Get Leaderboard by Event
```
GET /api/events/:eventId/leaderboard?year=<year>
```

### Health Check
```
GET /health
```

## Data Models

### User/Student Model

```javascript
{
  username: String (required, unique),
  name: String,
  enrollment: String,
  year: Number,
  rank: Number (default: 0),
  score: Number (default: 0),
  totalQuestionsSolved: Number (default: 0),
  easyQuestionsSolved: Number (default: 0),
  mediumQuestionsSolved: Number (default: 0),
  hardQuestionsSolved: Number (default: 0),
  solvedQuestions: Map,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Event Model

```javascript
{
  name: String (required),
  description: String,
  startTime: Number (required, Unix timestamp),
  endTime: Number (required, Unix timestamp),
  years: [Number],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## Score Calculation

- Easy Question: 10 points
- Medium Question: 15 points
- Hard Question: 20 points

## Importing Users from CSV

Use the import script to bulk import users:

```bash
node src/scripts/importUsers.js path/to/students.csv
```

CSV format:
```csv
username,name,enrollment,year
user1,John Doe,123456,1
user2,Jane Smith,234567,2
```

## Architecture

The application follows a modular MVC architecture:

- **Models**: Data schemas (User, Event, QuestionCache)
- **Controllers**: Business logic (studentController, eventController, competitionController)
- **Services**: Data access and external API calls (userService, leetcodeService)
- **Routes**: API endpoint definitions
- **Middleware**: Request validation and processing
- **Utils**: Helper functions (score calculation)

## Technologies Used

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB/Mongoose**: Database and ODM
- **Axios**: HTTP client for external APIs
- **CORS**: Cross-origin resource sharing
- **Express Rate Limit**: API rate limiting

## License

MIT
