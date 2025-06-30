# Discover Diani Mobile App

Discover Diani is a mobile application built with Expo (React Native) that helps users explore attractions, restaurants, and services in Diani Beach. It uses Supabase for backend services.

## Table of Contents

- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Key Technologies](#key-technologies)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Project Overview

This application aims to provide a comprehensive guide for tourists and locals in Diani Beach, offering personalized recommendations and information about what the area has to offer.

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or Yarn
- Expo CLI: `npm install -g expo-cli`
- Git

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd discover-diani
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

### Environment Variables

The application requires Supabase credentials to connect to the backend. These are managed via environment variables.

1.  Create a `.env` file in the root of the project:
    ```bash
    touch .env
    ```

2.  Add the following environment variables to your `.env` file, replacing the placeholder values with your actual Supabase project details:
    ```env
    EXPO_PUBLIC_SUPABASE_URL="your-supabase-url"
    EXPO_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
    ```
    - `EXPO_PUBLIC_SUPABASE_URL`: The URL of your Supabase project.
    - `EXPO_PUBLIC_SUPABASE_ANON_KEY`: The public anonymous key for your Supabase project.

    **Note:** These variables are prefixed with `EXPO_PUBLIC_` to make them accessible in the client-side Expo application. Ensure these are public-facing keys and not service role keys or other secrets.

## Available Scripts

In the project directory, you can run the following scripts:

-   **`npm run dev`** or **`yarn dev`**:
    Runs the app in development mode using Expo Go. This will typically open options to run on iOS simulator, Android emulator, or in a web browser.

-   **`npm run lint`** or **`yarn lint`**:
    Lints the codebase using Expo's default ESLint configuration.

-   **`npm run build:web`** or **`yarn build:web`**:
    Creates a production build of the app for the web platform.

*More scripts (e.g., for native builds `build:ios`, `build:android`) will be added as the project evolves.*

## Project Structure

The project follows a standard Expo (React Native) structure:

```
discover-diani/
├── app/                  # Expo Router routes and screens
│   ├── (auth)/           # Authentication screens
│   ├── (tabs)/           # Main tab navigation screens
│   └── ...
├── assets/               # Static assets (images, fonts)
├── components/           # Reusable UI components
├── contexts/             # React Context API providers (e.g., AuthContext)
├── hooks/                # Custom React hooks
├── lib/                  # Libraries and utility functions (e.g., Supabase client)
├── supabase/             # Supabase specific files (e.g., migrations)
├── .env                  # Environment variables (gitignored)
├── app.json              # Expo app configuration
├── package.json          # Project dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Key Technologies

-   **React Native**: For building native mobile applications using JavaScript and React.
-   **Expo**: A framework and platform for universal React applications.
-   **Expo Router**: File-system based routing for React Native and web.
-   **TypeScript**: For static typing and improved code quality.
-   **Supabase**: Open-source Firebase alternative for backend services (database, auth, storage).
-   **Prettier**: Code formatter for consistent code style.
-   **ESLint**: Linter for identifying and fixing problems in JavaScript/TypeScript code.

## Testing

*(Testing strategy and instructions will be added here once implemented.)*

Currently, the project lacks a dedicated testing suite. The plan is to implement:
-   Unit tests for components, hooks, and utility functions.
-   Integration tests for key user flows.

## Deployment

*(Deployment instructions for iOS, Android, and Web will be added here once CI/CD and EAS Build are configured.)*

Deployment will likely involve:
-   **EAS Build**: For creating builds for iOS and Android.
-   **EAS Submit**: For submitting builds to app stores.
-   **Web Hosting**: A static hosting provider (e.g., Vercel, Netlify) for the web version.

## Contributing

*(Contribution guidelines will be added here if the project becomes open to contributions.)*

---

This `README.md` provides a foundational guide to the Discover Diani application. It will be updated as the project evolves.
