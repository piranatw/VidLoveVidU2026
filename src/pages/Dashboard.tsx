import { Link } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { Ticket, Search, HeartHandshake, Heart } from 'lucide-react';
import { clsx } from 'clsx';

export default function Dashboard() {
    const { user } = useUserStore();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-full">
            {/* Registration / Entry Pass Card */}
            <Link
                to={user ? "/status" : "/register"}
                className={clsx(
                    "bg-white rounded-3xl p-6 shadow-sm border border-nostalgia-100 flex flex-col justify-between transition-transform hover:scale-[1.02]",
                    "min-h-[200px]"
                )}
            >
                <div>
                    <div className="w-12 h-12 bg-retro-blue/20 rounded-full flex items-center justify-center mb-4">
                        <Ticket className="w-6 h-6 text-retro-blue" />
                    </div>
                    <h2 className="text-2xl font-bold text-nostalgia-800 mb-2">
                        {user ? 'My Entry Pass' : 'Registration'}
                    </h2>
                    <p className="text-nostalgia-600">
                        {user
                            ? `Status: ${user.status} • ${user.transport}`
                            : 'Register now to get your festival wristband and entry pass.'}
                    </p>
                </div>

                {user ? (
                    <div className="mt-4 p-4 bg-nostalgia-50 rounded-xl border border-nostalgia-200">
                        <span className="text-xs font-bold uppercase tracking-wider text-nostalgia-500">Pass ID</span>
                        <div className="font-mono text-lg font-bold text-nostalgia-900">{user.id.slice(0, 8)}</div>
                    </div>
                ) : (
                    <div
                        className="mt-4 bg-retro-blue text-white py-2 px-4 rounded-xl font-bold text-center hover:bg-blue-400 transition-colors"
                    >
                        Get Pass
                    </div>
                )}
            </Link>

            {/* Lost & Found Card */}
            <Link
                to="/lost-and-found"
                className="bg-white rounded-3xl p-6 shadow-sm border border-nostalgia-100 flex flex-col justify-between transition-transform hover:scale-[1.02] min-h-[200px]"
            >
                <div>
                    <div className="w-12 h-12 bg-retro-green/20 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-6 h-6 text-retro-green" />
                    </div>
                    <h2 className="text-2xl font-bold text-nostalgia-800 mb-2">Lost & Found</h2>
                    <p className="text-nostalgia-600">
                        Check the community board for lost items or report something you found.
                    </p>
                </div>
                <div className="mt-4 text-retro-green font-bold flex items-center gap-2">
                    View Board &rarr;
                </div>
            </Link>

            {/* Game Card - Spans 2 cols */}
            <Link
                to="/game"
                className="col-span-1 md:col-span-2 bg-gradient-to-br from-retro-pink/10 to-white rounded-3xl p-8 shadow-sm border border-retro-pink/20 flex flex-col md:flex-row items-center gap-8 min-h-[240px] transition-transform hover:scale-[1.01]"
            >
                <div className="flex-1">
                    <div className="w-12 h-12 bg-retro-pink/20 rounded-full flex items-center justify-center mb-4">
                        <HeartHandshake className="w-6 h-6 text-retro-pink" />
                    </div>
                    <h2 className="text-3xl font-bold text-nostalgia-900 mb-2">First Love Game</h2>
                    <p className="text-nostalgia-700 text-lg mb-6">
                        Discover your romantic archetype and see who you match with at the festival.
                    </p>
                    <div className="bg-retro-pink text-white px-8 py-3 rounded-2xl font-bold hover:bg-red-400 transition-colors shadow-lg shadow-retro-pink/30 inline-block">
                        Start Game
                    </div>
                </div>
                {/* Decorative Illustration Area */}
                <div className="w-full md:w-1/3 aspect-video bg-white/50 rounded-2xl border border-white/20 flex items-center justify-center">
                    <span className="text-nostalgia-400 font-handwriting transform -rotate-6">
                        {/* <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-[#E5E5E5] overflow-hidden shadow-inner shrink-0"> */}
                        <Heart className="w-6 h-6 fill-current text-pink-300" />
                        {/* </div> */}
                    </span>
                </div>
            </Link>
        </div>
    );
}
