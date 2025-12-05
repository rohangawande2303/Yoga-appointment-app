# Simple Firebase Setup Guide

Follow these 5 simple steps to get your app running.

### 1. Create a Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com/).
2. Click **"Add project"**.
3. Enter a name (e.g., "Yoga App") and click **Continue**.
4. You can disable Google Analytics for now. Click **Create project**.

### 2. Get Your API Keys
1. Once the project is ready, click the **Web icon (</>)** in the center of the screen to add an app.
2. Give it a nickname (e.g., "Web App") and click **Register app**.
3. You will see a code block with `firebaseConfig`. **Keep this screen open**.

### 3. Connect to Your Code
1. Go to your VS Code project.
2. Look for the file named `.env.example`.
3. **Copy and paste** this file and rename the copy to `.env.local`.
4. Fill in the values in `.env.local` using the keys from the Firebase screen:
   - `apiKey` goes to `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `authDomain` goes to `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - ...and so on.
5. Save the file.
### 4. Enable Login (Authentication)
1. In Firebase Console, go to **Build** > **Authentication** (left menu).
2. Click **Get Started**.
3. Click **Sign-in method** tab.
4. Click **Email/Password**, enable it, and click **Save**.
5. Click **Add new provider**, select **Google**, enable it, and click **Save**.

### 5. Enable Database (Firestore)
1. In Firebase Console, go to **Build** > **Firestore Database**.
2. Click **Create Database**.
3. Choose a location (default is fine).
4. Select **Start in test mode** (this makes it easy to test without permission errors).
5. Click **Create**.

**That's it!** Now restart your app with `npm run dev` and it should work.
