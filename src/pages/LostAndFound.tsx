import { useEffect, useState, useMemo } from 'react';
import { usePostStore } from '../store/usePostStore';
import { Search, MapPin, Clock, ArrowUpDown } from 'lucide-react';

import { Link } from 'react-router-dom';

export default function LostAndFound() {
    const { items, fetchItems, isLoading } = usePostStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortNewest, setSortNewest] = useState(true);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const filteredItems = useMemo(() => {
        let result = items.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase())
        );

        result.sort((a, b) => {
            const dateA = new Date(a.foundAt).getTime();
            const dateB = new Date(b.foundAt).getTime();
            return sortNewest ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [items, searchQuery, sortNewest]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-nostalgia-900">Lost & Found</h1>
                    <p className="text-nostalgia-600">Community board for lost items</p>
                </div>

                <div className="flex items-center gap-3">
                    <Link to="/admin/lost-and-found" className="text-sm font-bold text-retro-pink hover:underline">
                        + Add Item
                    </Link>
                    <span className="text-nostalgia-300">|</span>
                    <Link to="/admin/manage-posts" className="text-sm font-bold text-retro-blue hover:underline">
                        Manage Posts
                    </Link>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-nostalgia-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-nostalgia-400" />
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-nostalgia-200 focus:outline-none focus:ring-2 focus:ring-retro-blue/50"
                    />
                </div>
                <button
                    onClick={() => setSortNewest(!sortNewest)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-nostalgia-200 hover:bg-nostalgia-50 transition-colors text-nostalgia-700 font-medium"
                >
                    <ArrowUpDown className="w-4 h-4" />
                    {sortNewest ? 'Newest First' : 'Oldest First'}
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-nostalgia-400">Loading items...</div>
            ) : (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {filteredItems.map(item => (
                        <div key={item.id} className="break-inside-avoid bg-white rounded-2xl shadow-sm border border-nostalgia-100 overflow-hidden hover:shadow-md transition-shadow">
                            {item.imageUrl && (
                                <div className="relative h-48 w-full overflow-hidden bg-nostalgia-100">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className={`w-full h-full object-cover transition-transform hover:scale-105 ${item.isClaimed ? 'grayscale opacity-50' : ''
                                            }`}
                                    />
                                    {item.isClaimed && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="bg-green-500 text-white px-8 py-3 font-bold text-xl transform -rotate-15 shadow-xl border-2 border-white">
                                                CLAIMED
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-nostalgia-900 leading-tight">{item.name}</h3>
                                    {item.isClaimed && (
                                        <span className="px-2 py-1 bg-green-500/20 text-green-700 text-xs font-bold rounded-full uppercase">
                                            Claimed
                                        </span>
                                    )}
                                </div>

                                <p className="text-nostalgia-700 text-sm mb-4 line-clamp-3">{item.description}</p>

                                <div className="flex flex-col gap-2 text-xs text-nostalgia-500 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {item.location}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date(item.foundAt).toLocaleDateString()} • {new Date(item.foundAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>

                                    {/* Hide contact info for claimed items */}
                                    {!item.isClaimed && item.contactInfo && (
                                        <div className="mt-2 pt-2 border-t border-nostalgia-100">
                                            <p className="text-nostalgia-600 text-xs">
                                                Contact: {item.contactInfo}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredItems.length === 0 && (
                        <div className="col-span-full text-center py-12 text-nostalgia-400">
                            No items found matching your search.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
