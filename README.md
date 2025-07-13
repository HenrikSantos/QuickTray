# AI QuickTray

AI QuickTray is a powerful desktop application designed to boost your productivity by giving you instant access to AI-powered text tools. Built with Electron and React, this application lives in your system tray, allowing you to quickly translate, reformulate, correct, or summarize text using a simple global shortcut.

## Features

-   **System Tray Integration**: Runs discreetly in the system tray for quick access.
-   **Global Shortcut**: Open the app from anywhere with a customizable global shortcut.
-   **Multiple AI Tools**:
    -   **Translate**: Translate text between multiple languages.
    -   **Improve**: Reformulate text for better clarity and style.
    -   **Correct**: Fix spelling and grammar mistakes.
    -   **Summarize**: Condense long texts into summaries.
-   **Multi-language UI**: Switch between English, Spanish, and Portuguese.
-   **Dark Mode**: A sleek, dark interface for a comfortable user experience.
-   **Cross-Platform**: Works on Windows, macOS, and Linux.

## Technologies Used

-   **[Electron](https://www.electronjs.org/)**: To build the cross-platform desktop application.
-   **[React](https://reactjs.org/)**: For building the user interface.
-   **[TypeScript](https://www.typescriptlang.org/)**: For robust, typed JavaScript.
-   **[Tailwind CSS](https://tailwindcss.com/)**: For styling the application.
-   **[i18next](https://www.i18next.com/)**: For handling internationalization.
-   **[Google Gemini](https://ai.google.dev/)**: As the generative AI provider.

## Installation

1.  Go to the [**Releases**](https://github.com/HenrikSantos/QuickTray/releases) page.
2.  Download the latest installer for your operating system (`.exe` for Windows, `.dmg` for macOS, or `.AppImage` for Linux).
3.  Run the installer to set up the application.

## Configuration

To use the AI features, you need to add your own Google Gemini API key.

1.  **Get your API Key**:
    -   Go to [**aistudio.google.com/apikey**](https://aistudio.google.com/apikey).
    -   Sign in with your Google account.
    -   Click "**Create API key**" to generate a new key.
2.  **Add the Key to the App**:
    -   Open AI QuickTray.
    -   Click the settings icon (⚙️).
    -   Paste your API key into the "API Key (Gemini)" field.
    -   Click "**Save Settings**".

## Development

If you want to run the project locally or contribute to it, follow these steps:

### Install Dependencies

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

### Build the Application

```bash
# For Windows
npm run build:win

# For macOS
npm run build:mac

# For Linux
npm run build:linux
```

## Contact

Created by [HenrikSantos](https://github.com/HenrikSantos). Feel free to reach out with questions or feedback.
