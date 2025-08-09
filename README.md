# AI Character Chat Platform

A full-stack AI character chat platform built with Next.js, Firebase, and OpenRouter. Users can chat with unique AI personalities, each with their own expertise and personality.

## Features

- 🔐 **Firebase Authentication** - Email/password login and signup
- 💬 **Real-time Chat** - Live chat with AI characters using Firestore
- 🤖 **AI Characters** - 6 unique AI personalities with different expertise
- 🎨 **Dark Theme** - Futuristic neon green/black/white design
- 📱 **Responsive** - Works on desktop and mobile devices
- ⚡ **Real-time Updates** - Messages sync instantly across devices

## AI Characters

1. **Cyber** 🖥️ - Hacker & Security Expert
2. **Dr. Nova** ⚛️ - Quantum Physicist
3. **Sage** 🤖 - AI Philosopher
4. **Luna** ✍️ - Creative Writer
5. **Titan** 💪 - Fitness Coach
6. **Venture** 🚀 - Tech Entrepreneur

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18
- **Styling**: Tailwind CSS with custom dark theme
- **Authentication**: Firebase Auth
- **Database**: Firestore (real-time)
- **AI**: OpenRouter API with Mistral 7B model
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase project
- OpenRouter API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd chatbot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `env.example` to `.env.local` and fill in your credentials:

   ```bash
   cp env.example .env.local
   ```

   Required variables:

   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # OpenRouter API
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. **Set up Firebase**

   - Create a new Firebase project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Add your Firebase config to `.env.local`

5. **Get OpenRouter API Key**

   - Sign up at [OpenRouter](https://openrouter.ai)
   - Get your API key
   - Add it to `.env.local`

6. **Run the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── chat/         # Chat API endpoint
│   ├── chat/             # Chat pages
│   │   └── [characterId]/ # Dynamic chat routes
│   ├── globals.css       # Global styles
│   ├── layout.js         # Root layout
│   └── page.js           # Homepage
├── components/            # React components
│   ├── CharacterCard.js  # Character selection cards
│   ├── ChatUI.js         # Chat interface
│   └── Navbar.js         # Navigation bar
└── lib/                  # Utility libraries
    ├── characters.js     # AI character definitions
    └── firebase.js       # Firebase configuration
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

| Variable                                   | Description                  | Required |
| ------------------------------------------ | ---------------------------- | -------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`             | Firebase API key             | Yes      |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | Firebase auth domain         | Yes      |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | Firebase project ID          | Yes      |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | Firebase storage bucket      | Yes      |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes      |
| `NEXT_PUBLIC_FIREBASE_APP_ID`              | Firebase app ID              | Yes      |
| `OPENROUTER_API_KEY`                       | OpenRouter API key           | Yes      |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

If you encounter any issues:

1. Check the console for error messages
2. Verify your environment variables are correct
3. Ensure Firebase and OpenRouter are properly configured
4. Check the browser's network tab for API errors

## Features Roadmap

- [ ] Voice chat support
- [ ] Character customization
- [ ] Chat history export
- [ ] Multiple language support
- [ ] Character image generation
- [ ] Group chat rooms
- [ ] Message reactions
- [ ] File sharing
