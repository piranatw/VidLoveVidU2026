import { useState } from 'react';
import { usePostStore } from '../../store/usePostStore';
import { Pencil, Trash2, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import type { LostItem } from '../../types';

export default function AdminPostManager() {
    const { items, deleteItem, updateItem, toggleClaimed } = usePostStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isToggling, setIsToggling] = useState<string | null>(null);

    // Edit form state
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        location: '',
        contactInfo: '',
        file: null as File | null
    });

    const handleEdit = (item: LostItem) => {
        setEditingId(item.id);
        setEditForm({
            name: item.name,
            description: item.description || '',
            location: item.location,
            contactInfo: item.contactInfo || '',
            file: null
        });
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;

        try {
            await updateItem(
                editingId,
                {
                    name: editForm.name,
                    description: editForm.description,
                    location: editForm.location,
                    contactInfo: editForm.contactInfo
                },
                editForm.file || undefined
            );
            setEditingId(null);
            setEditForm({ name: '', description: '', location: '', contactInfo: '', file: null });
        } catch (error) {
            console.error('Failed to update:', error);
            alert('Failed to update item');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This will also remove the associated image.`)) {
            return;
        }

        setIsDeleting(id);
        try {
            await deleteItem(id);
        } catch (error) {
            console.error('Failed to delete:', error);
            alert('Failed to delete item');
        } finally {
            setIsDeleting(null);
        }
    };

    const handleToggleClaimed = async (id: string) => {
        setIsToggling(id);
        try {
            await toggleClaimed(id);
        } catch (error) {
            console.error('Failed to toggle claimed:', error);
            alert('Failed to toggle claimed status');
        } finally {
            setIsToggling(null);
        }
    };

    if (items.length === 0) {
        return (
            <div className="text-center py-12 text-nostalgia-400">
                No items found. Add some from the admin panel!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {items.map((item) => (
                <div
                    key={item.id}
                    className={`bg-white rounded-2xl border-2 p-4 ${item.isClaimed ? 'border-green-200 bg-green-50/30' : 'border-nostalgia-200'
                        }`}
                >
                    {/* Image Preview */}
                    {item.imageUrl && (
                        <div className="relative mb-3 rounded-xl overflow-hidden">
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className={`w-full h-48 object-cover ${item.isClaimed ? 'grayscale opacity-50' : ''
                                    }`}
                            />
                            {item.isClaimed && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-green-500 text-white px-6 py-2 font-bold text-xl transform -rotate-12 shadow-lg">
                                        CLAIMED
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Editing Mode */}
                    {editingId === item.id ? (
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="w-full px-3 py-2 border border-nostalgia-300 rounded-lg text-sm"
                                placeholder="Item Name"
                            />
                            <input
                                type="text"
                                value={editForm.location}
                                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                className="w-full px-3 py-2 border border-nostalgia-300 rounded-lg text-sm"
                                placeholder="Location"
                            />
                            <textarea
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                className="w-full px-3 py-2 border border-nostalgia-300 rounded-lg text-sm resize-none"
                                rows={3}
                                placeholder="Description"
                            />
                            <input
                                type="text"
                                value={editForm.contactInfo}
                                onChange={(e) => setEditForm({ ...editForm, contactInfo: e.target.value })}
                                className="w-full px-3 py-2 border border-nostalgia-300 rounded-lg text-sm"
                                placeholder="Contact Info"
                            />
                            <div>
                                <label className="block text-sm font-medium text-nostalgia-700 mb-1">
                                    Replace Image (Optional)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setEditForm({ ...editForm, file: e.target.files?.[0] || null })}
                                    className="w-full text-sm"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleSaveEdit}
                                    className="flex-1 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => setEditingId(null)}
                                    className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        // View Mode
                        <>
                            <div className="mb-3">
                                <h3 className="font-bold text-lg text-nostalgia-900">{item.name}</h3>
                                <p className="text-sm text-nostalgia-600">📍 {item.location}</p>
                                {item.description && (
                                    <p className="text-sm text-nostalgia-700 mt-1">{item.description}</p>
                                )}
                                {item.contactInfo && (
                                    <p className="text-xs text-nostalgia-500 mt-1">
                                        Contact: {item.contactInfo}
                                    </p>
                                )}
                            </div>

                            {/* Admin Actions - Mobile Optimized Vertical Stack */}
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="w-full min-h-[44px] py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Pencil className="w-4 h-4" />
                                    Edit Post
                                </button>

                                <button
                                    onClick={() => handleToggleClaimed(item.id)}
                                    disabled={isToggling === item.id}
                                    className={`w-full min-h-[44px] py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${item.isClaimed
                                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                                        : 'bg-green-500 text-white hover:bg-green-600'
                                        }`}
                                >
                                    {isToggling === item.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : item.isClaimed ? (
                                        <>
                                            <XCircle className="w-4 h-4" />
                                            Mark as Unclaimed
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            Mark as Claimed
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => handleDelete(item.id, item.name)}
                                    disabled={isDeleting === item.id}
                                    className="w-full min-h-[44px] py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isDeleting === item.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            Delete Post
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
