import AdminPostManager from '../components/admin/AdminPostManager';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';

export default function AdminManagePosts() {
    return (
        <div className="max-w-4xl mx-auto py-6">
            <Link to="/lost-and-found" className="flex items-center gap-2 text-nostalgia-600 mb-6 hover:text-nostalgia-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Board
            </Link>

            <div className="bg-white rounded-3xl shadow-sm border border-nostalgia-100 p-8">
                <h1 className="text-2xl font-bold text-nostalgia-900 mb-6 flex items-center gap-2">
                    <Settings className="w-6 h-6 text-retro-pink" />
                    Manage Posts
                </h1>

                <AdminPostManager />
            </div>
        </div>
    );
}
