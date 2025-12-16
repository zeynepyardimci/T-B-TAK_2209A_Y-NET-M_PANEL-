import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

const SidebarLink = ({ to, icon, label, exact = false }: { to: string; icon: string; label: string; exact?: boolean }) => {
    return (
        <NavLink
            to={to}
            end={exact}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                        ? 'bg-primary/10 text-primary font-bold shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <span className={`material-symbols-outlined transition-colors ${isActive ? 'filled' : ''}`}>
                        {icon}
                    </span>
                    <span className="text-sm">{label}</span>
                </>
            )}
        </NavLink>
    );
};

export const Layout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Auth Check
    useEffect(() => {
        const auth = localStorage.getItem('auth');
        if (!auth) {
            navigate('/');
        }
        
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            // Fallback for visual consistency if no user data found (shouldn't happen with auth)
            setUser({ name: 'Ahmet Yılmaz', role: 'Öğrenci' });
        }
    }, [navigate]);

    // Dynamic title based on path
    const getPageTitle = () => {
        switch (location.pathname) {
            case '/dashboard': return 'Ana Sayfa';
            case '/applications': return 'Başvurularım';
            case '/join-team': return 'Ekibe Katıl';
            case '/create-team': return 'Ekip Oluştur';
            case '/draft': return 'Başvuru Taslağı';
            case '/project-idea': return 'Proje Fikri';
            case '/profile': return 'Profilim';
            case '/settings': return 'Ayarlar';
            case '/announcements': return 'Duyurular';
            default: return 'Panel';
        }
    };

    return (
        <div className="flex h-screen w-full bg-background-light overflow-hidden">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined">science</span>
                            </div>
                            <div>
                                <h1 className="font-display font-bold text-lg leading-none text-gray-900">TÜBİTAK</h1>
                                <p className="text-xs text-gray-500 font-medium">2209-A Paneli</p>
                            </div>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Ana Menü</p>
                        <SidebarLink to="/dashboard" icon="home" label="Ana Sayfa" />
                        <SidebarLink to="/applications" icon="description" label="Başvurularım" />
                        <SidebarLink to="/draft" icon="edit_document" label="Başvuru Taslağı" />
                        <SidebarLink to="/project-idea" icon="lightbulb" label="Proje Fikri" />
                        
                        <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-8 mb-2">Ekip & İşbirliği</p>
                        <SidebarLink to="/join-team" icon="group_add" label="Ekibe Katıl" />
                        <SidebarLink to="/create-team" icon="diversity_3" label="Ekip Oluştur" />
                        
                        <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-8 mb-2">Hesap</p>
                        <SidebarLink to="/profile" icon="person" label="Profilim" />
                    </nav>

                    {/* User */}
                    <div className="p-4 border-t border-gray-100">
                        <div onClick={() => navigate('/profile')} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                            <div 
                                className="size-10 rounded-full bg-gray-200 bg-cover bg-center" 
                                style={{ backgroundImage: `url(${user?.avatarUrl || 'https://picsum.photos/100/100'})` }}
                            ></div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.role || 'Öğrenci'}</p>
                            </div>
                            <button 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    localStorage.removeItem('auth');
                                    localStorage.removeItem('currentUser');
                                    navigate('/'); 
                                }} 
                                className="text-gray-400 hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined">logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <h2 className="font-display font-bold text-lg lg:text-xl text-gray-900">{getPageTitle()}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-colors relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 border-white"></span>
                        </button>
                        <button 
                            onClick={() => navigate('/settings')}
                            className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                            <span className="material-symbols-outlined">settings</span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto bg-background-light p-4 lg:p-8">
                    <div className="mx-auto max-w-7xl animate-fade-in">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};