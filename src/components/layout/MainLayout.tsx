import { Outlet, Link, useLocation } from 'react-router-dom';
import { Search, Home } from 'lucide-react';
import logoImg from '../../assets/backgrounds/logo.png';

export default function MainLayout() {
    const location = useLocation();
    const isGamePage = location.pathname === '/game';

    return (
        <div className={`min-h-screen bg-nostalgia-50 text-nostalgia-900 font-sans ${isGamePage ? 'flex justify-center items-center' : ''}`}>
            {/* Hide header on game page */}
            {!isGamePage && (
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-nostalgia-200 shadow-sm">
                    <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                        <Link to="/" className="text-xl font-bold tracking-tight text-retro-pink flex items-center gap-2">
                            {/* <Heart className="w-6 h-6 fill-current" /> */}

                            <div className="w-12 h-12 rounded-full border-2 border-[#E5E5E5] relative overflow-hidden shadow-inner shrink-0">
                                <img
                                    src={logoImg}
                                    alt="VLVU Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </Link>

                        <nav className="flex items-center gap-4">
                            <Link to="/" className="p-2 hover:bg-nostalgia-100 rounded-full transition-colors">
                                <Home className="w-5 h-5 text-nostalgia-700" />
                            </Link>
                            <Link to="/lost-and-found" className="p-2 hover:bg-nostalgia-100 rounded-full transition-colors">
                                <Search className="w-5 h-5 text-nostalgia-700" />
                            </Link>
                        </nav>
                    </div>
                </header>
            )}

            <main className={isGamePage ? '' : 'max-w-4xl mx-auto px-4 py-8'}>
                <Outlet />
            </main>

            {/* Hide footer on game page */}
            {!isGamePage && (
                <footer className="text-center py-8 text-nostalgia-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} First Love Festival</p>
                </footer>
            )}
        </div>
    );
}
