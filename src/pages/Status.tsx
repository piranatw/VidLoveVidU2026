import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { Ticket, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { useMemo } from 'react';

export default function Status() {
    const { user, clearUser } = useUserStore();
    const navigate = useNavigate();

    const statusTheme = useMemo(() => {
        switch (user?.status) {
            case 'Single':
                return {
                    bg: 'bg-mint-100',
                    text: 'text-mint-900',
                    border: 'border-mint-300',
                    iconBg: 'bg-mint-300',
                    iconColor: 'text-mint-900'
                };
            case 'Not Single':
                return {
                    bg: 'bg-rose-100',
                    text: 'text-rose-900',
                    border: 'border-rose-300',
                    iconBg: 'bg-rose-300',
                    iconColor: 'text-rose-900'
                };
            case '???':
                return {
                    bg: 'bg-lavender-100',
                    text: 'text-lavender-900',
                    border: 'border-lavender-300',
                    iconBg: 'bg-lavender-300',
                    iconColor: 'text-lavender-900'
                };
            default:
                return {
                    bg: 'bg-gray-100',
                    text: 'text-gray-900',
                    border: 'border-gray-300',
                    iconBg: 'bg-gray-300',
                    iconColor: 'text-gray-900'
                };
        }
    }, [user?.status]);

    if (!user) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-nostalgia-800">No Entry Pass Found</h2>
                <button
                    onClick={() => navigate('/register')}
                    className="mt-4 px-6 py-2 bg-retro-pink text-white rounded-xl"
                >
                    Register Now
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto py-10 px-4">
            <div className={clsx("rounded-3xl shadow-xl border overflow-hidden relative transition-colors duration-500", statusTheme.bg, statusTheme.border)}>
                <div className={clsx("h-4 w-full absolute top-0 left-0 opacity-50", statusTheme.iconBg)} />

                <div className="p-8 text-center">
                    <div className={clsx("w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6", statusTheme.iconBg)}>
                        <Ticket className={clsx("w-10 h-10", statusTheme.iconColor)} />
                    </div>

                    <h1 className={clsx("text-3xl font-bold mb-2", statusTheme.text)}>{user.name}</h1>
                    <p className={clsx("font-mono text-sm mb-6 opacity-70", statusTheme.text)}>ID: {user.id.slice(0, 8).toUpperCase()}</p>

                    <div className="space-y-4">
                        <div className="p-4 bg-white/50 rounded-2xl backdrop-blur-sm">
                            <span className={clsx("block text-xs uppercase tracking-wider font-bold opacity-70", statusTheme.text)}>Status</span>
                            <span className={clsx("text-xl font-bold", statusTheme.text)}>
                                {user.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {/* <div className="p-4 bg-white/50 rounded-2xl backdrop-blur-sm">
                                <span className={clsx("block text-xs uppercase tracking-wider font-bold opacity-70", statusTheme.text)}>Transport</span>
                                <span className={clsx("text-lg font-bold", statusTheme.text)}>{user.transport}</span>
                            </div> */}
                            <div className="p-4 bg-white/50 rounded-2xl backdrop-blur-sm">
                                <span className={clsx("block text-xs uppercase tracking-wider font-bold opacity-70", statusTheme.text)}>Type</span>
                                <span className={clsx("text-lg font-bold", statusTheme.text)}>{user.type}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={clsx("p-4 text-center text-xs opacity-60", statusTheme.bg, statusTheme.text)}>
                    Show this screen to staff for entry
                </div>
            </div>
        </div>
    );
}
