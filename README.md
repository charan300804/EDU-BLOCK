# Firebase Studio Project: EduChain

This is a Next.js starter project for EduChain, a secure certificate verification platform built with Firebase and Genkit.

## Getting Started

Follow these instructions to set up and run the project locally on your development machine.

### Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [npm](https://www.npmjs.com/) (which comes with Node.js)
*   A Google account with a Firebase project.

### 1. Environment Setup

This project uses Firebase for its backend and Genkit for AI features.

a. **Firebase Configuration**: The necessary Firebase client-side configuration is already included in `src/firebase/config.ts`. The application is set up to connect to this Firebase project automatically.

b. **Genkit AI Configuration**: The AI features (like the Career Advisor) require a Google AI API key.

   - Create a `.env` file in the root of the project.
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey) to get an API key.
   - Add the key to your `.env` file:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

### 2. Install Dependencies

Open your terminal in the project's root directory and run the following command to install all the necessary packages:

```bash
npm install
```

### 3. Run the Development Servers

To run the application locally, you need to start two separate development servers in two separate terminal windows: one for the Next.js frontend and one for the Genkit AI flows.

**Terminal 1: Start the Next.js Frontend**

This command starts the main web application.

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

**Terminal 2: Start the Genkit AI Server**

This command starts the local server that runs the AI-powered flows, such as the career advisor.

```bash
npm run genkit:dev
```

This server runs on a different port and is automatically called by the Next.js application when AI features are used.

### 4. Accessing the Application

Once both servers are running, you can access the application by navigating to [http://localhost:9002](http://localhost:9002) in your web browser. You can now register new users, log in with different roles, and test all the features of the EduChain platform.
