import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">📱</span>
            </div>
            <h1 className="text-4xl font-bold text-white">Mint</h1>
          </div>
          
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Browser-based React Native + Expo IDE with AI assistance. 
            Build mobile apps directly in your browser with live preview.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link
              href="/editor"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
            >
              <span>🚀 Start Building</span>
            </Link>
            <a
              href="https://docs.expo.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              📚 Learn React Native
            </a>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Live Preview</h3>
            <p className="text-slate-400">
              See your React Native app in real-time with iOS and Android device simulators
            </p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">AI Assistant</h3>
            <p className="text-slate-400">
              Get code suggestions, generate components, and debug with integrated AI
            </p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Expo Ready</h3>
            <p className="text-slate-400">
              Built-in Expo support with easy deployment to App Store and Google Play
            </p>
          </div>
        </div>
        
        {/* Quick Start */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to build your next mobile app?</h2>
            <p className="text-slate-400">No setup required. Start coding React Native in seconds.</p>
          </div>
          
          <div className="flex justify-center">
            <Link
              href="/editor"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105"
            >
              Open Mint IDE →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
