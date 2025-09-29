# Clock App

A beautiful, AI-powered clock application built with React and Subscribe.dev. Features real-time clock display with customizable settings and AI-generated inspirational quotes about time.

## Features

- **Real-time Clock**: Displays current time with 12/24-hour format toggle
- **Date Display**: Shows current date in a readable format
- **AI Quotes**: Generate inspirational quotes about time using GPT-4o
- **User Authentication**: Secure sign-in with Subscribe.dev
- **Cloud Storage**: Sync your settings across devices
- **Subscription Management**: Built-in plan and credits management
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark Mode Support**: Adapts to system preferences

## Getting Started

This application was created using VGit AI-powered development tools.

### Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Add your Subscribe.dev project token to `.env`:
```
VITE_SUBSCRIBE_DEV_PROJECT_TOKEN=your_token_here
```

Get your token from the [Subscribe.dev dashboard](https://subscribe.dev).

### Development

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Deployment

This project includes automated deployment via VGit workflows. Push to any branch to trigger a preview deployment.

## VGit Workflows

This repository includes the following VGit workflows:

- **Create Feature**: Implement new features using AI assistance
- **Ask Codebase**: Get AI-powered answers about your code
- **Merge Branch**: Safely merge branches with validation
- **Deploy Preview**: Automated preview deployments

---

*Generated with [VGit](https://vgit.app) 🤖*
