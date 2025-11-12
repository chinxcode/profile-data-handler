# API Usage Examples

This document provides practical examples of using the Profile Data Handler API.

## Prerequisites

- Server running on `http://localhost:3000`
- MongoDB connection configured
- `.env` file properly set up

## Example Workflows

### 1. Setting Up a New Competition

#### Step 1: Create an Event
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Winter 2024 LeetCode Competition",
    "description": "Winter semester coding competition for years 1-4",
    "startTime": 1704067200000,
    "endTime": 1709251200000,
    "years": [1, 2, 3, 4],
    "isActive": true
  }'
```

Response:
```json
{
  "message": "Event created successfully",
  "event": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Winter 2024 LeetCode Competition",
    "description": "Winter semester coding competition for years 1-4",
    "startTime": 1704067200000,
    "endTime": 1709251200000,
    "years": [1, 2, 3, 4],
    "isActive": true,
    "createdAt": "2024-01-13T10:00:00.000Z",
    "updatedAt": "2024-01-13T10:00:00.000Z"
  }
}
```

#### Step 2: Add Students
```bash
curl -X POST http://localhost:3000/api/students/bulk-import \
  -H "Content-Type: application/json" \
  -d '{
    "students": [
      {
        "username": "alice_code",
        "name": "Alice Johnson",
        "enrollment": "2024001",
        "year": 1
      },
      {
        "username": "bob_dev",
        "name": "Bob Smith",
        "enrollment": "2024002",
        "year": 2
      },
      {
        "username": "charlie_prog",
        "name": "Charlie Brown",
        "enrollment": "2024003",
        "year": 3
      }
    ]
  }'
```

Response:
```json
{
  "message": "Bulk import completed",
  "results": {
    "success": ["alice_code", "bob_dev", "charlie_prog"],
    "failed": []
  }
}
```

### 2. Managing Students

#### Add a Single Student
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "username": "david_tech",
    "name": "David Wilson",
    "enrollment": "2024004",
    "year": 4
  }'
```

#### Get All Students
```bash
curl http://localhost:3000/api/students
```

#### Filter Students by Year
```bash
curl http://localhost:3000/api/students?year=2
```

#### Get Students with Pagination
```bash
curl http://localhost:3000/api/students?page=1&limit=10
```

#### Get a Specific Student
```bash
curl http://localhost:3000/api/students/alice_code
```

#### Update a Student
```bash
curl -X PUT http://localhost:3000/api/students/alice_code \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson (Updated)",
    "year": 2
  }'
```

#### Deactivate a Student (Soft Delete)
```bash
curl -X DELETE http://localhost:3000/api/students/alice_code
```

### 3. Managing Events

#### Get All Events
```bash
curl http://localhost:3000/api/events
```

#### Get Only Active Events
```bash
curl http://localhost:3000/api/events/active
```

#### Get a Specific Event
```bash
curl http://localhost:3000/api/events/65a1b2c3d4e5f6g7h8i9j0k1
```

#### Update an Event
```bash
curl -X PUT http://localhost:3000/api/events/65a1b2c3d4e5f6g7h8i9j0k1 \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description for the competition",
    "years": [1, 2, 3, 4, 5]
  }'
```

#### Deactivate an Event
```bash
curl -X DELETE http://localhost:3000/api/events/65a1b2c3d4e5f6g7h8i9j0k1
```

### 4. Competition Operations

#### Update Competition Data for an Event
```bash
curl -X POST http://localhost:3000/api/events/65a1b2c3d4e5f6g7h8i9j0k1/update-data
```

Response:
```json
{
  "message": "Competition data updated successfully for event",
  "event": "Winter 2024 LeetCode Competition"
}
```

#### Get Leaderboard for an Event
```bash
curl http://localhost:3000/api/events/65a1b2c3d4e5f6g7h8i9j0k1/leaderboard
```

Response:
```json
{
  "event": "Winter 2024 LeetCode Competition",
  "leaderboard": [
    {
      "_id": "...",
      "username": "alice_code",
      "name": "Alice Johnson",
      "year": 1,
      "rank": 1,
      "score": 150,
      "totalQuestionsSolved": 8,
      "easyQuestionsSolved": 3,
      "mediumQuestionsSolved": 4,
      "hardQuestionsSolved": 1
    }
  ]
}
```

