'use client';
import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [data, setData] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    // Fetch initial data
    useEffect(() => {
        if (isAuthenticated) {
            fetch('/api/admin/data')
                .then((res) => res.json())
                .then((json) => setData(json))
                .catch(console.error);
        }
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect password');
        }
    };

    const handleSave = async () => {
        if (!data) return;
        setSaving(true);
        try {
            const res = await fetch('/api/admin/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                alert('Changes saved successfully! Fast refresh should reload your app.');
            } else {
                alert('Failed to save. Ensure you are in development mode.');
            }
        } catch (err) {
            console.error(err);
            alert('Error saving data.');
        } finally {
            setSaving(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-card p-8 rounded-xl border border-border shadow-lg text-center">
                    <ShieldAlert size={48} className="mx-auto text-primary mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Local Admin Access</h1>
                    <p className="text-muted-foreground text-sm mb-6">
                        Enter your passcode to manage portfolio content.
                    </p>
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <input
                            type="password"
                            placeholder="Passcode..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
                        />
                        <button
                            type="submit"
                            className="bg-primary text-primary-foreground font-semibold py-2 rounded-lg hover:opacity-90"
                        >
                            Unlock Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (!data) {
        return <div className="p-8 text-center text-muted-foreground">Loading portfolio data...</div>;
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-8 font-mono">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-primary">0xMaruF Admin</h1>
                        <p className="text-muted-foreground text-sm">Local Development CMS</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save All Changes'}
                    </button>
                </div>

                <div className="space-y-12">
                    {/* Companies Manager */}
                    <section className="bg-card p-6 rounded-xl border border-border">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Certificate Companies</h2>
                            <button
                                onClick={() => setData({
                                    ...data,
                                    CERTIFICATE_COMPANIES: [...data.CERTIFICATE_COMPANIES, { name: 'New Company', logo: '', color: '#ffffff' }]
                                })}
                                className="text-xs bg-secondary px-3 py-1 rounded flex items-center gap-1"
                            >
                                <Plus size={14} /> Add Company
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {data.CERTIFICATE_COMPANIES.map((company: any, index: number) => (
                                <div key={index} className="flex items-center gap-4 bg-background p-4 rounded-lg border border-border">
                                    <input
                                        className="bg-transparent border-b border-border p-1 w-1/4 focus:border-primary outline-none"
                                        value={company.name}
                                        placeholder="Company Name"
                                        onChange={(e) => {
                                            const newArr = [...data.CERTIFICATE_COMPANIES];
                                            newArr[index].name = e.target.value;
                                            setData({ ...data, CERTIFICATE_COMPANIES: newArr });
                                        }}
                                    />
                                    <input
                                        className="bg-transparent border-b border-border p-1 flex-1 focus:border-primary outline-none"
                                        value={company.logo}
                                        placeholder="Logo URL (e.g. /certificates/logos/google.svg)"
                                        onChange={(e) => {
                                            const newArr = [...data.CERTIFICATE_COMPANIES];
                                            newArr[index].logo = e.target.value;
                                            setData({ ...data, CERTIFICATE_COMPANIES: newArr });
                                        }}
                                    />
                                    <input
                                        type="color"
                                        className="w-10 h-10 rounded cursor-pointer bg-transparent"
                                        value={company.color}
                                        onChange={(e) => {
                                            const newArr = [...data.CERTIFICATE_COMPANIES];
                                            newArr[index].color = e.target.value;
                                            setData({ ...data, CERTIFICATE_COMPANIES: newArr });
                                        }}
                                    />
                                    <button 
                                        className="text-red-400 hover:text-red-500 p-2"
                                        onClick={() => {
                                            const newArr = data.CERTIFICATE_COMPANIES.filter((_: any, i: number) => i !== index);
                                            setData({ ...data, CERTIFICATE_COMPANIES: newArr });
                                        }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Certificates Manager */}
                    <section className="bg-card p-6 rounded-xl border border-border">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Certificates</h2>
                            <button
                                onClick={() => setData({
                                    ...data,
                                    CERTIFICATES: [{ title: 'New Cert', company: 'Google', category: 'Security', date: '2024-01', image: '', credentialId: '', verifyUrl: '#' }, ...data.CERTIFICATES]
                                })}
                                className="text-xs bg-secondary px-3 py-1 rounded flex items-center gap-1"
                            >
                                <Plus size={14} /> Add Certificate
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2">
                            {data.CERTIFICATES.map((cert: any, index: number) => (
                                <div key={index} className="flex flex-col gap-3 bg-background p-4 rounded-lg border border-border">
                                    <div className="flex justify-between items-center">
                                        <input
                                            className="bg-transparent border-b border-border p-1 font-bold w-1/2 focus:border-primary outline-none"
                                            value={cert.title}
                                            placeholder="Certificate Title"
                                            onChange={(e) => {
                                                const newArr = [...data.CERTIFICATES];
                                                newArr[index].title = e.target.value;
                                                setData({ ...data, CERTIFICATES: newArr });
                                            }}
                                        />
                                        <button 
                                            className="text-red-400 hover:text-red-500 p-1"
                                            onClick={() => {
                                                const newArr = data.CERTIFICATES.filter((_: any, i: number) => i !== index);
                                                setData({ ...data, CERTIFICATES: newArr });
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <select
                                            className="bg-secondary border border-border rounded p-1 text-sm outline-none"
                                            value={cert.company}
                                            onChange={(e) => {
                                                const newArr = [...data.CERTIFICATES];
                                                newArr[index].company = e.target.value;
                                                setData({ ...data, CERTIFICATES: newArr });
                                            }}
                                        >
                                            {data.CERTIFICATE_COMPANIES.map((c: any) => (
                                                <option key={c.name} value={c.name}>{c.name}</option>
                                            ))}
                                        </select>
                                        <input
                                            className="bg-transparent border-b border-border p-1 text-sm focus:border-primary outline-none"
                                            value={cert.category}
                                            placeholder="Category (e.g. Security)"
                                            onChange={(e) => {
                                                const newArr = [...data.CERTIFICATES];
                                                newArr[index].category = e.target.value;
                                                setData({ ...data, CERTIFICATES: newArr });
                                            }}
                                        />
                                        <input
                                            className="bg-transparent border-b border-border p-1 text-sm focus:border-primary outline-none"
                                            value={cert.date}
                                            placeholder="Date (e.g. 2024-03)"
                                            onChange={(e) => {
                                                const newArr = [...data.CERTIFICATES];
                                                newArr[index].date = e.target.value;
                                                setData({ ...data, CERTIFICATES: newArr });
                                            }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        <input
                                            className="bg-transparent border-b border-border p-1 text-sm focus:border-primary outline-none"
                                            value={cert.image}
                                            placeholder="Image URL (e.g. /certificates/google-it.png)"
                                            onChange={(e) => {
                                                const newArr = [...data.CERTIFICATES];
                                                newArr[index].image = e.target.value;
                                                setData({ ...data, CERTIFICATES: newArr });
                                            }}
                                        />
                                        <div className="flex gap-4">
                                            <input
                                                className="bg-transparent border-b border-border p-1 text-sm w-1/3 focus:border-primary outline-none"
                                                value={cert.credentialId || ''}
                                                placeholder="Credential ID (Optional)"
                                                onChange={(e) => {
                                                    const newArr = [...data.CERTIFICATES];
                                                    newArr[index].credentialId = e.target.value;
                                                    setData({ ...data, CERTIFICATES: newArr });
                                                }}
                                            />
                                            <input
                                                className="bg-transparent border-b border-border p-1 text-sm flex-1 focus:border-primary outline-none"
                                                value={cert.verifyUrl || ''}
                                                placeholder="Verify URL"
                                                onChange={(e) => {
                                                    const newArr = [...data.CERTIFICATES];
                                                    newArr[index].verifyUrl = e.target.value;
                                                    setData({ ...data, CERTIFICATES: newArr });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
