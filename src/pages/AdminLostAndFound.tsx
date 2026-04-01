import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostStore } from '../store/usePostStore';
import { ArrowLeft, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminLostAndFound() {
    const navigate = useNavigate();
    const { addItem } = usePostStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        contactInfo: ''
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await addItem({
                name: formData.name,
                description: formData.description,
                location: formData.location,
                contactInfo: formData.contactInfo,
                imageUrl: '' // Will be replaced by file upload
            }, imageFile || undefined);

            navigate('/lost-and-found');
        } catch (error) {
            console.error(error);
            alert('Failed to add item');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-6">
            <Link to="/lost-and-found" className="flex items-center gap-2 text-nostalgia-600 mb-6 hover:text-nostalgia-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Board
            </Link>

            <div className="bg-white rounded-3xl shadow-sm border border-nostalgia-100 p-8">
                <h1 className="text-2xl font-bold text-nostalgia-900 mb-6 flex items-center gap-2">
                    <Upload className="w-6 h-6 text-retro-pink" />
                    Report Found Item
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-nostalgia-700 mb-1">Item Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-nostalgia-200 focus:outline-none focus:ring-2 focus:ring-retro-pink/50"
                            placeholder="e.g. Red Scarf"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-nostalgia-700 mb-1">Location Found</label>
                        <input
                            type="text"
                            required
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-nostalgia-200 focus:outline-none focus:ring-2 focus:ring-retro-pink/50"
                            placeholder="e.g. Near Main Stage"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-nostalgia-700 mb-1">Description</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-nostalgia-200 focus:outline-none focus:ring-2 focus:ring-retro-pink/50 resize-none"
                            placeholder="Describe the item details..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-nostalgia-700 mb-2">
                            <ImageIcon className="w-4 h-4 inline mr-1" />
                            Upload Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-4 py-3 rounded-xl border border-nostalgia-200 focus:outline-none focus:ring-2 focus:ring-retro-pink/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-retro-pink/10 file:text-retro-pink file:font-medium hover:file:bg-retro-pink/20"
                        />
                        {imagePreview && (
                            <div className="mt-3 relative rounded-xl overflow-hidden border border-nostalgia-200">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-nostalgia-700">
                                    Preview
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-nostalgia-700 mb-1">Contact Info (Internal)</label>
                        <input
                            type="text"
                            value={formData.contactInfo}
                            onChange={e => setFormData({ ...formData, contactInfo: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-nostalgia-200 focus:outline-none focus:ring-2 focus:ring-retro-pink/50"
                            placeholder="Who found it? Phone/Name"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-xl font-bold text-white bg-retro-pink hover:bg-retro-pink/90 shadow-lg shadow-retro-pink/30 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            "Post Item"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
