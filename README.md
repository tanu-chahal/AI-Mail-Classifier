# AI-Mail-Classifier App

This is the AI-Mail-Classifier App, a web application for classifying emails using GeminiAI.

Live [here](https://ai-mail-classifier.netlify.app/home)

**Note:** Only the users added as test users will be able to login, the google OAuth application is in testing mode for now. Contact me if you wanna test it out.

## Local Setup Process

To set up the web app locally, follow these steps:

1. **Clone the Repository**

   ```bash
   git clone <repo-url>
   ```

2. **Navigate to the UI Directory**

    ```bash
    cd client/ui
    ```

3. **Install Dependencies**

   Run the following command in the `ui` directory to install all the dependencies:

    ```bash
    npm install
    ```
    or
     ```bash
    npm i
    ```

4. **Create an Environment File**

    Create an `.env` file at the root level in the `ui` directory and set the following environment variable:

    ```env
    VITE_CLIENT_ID="your-Google-OAuth-ClientID"
    ```

5. **Start the Development Server**

    Run the following command in the `ui` directory to start the app:

    ```bash
    npm run dev
    ```
    Your app will start at [http://localhost:5173/](http://localhost:5173/).