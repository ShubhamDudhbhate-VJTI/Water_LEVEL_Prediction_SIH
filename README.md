# AI Chatboat - Intelligent Chat Application

A modern, responsive chat application with AI integration powered by OpenAI.

## Features

- 🤖 **Real AI Responses**: Powered by OpenAI GPT models
- 💬 **Smart Conversations**: Context-aware chat with conversation history
- 📁 **File Uploads**: Support for images, documents, and other files
- 🎨 **Modern UI**: Beautiful interface built with shadcn/ui and Tailwind CSS
- 🔐 **Authentication**: User authentication with Supabase
- 📱 **Responsive**: Works on desktop, tablet, and mobile devices

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup FREE Local AI (Recommended)
For completely FREE AI responses, use Ollama:

1. **Download Ollama**: Visit [ollama.ai](https://ollama.ai) and download
2. **Install a model**: Run `ollama pull llama3:8b` in terminal
3. **Start Ollama**: Run `ollama serve` in terminal
4. **That's it!** No API keys or credits needed!

**Benefits:**
- ✅ 100% FREE - No costs ever
- ✅ Runs on your computer
- ✅ No internet required
- ✅ Privacy-friendly
- ✅ No API keys needed

### Alternative: OpenAI API (Paid)
If you prefer OpenAI, create a `.env` file:
```env
VITE_OPENAI_API_KEY=your_actual_api_key_here
VITE_OPENAI_MODEL=gpt-3.5-turbo
```

### 3. Start Development Server
```bash
npm run dev
```

## Project info

**URL**: https://lovable.dev/projects/bdc5893d-38cb-4851-93c3-dd7793686424

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/bdc5893d-38cb-4851-93c3-dd7793686424) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/bdc5893d-38cb-4851-93c3-dd7793686424) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