#### Get Leaderboard Filtered by Year
```bash
curl http://localhost:3000/api/events/65a1b2c3d4e5f6g7h8i9j0k1/leaderboard?year=2
```

### 5. Legacy Endpoints (Backward Compatibility)

#### Update Competition Data (using env variables)
```bash
curl http://localhost:3000/api/update-competition-data
```

#### Get Leaderboard (all students)
```bash
curl http://localhost:3000/api/leaderboard-data
```

#### Get Leaderboard by Year
```bash
curl http://localhost:3000/api/leaderboard-data?year=2
```

## Testing with JavaScript/Node.js

### Example: Creating an Event and Adding Students

```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function setupCompetition() {
  try {
    // Create an event
    const eventResponse = await axios.post(`${API_BASE}/events`, {
      name: 'Spring 2024 Competition',
      description: 'Spring semester coding challenge',
      startTime: Date.now(),
      endTime: Date.now() + (90 * 24 * 60 * 60 * 1000), // 90 days from now
      years: [1, 2, 3, 4],
      isActive: true
    });
    
    console.log('Event created:', eventResponse.data.event.name);
    const eventId = eventResponse.data.event._id;
    
    // Add students
    const studentsResponse = await axios.post(`${API_BASE}/students/bulk-import`, {
      students: [
        { username: 'student1', name: 'Student One', enrollment: 'E001', year: 1 },
        { username: 'student2', name: 'Student Two', enrollment: 'E002', year: 2 },
        { username: 'student3', name: 'Student Three', enrollment: 'E003', year: 3 }
      ]
    });
    
    console.log('Students imported:', studentsResponse.data.results.success);
    
    // Update competition data
    const updateResponse = await axios.post(`${API_BASE}/events/${eventId}/update-data`);
    console.log('Competition data updated:', updateResponse.data.message);
    
    // Get leaderboard
    const leaderboardResponse = await axios.get(`${API_BASE}/events/${eventId}/leaderboard`);
    console.log('Leaderboard:', leaderboardResponse.data.leaderboard);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

setupCompetition();
```

## Common Use Cases

### Scenario 1: Annual Competition with Multiple Years
1. Create an event covering all undergraduate years (1-4)
2. Import students from CSV or bulk API
3. Periodically update competition data to fetch latest LeetCode submissions
4. Display leaderboard filtered by year or overall

### Scenario 2: Semester-based Competitions
1. Create multiple events for Fall and Spring semesters
2. Assign specific years to each event
3. Track progress independently for each semester
4. Compare performance across semesters

### Scenario 3: Year-specific Challenges
1. Create separate events for each year (Freshers, Sophomores, etc.)
2. Set different time periods for each event
3. Maintain separate leaderboards
4. Award prizes per year category

### Scenario 4: Department-wide Tracking
1. Use unlimited year support to track graduate students (year 5+)
2. Create events spanning multiple years
3. Track long-term progress and engagement
4. Generate analytics on problem-solving patterns

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "error": "End time must be after start time"
}
```

#### 404 Not Found
```json
{
  "error": "Student not found"
}
```

#### 409 Conflict
```json
{
  "error": "Student with this username already exists"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Tips and Best Practices

1. **Event Planning**: Create events well in advance and set realistic time windows
2. **Student Management**: Use bulk import for initial setup, individual APIs for updates
3. **Data Updates**: Schedule periodic updates during active competitions (e.g., hourly)
4. **Leaderboard Queries**: Use year filters to reduce response size for large datasets
5. **Soft Deletes**: Use soft delete (deactivate) instead of permanent delete for auditing
6. **Pagination**: Always use pagination for large datasets to improve performance
7. **Testing**: Test with a small set of students before rolling out to full cohort

## Monitoring and Maintenance

### Health Check
```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### Database Queries
Regularly monitor:
- Number of active events
- Total students per year
- Competition data update frequency
- API response times
