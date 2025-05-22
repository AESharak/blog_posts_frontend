# Blog App Frontend (Vite)

This is the frontend for the Blog App, built with React, TypeScript, and Vite.

## Features

- User authentication (login, register, logout)
- View blog posts
- Create, edit, and delete blog posts
- Protected routes for authenticated users
- Responsive design with TailwindCSS

## Tech Stack

- React 19
- TypeScript
- Vite
- TailwindCSS
- React Router DOM
- React Query
- Axios
- React Hook Form
- React Hot Toast

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend-vite directory
3. Install dependencies:

```bash
npm install
# or
yarn
```

### Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

This will start the development server at http://localhost:3000.

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
frontend-vite/
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable components
│   ├── contexts/      # React contexts
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── types/         # TypeScript types
│   ├── App.tsx        # Main App component
│   ├── main.tsx       # Entry point
│   └── index.css      # Global styles
├── index.html         # HTML template
├── tsconfig.json      # TypeScript configuration
├── vite.config.ts     # Vite configuration
└── package.json       # Project dependencies
```

## API Integration

The frontend communicates with a Django backend API. See the API documentation for more details.
