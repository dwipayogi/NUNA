## API Endpoints Documentation

### Authentication

#### Register a new user

- **Endpoint:** `POST /api/auth/register`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "username": "user1",
    "email": "user1@example.com",
    "password": "password123"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-string",
      "email": "user1@example.com",
      "username": "user1"
    }
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: User already exists
  - `500 Server Error`: Server error

#### Login

- **Endpoint:** `POST /api/auth/login`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "user1@example.com",
    "password": "password123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-string",
      "email": "user1@example.com",
      "username": "user1"
    }
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Invalid credentials
  - `500 Server Error`: Server error

#### Get User Profile

- **Endpoint:** `GET /api/auth/profile`
- **Access:** Protected (requires authentication)
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **Response (200 OK):**
  ```json
  {
    "message": "Profile accessed successfully",
    "user": {
      "id": "uuid-string",
      "email": "user1@example.com",
      "username": "user1"
    }
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Not authorized, no token or invalid token
  - `500 Server Error`: Server error

---

### Journals (All Protected)

#### Get All Journals

- **Endpoint:** `GET /api/journals`
- **Access:** Protected
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **Response (200 OK):**
  ```json
  [
    {
      "id": "uuid-string",
      "title": "My Journal",
      "content": "Today was a good day",
      "mood": "happy",
      "createdAt": "2023-01-15T10:30:00Z",
      "updatedAt": "2023-01-15T10:30:00Z",
      "userId": "user-uuid-string"
    },
    ...
  ]
  ```
- **Error Responses:**
  - `401 Unauthorized`: Not authorized
  - `500 Server Error`: Server error

#### Get Journal by ID

- **Endpoint:** `GET /api/journals/:id`
- **Access:** Protected (only the owner can access)
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **Response (200 OK):**
  ```json
  {
    "id": "uuid-string",
    "title": "My Journal",
    "content": "Today was a good day",
    "mood": "happy",
    "createdAt": "2023-01-15T10:30:00Z",
    "updatedAt": "2023-01-15T10:30:00Z",
    "userId": "user-uuid-string"
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Not authorized
  - `403 Forbidden`: Not authorized to access this journal
  - `404 Not Found`: Journal not found
  - `500 Server Error`: Server error

#### Create Journal

- **Endpoint:** `POST /api/journals`
- **Access:** Protected
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **Request Body:**
  ```json
  {
    "title": "My Journal",
    "content": "Today was a good day",
    "mood": "happy"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id": "uuid-string",
    "title": "My Journal",
    "content": "Today was a good day",
    "mood": "happy",
    "createdAt": "2023-01-15T10:30:00Z",
    "updatedAt": "2023-01-15T10:30:00Z",
    "userId": "user-uuid-string"
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Title and content are required
  - `401 Unauthorized`: Not authorized
  - `500 Server Error`: Server error

#### Update Journal

- **Endpoint:** `PUT /api/journals/:id`
- **Access:** Protected (only the owner can update)
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **Request Body:**
  ```json
  {
    "title": "Updated Title",
    "content": "Updated content",
    "mood": "relaxed"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "id": "uuid-string",
    "title": "Updated Title",
    "content": "Updated content",
    "mood": "relaxed",
    "createdAt": "2023-01-15T10:30:00Z",
    "updatedAt": "2023-01-15T11:45:00Z",
    "userId": "user-uuid-string"
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Not authorized
  - `403 Forbidden`: Not authorized to update this journal
  - `404 Not Found`: Journal not found
  - `500 Server Error`: Server error

#### Delete Journal

- **Endpoint:** `DELETE /api/journals/:id`
- **Access:** Protected (only the owner can delete)
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **Response (200 OK):**
  ```json
  {
    "message": "Journal deleted successfully"
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Not authorized
  - `403 Forbidden`: Not authorized to delete this journal
  - `404 Not Found`: Journal not found
  - `500 Server Error`: Server error

---

### Posts

#### Get All Posts

- **Endpoint:** `GET /api/posts`
- **Access:** Public
- **Response (200 OK):**
  ```json
  [
    {
      "id": "uuid-string",
      "title": "Post Title",
      "content": "Post content",
      "tags": ["tag1", "tag2"],
      "likes": 5,
      "commentsCount": 2,
      "createdAt": "2023-01-15T10:30:00Z",
      "updatedAt": "2023-01-15T10:30:00Z",
      "userId": "user-uuid-string",
      "user": {
        "id": "user-uuid-string",
        "username": "user1"
      },
      "comments": [
        {
          "id": "comment-uuid-string",
          "content": "Comment text",
          "createdAt": "2023-01-15T11:00:00Z",
          "user": {
            "id": "user-uuid-string",
            "username": "commenter"
          }
        }
      ]
    },
    ...
  ]
  ```
- **Error Response:**
  - `500 Server Error`: Server error

#### Get Post by ID

- **Endpoint:** `GET /api/posts/:id`
- **Access:** Public
- **Response (200 OK):**
  ```json
  {
    "id": "uuid-string",
    "title": "Post Title",
    "content": "Post content",
    "tags": ["tag1", "tag2"],
    "likes": 5,
    "commentsCount": 2,
    "createdAt": "2023-01-15T10:30:00Z",
    "updatedAt": "2023-01-15T10:30:00Z",
    "userId": "user-uuid-string",
    "user": {
      "id": "user-uuid-string",
      "username": "user1"
    },
    "comments": [
      {
        "id": "comment-uuid-string",
        "content": "Comment text",
        "createdAt": "2023-01-15T11:00:00Z",
        "user": {
          "id": "user-uuid-string",
          "username": "commenter"
        }
      }
    ]
  }
  ```
- **Error Responses:**
  - `404 Not Found`: Post not found
  - `500 Server Error`: Server error

#### Get Posts by User ID

- **Endpoint:** `GET /api/posts/user/:userId`
- **Access:** Public
- **Response (200 OK):**
  ```json
  [
    {
      "id": "uuid-string",
      "title": "Post Title",
      "content": "Post content",
      "tags": ["tag1", "tag2"],
      "likes": 5,
      "commentsCount": 2,
      "createdAt": "2023-01-15T10:30:00Z",
      "updatedAt": "2023-01-15T10:30:00Z",
      "userId": "user-uuid-string",
      "comments": []
    },
    ...
  ]
  ```
- **Error Response:**
  - `500 Server Error`: Server error

#### Get Current User's Posts

- **Endpoint:** `GET /api/posts/my/posts`
- **Access:** Protected
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **Response (200 OK):**
  ```json
  [
    {
      "id": "uuid-string",
      "title": "Post Title",
      "content": "Post content",
      "tags": ["tag1", "tag2"],
      "likes": 5,
      "commentsCount": 2,
      "createdAt": "2023-01-15T10:30:00Z",
      "updatedAt": "2023-01-15T10:30:00Z",
      "userId": "user-uuid-string",
      "comments": []
    },
    ...
  ]
  ```
- **Error Responses:**
  - `401 Unauthorized`: Not authorized
  - `500 Server Error`: Server error

#### Create Post

- **Endpoint:** `POST /api/posts`
- **Access:** Protected
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **Request Body:**
  ```json
  {
    "title": "Post Title",
    "content": "Post content",
    "tags": ["tag1", "tag2"]
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id": "uuid-string",
    "title": "Post Title",
    "content": "Post content",
    "tags": ["tag1", "tag2"],
    "createdAt": "2023-01-15T10:30:00Z",
    "updatedAt": "2023-01-15T10:30:00Z",
    "userId": "user-uuid-string"
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Title and content are required
  - `401 Unauthorized`: Not authorized
  - `500 Server Error`: Server error

#### Update Post

- **Endpoint:** `PUT /api/posts/:id`
- **Access:** Protected (only the owner can update)
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **Request Body:**
  ```json
  {
    "title": "Updated Title",
    "content": "Updated content",
    "tags": ["updated", "tags"]
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "id": "uuid-string",
    "title": "Updated Title",
    "content": "Updated content",
    "tags": ["updated", "tags"],
    "createdAt": "2023-01-15T10:30:00Z",
    "updatedAt": "2023-01-15T11:45:00Z",
    "userId": "user-uuid-string"
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Not authorized
  - `403 Forbidden`: Not authorized to update this post
  - `404 Not Found`: Post not found
  - `500 Server Error`: Server error

#### Delete Post

- **Endpoint:** `DELETE /api/posts/:id`
- **Access:** Protected (only the owner can delete)
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **Response (200 OK):**
  ```json
  {
    "message": "Post deleted successfully"
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Not authorized
  - `403 Forbidden`: Not authorized to delete this post
  - `404 Not Found`: Post not found
  - `500 Server Error`: Server error

#### Like Post

- **Endpoint:** `POST /api/posts/:id/like`
- **Access:** Protected
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **Response (200 OK):**
  ```json
  {
    "message": "Post liked successfully",
    "likes": 6
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Not authorized
  - `404 Not Found`: Post not found
  - `500 Server Error`: Server error

#### Unlike Post

- **Endpoint:** `POST /api/posts/:id/unlike`
- **Access:** Protected
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **Response (200 OK):**
  ```json
  {
    "message": "Post unliked successfully",
    "likes": 5
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Post has no likes to remove
  - `401 Unauthorized`: Not authorized
  - `404 Not Found`: Post not found
  - `500 Server Error`: Server error

---

### Comments

#### Get Comments by Post ID

- **Endpoint:** `GET /api/comments/post/:postId`
- **Access:** Public
- **Response (200 OK):**
  ```json
  [
    {
      "id": "comment-uuid-string",
      "content": "Comment text",
      "createdAt": "2023-01-15T11:00:00Z",
      "updatedAt": "2023-01-15T11:00:00Z",
      "postId": "post-uuid-string",
      "userId": "user-uuid-string",
      "user": {
        "id": "user-uuid-string",
        "username": "commenter"
      }
    },
    ...
  ]
  ```
- **Error Response:**
  - `500 Server Error`: Server error

#### Create Comment

- **Endpoint:** `POST /api/comments`
- **Access:** Protected
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **Request Body:**
  ```json
  {
    "content": "Comment text",
    "postId": "post-uuid-string"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id": "comment-uuid-string",
    "content": "Comment text",
    "createdAt": "2023-01-15T11:00:00Z",
    "updatedAt": "2023-01-15T11:00:00Z",
    "postId": "post-uuid-string",
    "userId": "user-uuid-string",
    "user": {
      "id": "user-uuid-string",
      "username": "commenter"
    }
  }
  ```
- **Note:** Creates a comment and automatically increments the `commentsCount` of the associated post.
- **Error Responses:**
  - `400 Bad Request`: Comment content is required
  - `401 Unauthorized`: Not authorized
  - `404 Not Found`: Post not found
  - `500 Server Error`: Server error

#### Update Comment

- **Endpoint:** `PUT /api/comments/:id`
- **Access:** Protected (only the owner can update)
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **Request Body:**
  ```json
  {
    "content": "Updated comment"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "id": "comment-uuid-string",
    "content": "Updated comment",
    "createdAt": "2023-01-15T11:00:00Z",
    "updatedAt": "2023-01-15T11:15:00Z",
    "postId": "post-uuid-string",
    "userId": "user-uuid-string",
    "user": {
      "id": "user-uuid-string",
      "username": "commenter"
    }
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Comment content is required
  - `401 Unauthorized`: Not authorized
  - `403 Forbidden`: Not authorized to update this comment
  - `404 Not Found`: Comment not found
  - `500 Server Error`: Server error

#### Delete Comment

- **Endpoint:** `DELETE /api/comments/:id`
- **Access:** Protected (owner of comment or post can delete)
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **Response (200 OK):**
  ```json
  {
    "message": "Comment deleted successfully"
  }
  ```
- **Note:** Deletes a comment and automatically decrements the `commentsCount` of the associated post.
- **Error Responses:**
  - `401 Unauthorized`: Not authorized
  - `403 Forbidden`: Not authorized to delete this comment
  - `404 Not Found`: Comment not found
  - `500 Server Error`: Server error

---

### Meditate (All Public)

#### Get All Meditations

- **Endpoint:** `GET /api/meditate`
- **Access:** Public
- **Response (200 OK):**
  ```json
  [
    {
      "id": "uuid-string",
      "title": "Morning Meditation",
      "description": "Start your day with clarity",
      "longDescription": "A comprehensive morning meditation that helps you set intentions for the day",
      "duration": 300,
      "imageUrl": "https://example.com/meditation-image.jpg",
      "steps": ["Find a quiet place", "Sit comfortably", "Close your eyes", "Focus on your breath"],
      "createdAt": "2023-01-15T10:30:00Z",
      "updatedAt": "2023-01-15T10:30:00Z"
    },
    ...
  ]
  ```
- **Error Response:**
  - `500 Server Error`: Server error

#### Get Meditation by ID

- **Endpoint:** `GET /api/meditate/:id`
- **Access:** Public
- **Response (200 OK):**
  ```json
  {
    "id": "uuid-string",
    "title": "Morning Meditation",
    "description": "Start your day with clarity",
    "longDescription": "A comprehensive morning meditation that helps you set intentions for the day",
    "duration": 300,
    "imageUrl": "https://example.com/meditation-image.jpg",
    "steps": [
      "Find a quiet place",
      "Sit comfortably",
      "Close your eyes",
      "Focus on your breath"
    ],
    "createdAt": "2023-01-15T10:30:00Z",
    "updatedAt": "2023-01-15T10:30:00Z"
  }
  ```
- **Error Responses:**
  - `404 Not Found`: Meditation not found
  - `500 Server Error`: Server error

#### Create Meditation

- **Endpoint:** `POST /api/meditate`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "title": "Morning Meditation",
    "description": "Start your day with clarity",
    "longDescription": "A comprehensive morning meditation that helps you set intentions for the day",
    "duration": 300,
    "imageUrl": "https://example.com/meditation-image.jpg",
    "steps": [
      "Find a quiet place",
      "Sit comfortably",
      "Close your eyes",
      "Focus on your breath"
    ]
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id": "uuid-string",
    "title": "Morning Meditation",
    "description": "Start your day with clarity",
    "longDescription": "A comprehensive morning meditation that helps you set intentions for the day",
    "duration": 300,
    "imageUrl": "https://example.com/meditation-image.jpg",
    "steps": [
      "Find a quiet place",
      "Sit comfortably",
      "Close your eyes",
      "Focus on your breath"
    ],
    "createdAt": "2023-01-15T10:30:00Z",
    "updatedAt": "2023-01-15T10:30:00Z"
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Required fields missing
  - `500 Server Error`: Server error

#### Update Meditation

- **Endpoint:** `PUT /api/meditate/:id`
- **Access:** Public
- **Request Body:** (All fields are optional)
  ```json
  {
    "title": "Updated Meditation",
    "description": "Updated description",
    "longDescription": "Updated long description",
    "duration": 450,
    "imageUrl": "https://example.com/updated-image.jpg",
    "steps": ["Updated step 1", "Updated step 2"]
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "id": "uuid-string",
    "title": "Updated Meditation",
    "description": "Updated description",
    "longDescription": "Updated long description",
    "duration": 450,
    "imageUrl": "https://example.com/updated-image.jpg",
    "steps": ["Updated step 1", "Updated step 2"],
    "createdAt": "2023-01-15T10:30:00Z",
    "updatedAt": "2023-01-15T11:45:00Z"
  }
  ```
- **Error Responses:**
  - `404 Not Found`: Meditation not found
  - `500 Server Error`: Server error

#### Delete Meditation

- **Endpoint:** `DELETE /api/meditate/:id`
- **Access:** Public
- **Response (200 OK):**
  ```json
  {
    "message": "Meditation deleted successfully"
  }
  ```
- **Error Responses:**
  - `404 Not Found`: Meditation not found
  - `500 Server Error`: Server error

---

### Chat

#### Chat with AI

- **Endpoint:** `POST /api/chat`
- **Access:** Protected
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **Request Body:**
  ```json
  {
    "message": "Saya merasa stres akhir-akhir ini, bagaimana cara mengatasinya?"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "role": "bot",
    "content": "Stres adalah respons alami tubuh terhadap tekanan. Ada beberapa cara yang bisa membantu mengatasi stres, seperti meditasi, olahraga teratur, tidur yang cukup, dan berbicara dengan orang terdekat. Penting juga untuk mengidentifikasi sumber stres dan mencoba mengelolanya. Jika stres Anda sangat parah atau berkelanjutan, jangan ragu untuk mencari bantuan dari profesional kesehatan mental."
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Message is required
  - `401 Unauthorized`: Not authorized
  - `500 Server Error`: Server error

#### Get AI Recommendations

- **Endpoint:** `GET /api/chat/recommendations`
- **Access:** Protected
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **Description:** Gets AI-generated recommendations based on the authenticated user's journal entries
- **Response (200 OK):**
  ```json
  {
    "response": "Berdasarkan analisis mood dari jurnal Anda, tampaknya Anda sedang mengalami periode kecemasan ringan dengan beberapa momen reflektif. Saya merekomendasikan meditasi pernapasan mendalam selama 10-15 menit di pagi hari untuk membantu menenangkan pikiran dan meditasi body scan di malam hari untuk membantu tidur yang lebih nyenyak."
  }
  ```
- **Note:** Recommendations are generated automatically based on the authenticated user's journal entries
- **Error Responses:**
  - `401 Unauthorized`: Not authorized
  - `404 Not Found`: No journal entries found for recommendations
  - `500 Server Error`: Server error

---

### Mood History (All Protected)

#### Create Mood Entry

- **Endpoint:** `POST /api/mood-history`
- **Access:** Protected
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **Description:** Creates a new mood entry and automatically ends any active mood entry
- **Request Body:**
  ```json
  {
    "mood": "Hebat"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id": "uuid-string",
    "userId": "user-uuid-string",
    "mood": "Hebat",
    "startTime": "2023-06-15T08:30:00Z",
    "endTime": null,
    "durationMinutes": null,
    "createdAt": "2023-06-15T08:30:00Z",
    "updatedAt": "2023-06-15T08:30:00Z"
  }
  ```
- **Note:** When creating a new mood entry, any previous active mood entry will be automatically ended and its duration calculated
- **Error Responses:**
  - `401 Unauthorized`: Not authorized
  - `500 Server Error`: Server error

#### Get Active Mood

- **Endpoint:** `GET /api/mood-history/active`
- **Access:** Protected
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **Description:** Gets the user's currently active mood (if any)
- **Response (200 OK):**
  ```json
  {
    "id": "uuid-string",
    "userId": "user-uuid-string",
    "mood": "Hebat",
    "startTime": "2023-06-15T08:30:00Z",
    "endTime": null,
    "durationMinutes": null,
    "createdAt": "2023-06-15T08:30:00Z",
    "updatedAt": "2023-06-15T08:30:00Z"
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Not authorized
  - `404 Not Found`: No active mood found
  - `500 Server Error`: Server error

#### Update Mood Entry

- **Endpoint:** `PUT /api/mood-history/:id`
- **Access:** Protected
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **Description:** Updates a mood entry, typically to end it and calculate duration
- **Request Body:**
  ```json
  {
    "endTime": "2023-06-15T12:30:00Z"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "id": "uuid-string",
    "userId": "user-uuid-string",
    "mood": "Hebat",
    "startTime": "2023-06-15T08:30:00Z",
    "endTime": "2023-06-15T12:30:00Z",
    "durationMinutes": 240,
    "createdAt": "2023-06-15T08:30:00Z",
    "updatedAt": "2023-06-15T12:30:00Z"
  }
  ```
- **Note:** Duration in minutes is automatically calculated based on startTime and endTime
- **Error Responses:**
  - `401 Unauthorized`: Not authorized
  - `404 Not Found`: Mood entry not found
  - `500 Server Error`: Server error

#### Get Mood History

- **Endpoint:** `GET /api/mood-history`
- **Access:** Protected
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **Description:** Gets the user's mood history
- **Query Parameters:**
  - `limit` (optional): Number of records to return
  - `offset` (optional): Number of records to skip for pagination
- **Response (200 OK):**
  ```json
  [
    {
      "id": "uuid-string-1",
      "userId": "user-uuid-string",
      "mood": "Hebat",
      "startTime": "2023-06-15T08:30:00Z",
      "endTime": "2023-06-15T12:30:00Z",
      "durationMinutes": 240,
      "createdAt": "2023-06-15T08:30:00Z",
      "updatedAt": "2023-06-15T12:30:00Z"
    },
    {
      "id": "uuid-string-2",
      "userId": "user-uuid-string",
      "mood": "Baik",
      "startTime": "2023-06-15T12:30:00Z",
      "endTime": "2023-06-15T18:00:00Z",
      "durationMinutes": 330,
      "createdAt": "2023-06-15T12:30:00Z",
      "updatedAt": "2023-06-15T18:00:00Z"
    }
  ]
  ```
- **Error Responses:**
  - `401 Unauthorized`: Not authorized
  - `500 Server Error`: Server error

#### Get Mood Statistics

- **Endpoint:** `GET /api/mood-history/stats`
- **Access:** Protected
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **Description:** Gets statistics about the user's mood patterns over a period
- **Query Parameters:**
  - `days` (optional): Number of days to analyze (default: 7)
- **Response (200 OK):**
  ```json
  {
    "period": "7 days",
    "totalMinutes": 1560,
    "stats": {
      "Hebat": {
        "totalMinutes": 420,
        "percentage": 26.92,
        "count": 3
      },
      "Baik": {
        "totalMinutes": 680,
        "percentage": 43.59,
        "count": 5
      },
      "Oke": {
        "totalMinutes": 250,
        "percentage": 16.03,
        "count": 4
      },
      "Buruk": {
        "totalMinutes": 210,
        "percentage": 13.46,
        "count": 2
      }
    },
    "history": [
      {
        "id": "uuid-string-1",
        "userId": "user-uuid-string",
        "mood": "Hebat",
        "startTime": "2023-06-10T08:30:00Z",
        "endTime": "2023-06-10T12:30:00Z",
        "durationMinutes": 240,
        "createdAt": "2023-06-10T08:30:00Z",
        "updatedAt": "2023-06-10T12:30:00Z"
      }
      // More history entries...
    ]
  }
  ```
- **Note:** Provides detailed statistics about how much time the user spent in each mood state
- **Error Responses:**
  - `401 Unauthorized`: Not authorized
  - `500 Server Error`: Server error
