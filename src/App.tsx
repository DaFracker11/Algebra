import { useState, useMemo, useRef } from 'react';
import { Search, Gamepad2, X, Maximize2, ExternalLink, ChevronLeft, Calculator, BookOpen, HelpCircle, History, Settings, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isDisguised, setIsDisguised] = useState(true);
  const iframeRef = useRef(null);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(gamesData.map(g => g.category))];
    return cats;
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const handleToggleDisguise = () => {
    setIsDisguised(!isDisguised);
  };

  const toggleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      } else if (iframeRef.current.webkitRequestFullscreen) {
        iframeRef.current.webkitRequestFullscreen();
      } else if (iframeRef.current.msRequestFullscreen) {
        iframeRef.current.msRequestFullscreen();
      }
    }
  };

  const [calcDisplay, setCalcDisplay] = useState('');
  const [activeFormula, setActiveFormula] = useState(null);

  const formulas = {
    'Pythagorean': 'a² + b² = c²',
    'Circle Area': 'A = πr²'
  };

  const handleCalcClick = (val) => {
    if (val === '=') {
      try {
        // Simple evaluation for the disguise
        setCalcDisplay(eval(calcDisplay.replace(/×/g, '*').replace(/÷/g, '/')).toString());
      } catch {
        setCalcDisplay('Error');
      }
    } else if (val === 'C') {
      setCalcDisplay('');
    } else {
      setCalcDisplay(prev => prev + val);
    }
  };

  if (isDisguised) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
        {/* Minimalist Header */}
        <header className="px-6 py-4 bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div 
              className="flex items-center gap-2 cursor-default select-none"
              onDoubleClick={handleToggleDisguise}
            >
              <div className="bg-slate-900 p-1.5 rounded-md">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 uppercase italic">AlgebraSolver</h1>
            </div>
            
            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <button onClick={() => setActiveFormula(null)} className="hover:text-slate-900 transition-colors">Calculator</button>
              <button onClick={() => setActiveFormula('Pythagorean')} className="hover:text-slate-900 transition-colors">Formulas</button>
              <a href="#" className="hover:text-slate-900 transition-colors">History</a>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-start">
            
            {/* Left Side: Title and Formulas */}
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-5xl font-black tracking-tighter text-slate-900 italic uppercase">Algebra Solver</h2>
                <p className="text-slate-400 font-medium">Professional mathematical computation engine.</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Quick Formulas</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(formulas).map(name => (
                    <button 
                      key={name}
                      onClick={() => setActiveFormula(name)}
                      className={`text-left px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                        activeFormula === name 
                          ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {activeFormula && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm"
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{activeFormula} Formula</p>
                    <p className="text-2xl font-mono text-slate-900 break-all">{formulas[activeFormula]}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Side: Calculator UI */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 max-w-[340px] mx-auto w-full">
              <div className="bg-slate-50 rounded-3xl p-6 mb-6 text-right min-h-[100px] flex flex-col justify-end">
                <div className="text-slate-300 text-xs font-mono mb-1 h-4 overflow-hidden">
                  {/* History or secondary display could go here */}
                </div>
                <div className="text-4xl font-mono text-slate-900 overflow-hidden whitespace-nowrap">
                  {calcDisplay || '0'}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {['C', '(', ')', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', 'DEL', '='].map((btn) => (
                  <button
                    key={btn}
                    onClick={() => {
                      if (btn === 'DEL') setCalcDisplay(prev => prev.slice(0, -1));
                      else handleCalcClick(btn);
                    }}
                    className={`h-14 rounded-2xl text-lg font-bold transition-all flex items-center justify-center ${
                      btn === '=' 
                        ? 'bg-slate-900 text-white col-span-1 hover:bg-slate-800' 
                        : ['÷', '×', '-', '+', 'C', '(', ')', 'DEL'].includes(btn)
                          ? 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                          : 'bg-white text-slate-600 border border-slate-50 hover:border-slate-200 shadow-sm'
                    }`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </main>

        <footer className="py-8 px-6 border-t border-slate-50">
          <div className="max-w-5xl mx-auto flex justify-between items-center opacity-20 text-[10px] font-bold uppercase tracking-widest">
            <span>&copy; 2026 AlgebraSolver Engine</span>
            <div className="flex gap-8">
              <a href="#">Documentation</a>
              <a href="#">API</a>
              <a href="#">Privacy</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500 selection:text-black">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer group select-none"
            onDoubleClick={handleToggleDisguise}
            onClick={() => {
              setSelectedGame(null);
              setSearchQuery('');
              setActiveCategory('All');
            }}
          >
            <div className="bg-orange-500 p-2 rounded-lg group-hover:rotate-12 transition-transform">
              <Gamepad2 className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-xl font-bold tracking-tighter italic">AlgebraSolver</h1>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all text-sm"
            />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!selectedGame ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeCategory === cat 
                      ? 'bg-orange-500 text-black' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Game Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredGames.map((game) => (
                  <motion.div
                    layout
                    key={game.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -5 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedGame(game)}
                  >
                    <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10 bg-white/5">
                      <img
                        src={game.thumbnail}
                        alt={game.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="bg-orange-500 text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase">Play Now</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h3 className="font-bold text-sm group-hover:text-orange-500 transition-colors truncate">{game.title}</h3>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{game.category}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredGames.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-white/40 italic">No games found matching your search.</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            {/* Game Header */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setSelectedGame(null)}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-bold uppercase tracking-tight">Back to Library</span>
              </button>
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-black uppercase italic tracking-tighter text-orange-500">{selectedGame.title}</h2>
                <div className="h-4 w-px bg-white/10" />
                <button 
                  onClick={toggleFullscreen}
                  className="text-white/40 hover:text-white transition-colors flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Fullscreen</span>
                </button>
                <a 
                  href={selectedGame.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Game Player */}
            <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-orange-500/5">
              <iframe
                ref={iframeRef}
                src={selectedGame.url}
                className="w-full h-full border-none"
                title={selectedGame.title}
                allowFullScreen
                allow="autoplay; fullscreen; keyboard-focus"
              />
            </div>

            {/* Game Footer Info */}
            <div className="flex flex-col md:flex-row gap-6 p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex-1">
                <h3 className="text-sm font-bold uppercase text-white/40 tracking-widest mb-2">About {selectedGame.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Enjoy {selectedGame.title} unblocked on our hub. This game is part of the {selectedGame.category} category. 
                  Use the fullscreen button within the game if available for the best experience.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-w-[200px]">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">
                  <span>Category</span>
                  <span className="text-white">{selectedGame.category}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">
                  <span>Status</span>
                  <span className="text-green-500">Online</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40">
                  <span>Controls</span>
                  <span className="text-white">Keyboard/Mouse</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-40">
            <Gamepad2 className="w-5 h-5" />
            <span className="text-xs font-bold tracking-tighter italic">AlgebraSolver &copy; 2026</span>
          </div>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-white/20">
            <a href="#" className="hover:text-orange-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Contact</a>
            <a href="#" className="hover:text-orange-500 transition-colors">DMCA</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

