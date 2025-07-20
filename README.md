# Mint - React Native Browser IDE 📱

**Mint** is a browser-based React Native + Expo IDE with AI assistance, inspired by Cursor, Replit, and Expo Snack. Build, preview, and deploy React Native apps directly from your browser!

## ✨ Features

- 🔥 **Live Mobile Preview** - See your React Native app in iOS and Android device simulators
- 🤖 **AI Assistant** - Get code suggestions, generate components, and debug with integrated AI
- ⚡ **Expo Ready** - Built-in Expo support with easy deployment capabilities
- 📁 **File Management** - Full file tree with React Native project structure
- 🎨 **Modern UI** - Dark theme with professional IDE experience
- 🚀 **No Setup Required** - Start coding React Native instantly in your browser

## 🚀 Getting Started

### Option 1: Use Online (Coming Soon)
Visit [mint-ide.vercel.app](https://mint-ide.vercel.app) to start coding immediately.

### Option 2: Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mint-ide.git
   cd mint-ide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` and start building!

## 🏗️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| **Editor** | Monaco Editor (VS Code editor) |
| **Mobile Preview** | React Native Web + Expo Web |
| **AI Features** | OpenAI API (GPT-4) integration |
| **File System** | Virtual filesystem with browser persistence |
| **Deployment** | Vercel, Expo Application Services |

## 🎯 Use Cases

- **🏫 Education** - Perfect for teaching React Native development
- **⚡ Rapid Prototyping** - Quickly test React Native app ideas
- **📱 Mobile Development** - Full React Native development environment
- **🤝 Collaboration** - Share live project links with team members
- **🎓 Learning** - AI-assisted learning for React Native concepts

## 📖 Project Structure

```
mint-ide/
├── app/
│   ├── page.tsx          # Landing page
│   ├── editor/           # Main IDE interface
│   └── layout.tsx        # Root layout
├── components/           # Reusable UI components
├── templates/            # React Native project templates
├── lib/                  # Utility functions
└── styles/               # Global styles
```

## 🤖 AI Features (Coming Soon)

- **Code Generation** - "Create a login screen with email/password"
- **Component Library** - AI-generated React Native components
- **Debugging Assistant** - Intelligent error detection and fixes
- **Code Documentation** - Automatic JSDoc generation
- **Refactoring** - Smart code improvements and optimizations

## 🎨 Customization

Mint supports customizing:
- **Editor themes** - Dark/light mode with syntax highlighting
- **Device frames** - iOS and Android preview modes
- **Project templates** - Pre-built app structures
- **AI prompts** - Custom AI assistant behaviors

## 🌟 Roadmap

- [ ] **Real-time collaboration** - Multiple developers on same project
- [ ] **GitHub integration** - Import/export projects from GitHub
- [ ] **Expo Go preview** - Test on real devices via QR code
- [ ] **Package manager** - Visual npm package installation
- [ ] **Deployment** - One-click deployment to App Store/Google Play
- [ ] **Plugin system** - Extensible architecture for third-party plugins

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Expo Snack](https://snack.expo.dev/)
- Built with [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- UI design inspired by [Cursor](https://cursor.sh/) and [Replit](https://replit.com/)

---

**Built with ❤️ for the React Native community**
