# 🌎 Flag Quiz

A fun and interactive quiz game to test your knowledge of world flags and improve your geography skills.

## 🎮 For Players

### Overview
Test your knowledge of world flags in this interactive quiz game! Can you identify countries from their flags? Challenge yourself, learn about different nations, and have fun improving your geography skills.

### Features
- **Multiple Choice Quiz**: Identify country flags from four possible options
- **Voice Recognition**: Answer questions using your voice (browser support required)
- **Learning Experience**: Familiarize yourself with flags from around the world

### How to Play
1. Visit the [Flag Quiz website](https://antoniokov.com/flag-quiz)
2. Click "Start Quiz" on the introduction screen
3. For each question, identify the country that matches the displayed flag
4. Click on the correct answer or use the voice recognition feature (say the country's name)
5. See your final score at the end of the quiz
6. Try again to beat your previous score!

### Voice Mode
- Enable voice recognition by keeping the voice mode toggle active
- When you see a flag, simply say the country name out loud
- The game will recognize your answer and provide feedback

---

## 💻 For Developers

### Project Overview
Flag Quiz is built with React, TypeScript, and Vite. It uses a responsive design and implements voice recognition for an enhanced user experience.

### Technology Stack
- **Frontend**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS
- **Deployment**: GitHub Pages

### Getting Started

#### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

#### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/your-username/flag-quiz.git
   cd flag-quiz
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open `http://localhost:5173` in your browser

### Project Structure
```
flag-quiz/
├── public/        # Static assets and flags
├── src/
│   ├── assets/     # Static assets
│   ├── components/ # React components
│   ├── constants/  # Application constants
│   ├── data/       # Flag and country data
│   ├── styles/     # CSS files
│   ├── types/      # TypeScript interfaces
│   ├── utils/      # Utility functions
│   ├── App.tsx     # Main App component
│   └── main.tsx    # Application entry point
├── package.json
└── vite.config.ts
```

### Adding New Flags/Countries
To add new countries or update existing ones, modify the `src/data/countries.ts` file:

```typescript
// Add a new country
{ name: 'Country Name', code: 'XX', similarTo: ['YY', 'ZZ'], aliases: ['Alternate Name'] }
```

### Contributing
Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Guidelines
- Follow the established code style
- Keep components under 500 lines
- Write responsive CSS
- Organize code into clearly separated modules
- Add appropriate TypeScript types
- Use descriptive variable and function names

### Building for Production
```bash
npm run build
# or
yarn build
```

The production build will be generated in the `dist` directory.

### Deployment
The application can be deployed to GitHub Pages:

```bash
npm run deploy
# or
yarn deploy
```
