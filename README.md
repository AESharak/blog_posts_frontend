# Blog Application Frontend

This is the frontend for a fullstack blog application built with React, TypeScript, and Vite.

## Features

- User authentication (login, register, logout)
- View blog posts with pagination
- Create, edit, and delete blog posts
- Rich text editing for blog content
- Responsive design with TailwindCSS
- Real-time form validation

## Tech Stack

- React 19
- TypeScript
- Vite 6
- TailwindCSS 3
- React Router DOM 7
- React Query (Tanstack Query)
- Axios for API requests
- React Hook Form for form management
- React Hot Toast for notifications

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Backend API running (see backend README)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/blog_post_react_django.git
cd blog_post_react_django/frontend
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the frontend directory with the following content

```
VITE_API_BASE_URL=http://localhost:8000/api
```

### Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

This will start the development server at http://localhost:5173.

### Building for Production

To build the app for production:

```bash
npm run build
# or
yarn build
```

The build output will be in the `dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and other assets
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React contexts (auth, theme)
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main App component
│   └── main.tsx         # Application entry point
├── index.html           # HTML template
├── tailwind.css         # TailwindCSS entry
├── tailwind.config.js   # TailwindCSS configuration
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── package.json         # Project dependencies
```

## API Integration

The frontend communicates with a Django REST API backend. Configure the API URL in your `.env` file to ensure proper connectivity.

## Development Workflow

1. Start the backend server (see backend README)
2. Start the frontend development server
3. Make changes to the code
4. The changes will be reflected immediately thanks to Hot Module Replacement

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint the codebase
