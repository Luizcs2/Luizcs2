# MUQuest - Questionnaire Designer

**MUQuest** is a comprehensive tool designed for creating, managing, and analyzing questionnaires. This application provides a user-friendly interface for designing questionnaires, collecting responses, and visualizing data through various types of charts and tables. It's a valuable tool for researchers, educators, and businesses who need to gather and analyze feedback efficiently.

## Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

## Setup Instructions

1. **Download and Extract the Zip File**

2. **Navigate to the Client Folder**

   Open a terminal and go to the `client` folder:

   ```bash
   cd client
   ```

   Install the dependencies:

   ```bash
   npm install
   ```

3. **Navigate to the Server Folder**

   Open another terminal and go to the `server` folder:

   ```bash
   cd server
   ```

   Install the dependencies:

   ```bash
   npm install
   ```

4. **Configure the `.env` File**

   Inside the `server` directory, locate the `.env` file. Open it in a text editor of your choice and provide the necessary values for the following environment variables:

   ```env
   MONGO_URL = # Input your MongoDB connection URL
   JWT_SECRET = # Input JWT Secret Key like a random string of characters

   # Email server configuration for sending reset password link

   EMAIL_HOST = # Input the hostname of the email server you are using to send emails
   EMAIL_PORT = # Input the port number used by the email server
   EMAIL_USER = # Input the email address used to send the emails
   EMAIL_PASSWORD = # Input the password for the email address specified in EMAIL_USER.
   ```

   Replace the placeholder comments with your actual configuration values.

5. **Start the Server**

   In the terminal for the `server` folder, start the server:

   ```bash
   npm start
   ```

6. **Start the Client**

   In the terminal for the `client` folder, start the client application:

   ```bash
   npm run dev
   ```

7. **Access the Application**

   Once the client is running, you will see a localhost link in the terminal. You can either click on the link or go to `http://localhost:5173/` in your web browser to view the application.

## Additional Information

If you encounter any issues, make sure all dependencies are correctly installed and that both the server and client are running without errors.
