# Nandkishor Wholesale Inventory App

A professional, offline-capable Windows desktop application built with **Electron**, **React**, and **SQLite**. This app helps wholesale businesses manage their product catalog, generate beautiful marketing posters, and work seamlessly without an internet connection.

## 🚀 Features

- **Local First**: Save all your data and images directly on your PC. No cloud required.
- **Product Management**: Track categories, sub-categories, sizes, and pricing.
- **Showcase Poster Generator**: Create high-quality, professional posters for your products with multiple layouts (Classic, Minimal, Social, Terminal).
- **Customizable Storage**: Choose where your data and posters are saved in the settings.
- **Offline Backend**: Integrated Node.js server running inside Electron using a local SQLite database.

---

## 🛠️ Getting Started (Development Mode)

To run the app on your computer for testing and development:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Shashank23codes/Nandkishor-wholesale-app.git
    cd Nandkishor-wholesale-app
    ```

2.  **Install Dependencies**:
    ```bash
    # Install root dependencies
    npm install

    # Install server dependencies
    cd server
    npm install
    cd ..
    ```

3.  **Run in Test Mode (Development)**:
    ```bash
    npm run electron:dev
    ```
    *This command will start the Vite frontend and Electron main process together.*

---

## 📦 Building the App (Production Mode)

To create a professional installer for your PC:

1.  **Run the Build Command**:
    ```bash
    npm run electron:build
    ```
2.  **Wait for completion**: The process will:
    - Compile the React frontend (`dist/`)
    - Package the Electron app
    - Create a Windows installer (`.exe`) in the `dist-electron/` folder.

---

## 🖥️ How to Run the App on Your PC

Once the build is finished:

1.  Open the **`dist-electron`** folder in your project directory.
2.  Find the file named **`Nandkishor Wholesale Setup 1.0.0.exe`** (or similar).
3.  **Double-click the installer** to install the app on your Windows system.
4.  After installation, you can open the app from your **Start Menu** or **Desktop Shortcut**.

### 🔧 Testing "Offline" Functionality
- The app is designed to work without an internet connection.
- Data is stored in your user profile under `AppData/Roaming/nandkishor-wholesale` by default.
- You can verify this by turning off your Wi-Fi and running the app; it will still load all your products and saved posters.

---

## 📂 Project Structure

- `src/`: React frontend (Vite)
- `electron/`: Main process and Preload script for native features.
- `server/`: Offline Express server using `better-sqlite3`.
- `public/`: Assets like icons and logos.

## 📄 Credits & License
Developed and Maintained by **Code Clover Studio**. 
Internal Application - Nandkishor Readymade.
