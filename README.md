# NUNA App

## API Integration

### Community Module

The community module has been updated to use real data from the API instead of dummy data. The following files were modified:

- Created `communityService.ts` to handle API requests
- Updated `community/index.tsx` to fetch and display community posts from API
- Updated `community/[id].tsx` to fetch and display post details from API
- Updated `community/create.tsx` to submit new posts to the API

### Meditation Module

The meditation module has been updated to use real data from the API instead of dummy data. The following files were modified:

- Created `meditateService.ts` to handle API requests
- Updated `meditate/index.tsx` to fetch and display meditation sessions from API
- Updated `meditate/[id].tsx` to fetch and display meditation details from API

## API Services

### Community Service

This service handles fetching community posts, creating new posts, and posting comments.

```typescript
// Key functions
getAllPosts()
getPostById(id: string)
createPost(postData: PostData)
createComment(commentData: CommentData)
```

### Meditation Service

This service handles fetching meditation sessions and categorizing them.

```typescript
// Key functions
getAllMeditations()
getMeditationById(id: string)
categorizeMeditations(meditations: Meditation[])
```

## Data Handling

Both modules implement proper loading states, error handling, and data display. When data is being fetched, a loading spinner is shown, and when there's an error, appropriate error messages are displayed with retry options.
