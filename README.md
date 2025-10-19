# Firebase Studio Project: EduChain

Welcome to EduChain! This is a secure certificate verification platform built with Next.js, Firebase, and Genkit. This guide provides a detailed, beginner-friendly walkthrough to get the application running on your local development machine.

## Table of Contents

1.  [How It Works: The Technology Stack](#how-it-works-the-technology-stack)
2.  [Step 1: Install Prerequisites](#step-1-install-prerequisites)
3.  [Step 2: Set Up Your Firebase Backend](#step-2-set-up-your-firebase-backend)
4.  [Step 3: Configure AI Features with an Environment File](#step-3-configure-ai-features-with-an-environment-file)
5.  [Step 4: Install Project Dependencies](#step-4-install-project-dependencies)
6.  [Step 5: Run the Development Servers](#step-5-run-the-development-servers)
7.  [Step 6: Access and Use the Application](#step-6-access-and-use-the-application)

---

## How It Works: The Technology Stack

This application has two main parts that work together:

*   **Next.js Frontend**: This is the user interface of the web application that you see and interact with in your browser. It includes all the pages, dashboards, and components.
*   **Genkit AI Backend**: This is a separate service that handles the AI-powered features, like the "Career Advisor." It runs independently and responds to requests from the frontend.

Because of this structure, you will need to run **two separate commands in two separate terminals** to start both the frontend and the AI backend.

---

## Step 1: Install Prerequisites

Before you can run the project, you need a few essential tools installed on your computer.

*   **Node.js**: This is a JavaScript runtime that allows you to run JavaScript code outside of a web browser. It's the foundation for our entire application.
    *   **Recommendation**: Use version 18 or later.
    *   **How to get it**: Download and install it from [nodejs.org](https://nodejs.org/).

*   **npm (Node Package Manager)**: This tool is automatically included with your Node.js installation. It helps you download and manage the "packages" or libraries of code that our project depends on.

*   **A Google Account**: This is required to create and manage the Firebase project, which provides our backend database and authentication services.

---

## Step 2: Set Up Your Firebase Backend

This application uses Firebase to handle user accounts (authentication) and store data (Firestore database). The initial setup has already been configured to connect to a specific Firebase project.

*   The client-side configuration, which tells the frontend how to connect to Firebase, is located in `src/firebase/config.ts`.
*   The backend services like Firestore and Authentication are automatically connected when you run the application. No further action is needed here.

---

## Step 3: Configure AI Features with an Environment File

The application's AI Career Advisor uses Genkit, which is powered by the Google Gemini model. To use it, you need a special key (an API key). You must store this key in a special file that is kept private and not shared publicly.

#### a. What is a `.env` file?

A `.env` file is a plain text file used to store "environment variables." Think of these as secret keys or configuration settings that your application needs to run but shouldn't be hard-coded directly into the source code for security reasons. Our application is already programmed to look for a `.env` file in the root directory.

#### b. Create the `.env` file

In the **root directory** of your project (the main folder containing `package.json` and this `README.md`), create a new file and name it exactly:

```
.env
```

#### c. Get your Google AI API Key

1.  Open your web browser and navigate to **[Google AI Studio](https://aistudio.google.com/app/apikey)**.
2.  Sign in with your Google account.
3.  Click the **"Create API key"** button. This will generate a long string of text—this is your secret key. Copy it to your clipboard.

#### d. Add the Key to your `.env` file

1.  Open the `.env` file you created in your code editor.
2.  Add the following line. Be sure to replace `your_api_key_here` with the actual key you copied from the Google AI Studio.

    ```
    GEMINI_API_KEY=your_api_key_here
    ```

3.  Save the file. The application will now be able to use this key to power its AI features.

---

## Step 4: Install Project Dependencies

Now it's time to download all the external code libraries the project needs to run. The `package.json` file in the project root contains a list of all these dependencies.

1.  Open your terminal or command prompt.
2.  Make sure you are in the root directory of the project.
3.  Run the following command:

    ```bash
    npm install
    ```

This command reads the `package.json` file and downloads all the necessary packages into a new folder called `node_modules`. This might take a few minutes.

---

## Step 5: Run the Development Servers

As mentioned earlier, our application requires two servers running simultaneously. You must open **two separate terminal windows** for these commands.

### Terminal 1: Start the Next.js Frontend

This server runs the main web application—the part you see and interact with.

1.  In your first terminal window, run this command:

    ```bash
    npm run dev
    ```

2.  **Expected Output**: The terminal will show several messages. When it's ready, you'll see something like this, indicating the server has started successfully:

    ```
    - ready started server on 0.0.0.0:9002, url: http://localhost:9002
    ```

The frontend is now running and accessible. **Do not close this terminal window.**

### Terminal 2: Start the Genkit AI Server

This server runs the AI flows that power the Career Advisor feature. It listens for requests from the frontend application.

1.  Open a **new, separate** terminal window (keep the first one running).
2.  In this new terminal, run this command:

    ```bash
    npm run genkit:dev
    ```

3.  **Expected Output**: You will see messages indicating that the Genkit server (the "Flow Server") is running. It will typically be on port `3100`:

    ```
    [Flows] Flow Server is running at http://127.0.0.1:3100
    ```

Now, both the frontend and the AI backend are running.

---

## Step 6: Access and Use the Application

With both servers running, you can now explore the full application:

1.  Open your web browser (like Chrome, Firefox, or Safari).
2.  Navigate to **[http://localhost:9002](http://localhost:9002)**.
3.  You should see the EduChain login page.
4.  You can now register new users, log in with different roles (Student, Principal, Employer, Admin), and test all the features of the platform.

Enjoy using EduChain!
