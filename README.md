# Comment Search Application

A React-based application for searching comments using the JSONPlaceholder API. Built with TypeScript, React, and Vite.

## Features

- Search comments with a minimum of 3 characters
- Typeahead suggestions while typing
- Pagination with 20 results per page
- Dark/Light mode support
- Responsive design
- Docker support

## Quick Start with Docker

The easiest way to run the application:

```bash
# Build and start
docker build -t comment_search:latest . && docker run -p 8080:8080 comment_search:latest

# Or separately:
docker build -t comment_search:latest .  # Build
docker run -p 8080:8080 comment_search:latest  # Run

# Stop
docker stop $(docker ps -q --filter ancestor=comment_search:latest) && docker rm $(docker ps -aq --filter ancestor=comment_search:latest)
```

The application will be available at `http://localhost:8080`

## Local Development

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui
```

## Project Structure

```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── types/         # TypeScript types
├── test/          # Test utilities
└── App.tsx        # Main application component
```

## Tech Stack

- React 18
- TypeScript
- Vite
- Chakra UI
- React Query
- React Hook Form
- Docker

## Requirements Implemented

✅ Search box with JSONPlaceholder API integration
✅ Results limited to 20 items per page
✅ Display name, email, and truncated body (64 chars)
✅ Search triggered only on submit
✅ Minimum 3 characters for search
✅ Comprehensive test coverage
✅ Docker support with port 8080

### Bonus Features

✅ Typeahead suggestions
✅ Pagination

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run Docker container
- `npm run docker:start` - Build and run Docker
- `npm run docker:stop` - Stop Docker container

## License

MIT

# comment-search
