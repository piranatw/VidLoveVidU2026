import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import type { User, UserStatus, TransportMode } from '../types';
import { clsx } from 'clsx';
import { User as UserIcon, GraduationCap, Ticket } from 'lucide-react';
import { supabase } from '../lib/supabase/client';
import CustomSelect from '../components/CustomSelect';

type Tab = 'student' | 'public';

const STATUS_OPTIONS: UserStatus[] = ['Single', 'Not Single', '???'];
const TRANSPORT_OPTIONS: TransportMode[] = ['Walk', 'Bike', 'Motorcycle', 'Bus', 'Private Car', 'Train', 'Other'];

const GENDER_OPTIONS = [
    { value: '', label: 'Select...' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
    { value: 'Prefer not to say', label: 'Prefer not to say' }
];

const YEAR_OPTIONS = [
    { value: '', label: 'Select...' },
    ...Array.from({ length: 6 }, (_, i) => ({ value: (i + 1).toString(), label: `Year ${i + 1}` }))
];

const STATUS_SELECT_OPTIONS = STATUS_OPTIONS.map(s => ({ value: s, label: s }));
const TRANSPORT_SELECT_OPTIONS = TRANSPORT_OPTIONS.map(t => ({ value: t, label: t }));

export default function Registration() {
    const navigate = useNavigate();
    const { registerUser } = useUserStore();
    const [activeTab, setActiveTab] = useState<Tab>('student');

    const [formData, setFormData] = useState<Partial<User>>({
        name: '',
        gender: '',
        phone: '',
        status: 'Single',
        transport: 'Walk',
        studentId: '',
        year: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.phone) {
            alert("Please fill in all required fields.");
            return;
        }

        // Phone Validation: 10 digits only
        const phoneRegex = /^([0-9]{9}|[0-9]{10})$/;
        if (!phoneRegex.test(formData.phone)) {
            alert("Please enter a valid 10-digit phone number (e.g., 0812345678).");
            return;
        }

        // Student-specific validation
        if (activeTab === 'student') {
            if (!formData.studentId || !formData.year) {
                alert("Please fill in all required fields.");
                return;
            }
            const studentIdRegex = /^[0-9]{10}$/;
            if (!studentIdRegex.test(formData.studentId)) {
                alert("Please enter a valid student ID (e.g., 1234567890).");
                return;
            }
        }

        try {
            const newUser: User = {
                id: crypto.randomUUID(), // Will be overwritten by DB trigger if needed, or matched
                type: activeTab === 'student' ? 'Student' : 'Public',
                name: formData.name!,
                gender: formData.gender || 'Not Specified',
                phone: formData.phone!,
                status: formData.status as UserStatus,
                transport: formData.transport as TransportMode,
                studentId: activeTab === 'student' ? formData.studentId : undefined,
                year: activeTab === 'student' ? formData.year : undefined,
                registeredAt: new Date().toISOString(),
                hasEntryPass: true,
            };

            // 1. Insert into Supabase (if connected)
            // We map camelCase to snake_case for DB
            const { data, error } = await supabase
                ?.from('registrations')
                .insert({
                    name: newUser.name,
                    type: newUser.type,
                    gender: newUser.gender,
                    phone: newUser.phone,
                    status: newUser.status,
                    transport: newUser.transport,
                    student_id: newUser.studentId,
                    year: newUser.year,
                    has_entry_pass: true
                })
                .select()
                .single() || { data: null, error: null };

            if (error) {
                console.error("Supabase error:", error);
                // Optional: decide if we block or allow local-only fallback. 
                // For now, let's alert but proceed locally for demo resilience if keys aren't set
                alert("Warning: Could not save to cloud database. Saving locally only.");
            }

            // 2. Use returned ID from DB if available, else local UUID
            const finalUser = data ? { ...newUser, id: data.id } : newUser;

            // 3. Update Local Store
            registerUser(finalUser);
            navigate('/status');

        } catch (err) {
            console.error("Registration error:", err);
            alert("Something went wrong.");
        }
    };

    const updateField = (field: keyof User, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="max-w-xl mx-auto py-6">
            <div className="bg-white rounded-3xl shadow-sm border border-nostalgia-100 overflow-hidden">
                {/* Header */}
                <div className="bg-nostalgia-50 p-6 text-center border-b border-nostalgia-100">
                    <div className="mx-auto w-16 h-16 bg-retro-pink/10 rounded-full flex items-center justify-center mb-4">
                        <Ticket className="w-8 h-8 text-retro-pink" />
                    </div>
                    <h1 className="text-2xl font-bold text-nostalgia-900">Festival Registration</h1>
                    <p className="text-nostalgia-600 mt-2">Get your digital entry pass</p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-nostalgia-100">
                    <button
                        onClick={() => setActiveTab('student')}
                        className={clsx(
                            "flex-1 py-4 font-bold text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2",
                            activeTab === 'student'
                                ? "bg-white text-retro-pink border-b-2 border-retro-pink"
                                : "bg-nostalgia-50 text-nostalgia-500 hover:bg-nostalgia-100"
                        )}
                    >
                        <GraduationCap className="w-4 h-4" />
                        Student
                    </button>
                    <button
                        onClick={() => setActiveTab('public')}
                        className={clsx(
                            "flex-1 py-4 font-bold text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2",
                            activeTab === 'public'
                                ? "bg-white text-retro-blue border-b-2 border-retro-blue"
                                : "bg-nostalgia-50 text-nostalgia-500 hover:bg-nostalgia-100"
                        )}
                    >
                        <UserIcon className="w-4 h-4" />
                        Public / Alumni
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                    {/* Common Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-nostalgia-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => updateField('name', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-nostalgia-200 focus:outline-none focus:ring-2 focus:ring-retro-pink/50"
                                placeholder="Enter your name"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-nostalgia-700 mb-1">Gender</label>
                                <CustomSelect
                                    value={formData.gender || ''}
                                    onChange={value => updateField('gender', value)}
                                    options={GENDER_OPTIONS}
                                    placeholder="Select..."
                                    accent={activeTab === 'student' ? 'pink' : 'blue'}
                                />
                            </div>
                            <div className="w-full">
                                <label className="block text-sm font-bold text-nostalgia-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={e => {
                                        // Allow only numbers and max 10 chars
                                        const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                                        updateField('phone', val);
                                    }}
                                    className="w-full px-4 py-3 rounded-xl border border-nostalgia-200 focus:outline-none focus:ring-2 focus:ring-retro-pink/50"
                                    placeholder="08xxxxxxxx"
                                />
                            </div>
                        </div>

                        {/* Student Specific */}
                        {activeTab === 'student' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                <div>
                                    <label className="block text-sm font-bold text-nostalgia-700 mb-1">Student ID</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.studentId}
                                        onChange={e => updateField('studentId', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-nostalgia-200 focus:outline-none focus:ring-2 focus:ring-retro-pink/50"
                                        placeholder="6xxxxxxxxx"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-nostalgia-700 mb-1">Year</label>
                                    <CustomSelect
                                        value={formData.year || ''}
                                        onChange={value => updateField('year', value)}
                                        options={YEAR_OPTIONS}
                                        placeholder="Select..."
                                        required
                                        accent="pink"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-nostalgia-700 mb-1">Relationship Status</label>
                            <CustomSelect
                                value={formData.status || 'Single'}
                                onChange={value => updateField('status', value)}
                                options={STATUS_SELECT_OPTIONS}
                                accent={activeTab === 'student' ? 'pink' : 'blue'}
                            />
                            <p className="text-xs text-nostalgia-500 mt-1">This will determine your wristband color!</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-nostalgia-700 mb-1">Transport Mode</label>
                            <CustomSelect
                                value={formData.transport || 'Walk'}
                                onChange={value => updateField('transport', value)}
                                options={TRANSPORT_SELECT_OPTIONS}
                                accent={activeTab === 'student' ? 'pink' : 'blue'}
                            />
                        </div>

                    </div>

                    <button
                        type="submit"
                        className={clsx(
                            "w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95",
                            activeTab === 'student'
                                ? "bg-retro-pink hover:bg-retro-pink/90 shadow-retro-pink/30"
                                : "bg-retro-blue hover:bg-retro-blue/90 shadow-retro-blue/30"
                        )}
                    >
                        Get Entry Pass
                    </button>

                </form>
            </div>
        </div>
    );
}
