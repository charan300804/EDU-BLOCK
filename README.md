# Firebase Studio Project: EduChain

This is a Next.js starter project for EduChain, a secure certificate verification platform built with Firebase and Genkit.

## Getting Started

Follow these detailed instructions to set up and run the project locally on your development machine.

### Prerequisites

Before you begin, ensure you have the following installed on your system:
*   **Node.js**: Version 18 or later is recommended. You can download it from [nodejs.org](https://nodejs.org/).
*   **npm**: Node Package Manager, which is included with your Node.js installation.
*   **A Google Account**: Required to create and manage the Firebase project that will serve as your backend.

### 1. Firebase Project Setup

This application requires a Firebase project to handle authentication and database services. The initial setup has already been configured to connect to a specific Firebase project.

- The client-side configuration is located in `src/firebase/config.ts`.
- The backend services like Firestore and Authentication are automatically connected.

### 2. Environment Variables for AI Features

The application uses Genkit for its AI-powered Career Advisor feature, which requires an API key from Google AI.

a. **Create a `.env` file**: In the root directory of the project, create a new file and name it `.env`.

b. **Get your API Key**:
   - Navigate to [Google AI Studio](https://aistudio.google.com/app/apikey).
   - Sign in with your Google account.
   - Click "Create API key" to generate a new key.

c. **Add the Key to your `.env` file**:
   - Open the `.env` file you just created.
   - Add the following line, replacing `your_api_key_here` with the key you copied from Google AI Studio:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

### 3. Install Project Dependencies

This command will download and install all the necessary packages and libraries that the project depends on to function correctly.

- Open your terminal or command prompt.
- Navigate to the root directory of the project.
- Run the following command:

```bash
npm install
```

### 4. Run the Development Servers

This application has a dual-server architecture: one server for the Next.js frontend and another for the Genkit AI services. You must start both in **separate terminal windows** for the application to be fully functional.

**Terminal 1: Start the Next.js Frontend**

This server runs the main web application, including the user interface and all dashboards.

- In your first terminal window, run:

```bash
npm run dev
```

- **Expected Output**: You will see messages indicating that the server has started successfully, typically including:
  ```
  - ready started server on 0.0.0.0:9002, url: http://localhost:9002
  ```
- The frontend is now running and accessible at [http://localhost:9002](http://localhost:9002).

**Terminal 2: Start the Genkit AI Server**

This server powers the AI flows, such as the Career Advisor. It listens for requests from the Next.js application.

- Open a **new** terminal window (do not close the first one).
- In the new terminal, run:

```bash
npm run genkit:dev
```

- **Expected Output**: You will see messages indicating that the Genkit server (the "Flow Server") is running, typically on port `3100`:
  ```
  [Flows] Flow Server is running at http://127.0.0.1:3100
  ```

### 5. Accessing and Using the Application

With both servers running, you can now use the application:

1.  Open your web browser and navigate to **[http://localhost:9002](http://localhost:9002)**.
2.  You should see the EduChain login page.
3.  You can now register new users, log in with different roles (Student, Principal, Employer, Admin), and test all the features of the platform.
