# Firebase Studio Project: EduBlock

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&style=for-the-badge)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-Framework-black?logo=next.js&style=for-the-badge)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind--CSS-3.4-38B2AC?logo=tailwind-css&style=for-the-badge)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Backend-FFCA28?logo=firebase&style=for-the-badge)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)







Welcome to EduBlock! This is a secure certificate verification platform built with Next.js, Firebase, and Genkit. This guide provides a detailed, beginner-friendly walkthrough to get the application running on your local development machine.

## Table of Contents

1.  [How It Works: The Technology Stack](#how-it-works-the-technology-stack)
2.  [Application Workflow and User Roles](#application-workflow-and-user-roles)
3.  [Step 1: Install Prerequisites](#step-1-install-prerequisites)
4.  [Step 2: Understand the Firebase Setup](#step-2-understand-the-firebase-setup)
5.  [Step 3: Configure AI Features with an Environment File](#step-3-configure-ai-features-with-an-environment-file)
6.  [Step 4: Install Project Dependencies](#step-4-install-project-dependencies)
7.  [Step 5: Run the Development Servers](#step-5-run-the-development-servers)
8.  [Step 6: Access and Use the Application](#step-6-access-and-use-the-application)

---

## How It Works: The Technology Stack

This application has two main parts that work together, and you'll need to run them separately:

*   **Next.js Frontend**: This is the user interface of the web application that you see and interact with in your browser. It includes all the pages, dashboards, and components.
*   **Genkit AI Backend**: This is a separate service that handles the AI-powered features, like the "Career Advisor." It runs independently and responds to requests from the frontend.

Because of this structure, you will need to run **two separate commands in two separate terminals** to start both the frontend and the AI backend.

---

## Application Workflow and User Roles

EduBlock is a role-based system designed for the secure creation, management, and verification of educational certificates. Here’s how the application flows and what each role can do.

### General Workflow

1.  **Login/Registration**: The application starts at the login page. Users select their specific role (Student, Principal, Employer, or Admin) from the tabs to log in. Employers have a unique ability to register for a new account directly from the login page.
2.  **Authentication**: The system uses Firebase Authentication to manage user accounts. Upon successful login, the application identifies the user's role and directs them to their personalized dashboard.
3.  **Certificate Lifecycle**:
    *   **Issuance**: Principals issue certificates to students.
    *   **Viewing**: Students view their issued certificates.
    *   **Verification**: Employers verify the authenticity of a certificate.
    *   **Oversight**: Admins oversee the entire system.

---

### Role-Specific Workflows

#### 1. Admin

The Admin role has the highest level of oversight and is responsible for managing the educational institutions that use the platform.

*   **Login**: The Admin logs in using their credentials on the "Admin" tab.
*   **Dashboard**: The Admin dashboard's primary function is to manage **Principals**.
    *   **Create Principal**: An Admin can create a new Principal account by providing their name, email, school name, and a temporary password. This allows a new school/institution to join the platform.
    *   **Manage Principals**: The Admin can view a list of all existing Principals. From this list, they can **revoke** a Principal's access (making them inactive) or **reinstate** it.
    *   **Audit Logs**: The Admin can navigate to the **Audit Logs** page to view a system-wide, read-only log of important actions, such as when certificates are issued or verified. This is crucial for security and compliance.

#### 2. Principal

The Principal represents an educational institution and is responsible for managing students and issuing certificates.

*   **Login**: The Principal logs in using the credentials created for them by an Admin.
*   **Dashboard**: The Principal dashboard is organized into three main functions:
    *   **Create Student**: The Principal can create new student accounts by providing a name, email, and password. This allows students to log in and view their certificates.
    *   **Manage Students**: The Principal can view a list of all students associated with their institution and can delete student accounts if needed.
    *   **Issue Certificate**: This is a core function. The Principal selects a student from a dropdown list, enters the title of the certificate (e.g., "B.Tech Computer Science"), and issues it. This action creates a new, secure certificate record in the Firestore database, linked to both the student and the principal.

#### 3. Student

The Student is the recipient of the certificates. Their workflow is focused on viewing their achievements and seeking guidance.

*   **Login**: The Student logs in using the credentials created for them by their Principal.
*   **Dashboard**:
    *   **My Certificates**: The main dashboard displays a list of all certificates that have been issued to the student. Each certificate card shows the title, issuing date, and a unique hash for verification. From here, the student can:
        *   **Show QR Code**: Displays the unique certificate ID, which can be shared with an employer for verification.
        *   **Download**: A placeholder to simulate downloading a PDF of the certificate.
    *   **Career Guidance**: Students can navigate to this page to use the **AI Career Advisor**. They select one of their earned certificates, and the AI provides personalized suggestions for relevant job titles and future learning paths.

#### 4. Employer

The Employer's role is to verify the authenticity of certificates presented by potential job candidates.

*   **Registration & Login**: Employers can register for a new account directly from the main page. After registering, they can log in via the "Employer" tab.
*   **Dashboard**: The Employer dashboard is focused on a single task: verification.
    *   **Manual Verification**: The employer can enter a unique **Certificate ID** (provided by a student) into a search bar and click "Verify." This queries the database to confirm the certificate's details and validity.
    *   **QR Code Scanning**: The employer can click "Scan QR Code" to activate their device's camera. They can then scan a QR code presented by a student to automatically perform the verification.
    *   **Verification Result**: After verification, the employer is taken to a results page that clearly states if the certificate is **Valid**, **Tampered**, or **Not Found**, and displays the authentic certificate details if it is valid.

---

## Step 1: Install Prerequisites

Before you can run the project, you need a few essential tools installed on your computer.

*   **Node.js**: This is a JavaScript runtime that allows you to run JavaScript code outside of a web browser. It's the foundation for our entire application.
    *   **Recommendation**: Use version 18 or later.
    *   **How to get it**: Download and install it from [nodejs.org](https://nodejs.org/). This will also install `npm`.

*   **npm (Node Package Manager)**: This tool is automatically included with your Node.js installation. It helps you download and manage the "packages" or libraries of code that our project depends on.

*   **A Google Account**: This is required to get an API key for the AI features.

---

## Step 2: Understand the Firebase Setup

This application uses Firebase to handle user accounts (authentication) and store data (Firestore database).

**Do I need to get any files from the Firebase Console?**

**No, not for this project.** The connection details for Firebase have already been pre-configured for you.

*   The client-side configuration, which tells the frontend how to connect to Firebase, is already present in the file `src/firebase/config.ts`.
*   The backend services like the database and authentication are automatically connected when you run the application using this configuration.

In a typical project you build from scratch, you would need to go to the [Firebase Console](https://console.firebase.google.com/), create a new project, register a new web application, and then Firebase would give you a configuration object (called `firebaseConfig`) to copy into your project. For your convenience, that step has already been done.

---

## Step 3: Configure AI Features with an Environment File

The application's AI Career Advisor uses Genkit, which is powered by the Google Gemini model. To use it, you need a special key (an API key). You must store this key in a special file that is kept private and not shared publicly.

#### a. What is a `.env` file?

A `.env` file is a plain text file used to store "environment variables." Think of these as secret keys or configuration settings that your application needs to run but shouldn't be hard-coded directly into the source code for security reasons. Our application is already programmed to look for this file in the root directory.

#### b. Create the `.env` file

In the **root directory** of your project (the same folder that contains this `README.md` file), create a new file and name it exactly:

```
.env
```

#### c. Get your Google AI API Key

1.  Open your web browser and navigate to **[Google AI Studio](https://aistudio.google.com/app/apikey)**.
2.  Sign in with your Google account.
3.  Click the **"Create API key"** button. This will generate a long string of text—this is your secret key.
4.  **Copy this key** to your clipboard.

#### d. Add the Key to your `.env` file

1.  Open the `.env` file you just created in your code editor.
2.  Add the following line. Be sure to replace `your_api_key_here` with the actual key you copied from the Google AI Studio.

    ```
    GEMINI_API_KEY=your_api_key_here
    ```

3.  Save the file. The application will now be able to use this key to power its AI features.

---

## Step 4: Install Project Dependencies

Now it's time to download all the external code libraries the project needs to run. The `package.json` file in the project root contains a complete list of all these dependencies.

1.  Open your terminal or command prompt.
2.  Make sure you are in the root directory of the project.
3.  Run the following command:

    ```bash
    npm install
    ```

This command reads the `package.json` file and downloads all the necessary packages into a new folder called `node_modules`. This might take a few minutes. You only need to do this once, unless you add new dependencies later.

---

## Step 5: Run the Development Servers

As mentioned earlier, our application requires two servers running simultaneously. You must open **two separate terminal windows** for these commands.

### Terminal 1: Start the Next.js Frontend

This server runs the main web application—the part you see and interact with.

1.  In your first terminal window, run this command:

    ```bash
    npm run dev
    ```

2.  **What does this do?** This command tells Next.js to start a development server, which compiles the code and makes the website available locally. The `--turbopack` flag makes it extra fast, and `-p 9002` tells it to run on port 9002.

3.  **Expected Output**: The terminal will show several messages. When it's ready, you'll see something like this, indicating the server has started successfully:

    ```
    - ready started server on 0.0.0.0:9002, url: http://localhost:9002
    ```

The frontend is now running. **Do not close this terminal window.**

### Terminal 2: Start the Genkit AI Server

This server runs the AI flows that power the Career Advisor feature. It listens for requests from the frontend application.

1.  Open a **new, separate** terminal window (keep the first one running).
2.  In this new terminal, run this command:

    ```bash
    npm run genkit:dev
    ```
    
3.  **What does this do?** This command starts the Genkit development server, which makes your AI functions available as a local API that the Next.js frontend can call.

4.  **Expected Output**: You will see messages indicating that the Genkit server (the "Flow Server") is running. It will typically be on port `3100`:

    ```
    [Flows] Flow Server is running at http://127.0.0.1:3100
    ```

Now, both the frontend and the AI backend are running and can communicate with each other.

---

## Step 6: Access and Use the Application

With both servers running, you can now explore the full application:

1.  Open your web browser (like Chrome, Firefox, or Safari).
2.  Navigate to the URL from your first terminal: **[http://localhost:9002](http://localhost:9002)**.
3.  You should see the EduBlock login page.
4.  You can now register new users, log in with different roles (Student, Principal, Employer, Admin), and test all the features of the platform.

Enjoy using EduBlock!