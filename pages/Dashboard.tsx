import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    
    // Retrieve user from localStorage
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    // Get first name or default to 'Öğrenci'
    const displayName = user.name ? user.name.split(' ')[0] : 'Öğrenci';

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Welcome Section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-gray-900">Merhaba, {displayName} 👋</h1>
                <p className="text-gray-500">Bugün projende ilerlemek için harika bir gün!</p>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="size-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">check_circle</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ekip Durumu</p>
                        <p className="font-bold text-gray-900 text-sm">"Innovators 2024" Üyesi</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border-l-4 border-l-primary border-y border-r border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="size-12 rounded-full bg-primary-light text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">edit_document</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mevcut Durum</p>
                        <p className="font-bold text-gray-900 text-sm">Başvuru Hazırlanıyor</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 opacity-60">
                    <div className="size-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">hourglass_empty</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Değerlendirme</p>
                        <p className="font-bold text-gray-900 text-sm">Sonuç Bekleniyor</p>
                    </div>
                </div>
            </div>

            {/* Active Project Card */}
            <div className="flex flex-col lg:flex-row bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex-[2] p-8 flex flex-col justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Aktif Proje
                            </span>
                            <span className="text-gray-400 text-xs font-mono">#2209A-24-8821</span>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 mb-2">Akıllı Sulama Sistemi</h3>
                        <p className="text-sm text-gray-500">Danışman: Dr. Öğr. Üyesi {user.name ? '...' : 'Ahmet Yılmaz'}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <p className="text-sm font-bold text-gray-700">Başvuru Formu Doluluk Oranı</p>
                            <span className="text-xl font-bold text-primary">45%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full w-[45%] shadow-[0_0_10px_rgba(227,10,23,0.4)]"></div>
                        </div>
                        <div className="flex gap-4 text-xs">
                             <div className="flex items-center gap-1 text-gray-500">
                                <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                                Özet Bilgi
                             </div>
                             <div className="flex items-center gap-1 text-gray-500">
                                <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                                Yöntem
                             </div>
                             <div className="flex items-center gap-1 font-bold text-primary">
                                <span className="material-symbols-outlined text-sm">radio_button_checked</span>
                                Bütçe (Devam Ediyor)
                             </div>
                        </div>
                    </div>

                    <div>
                        <button onClick={() => navigate('/draft')} className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-95">
                            Projeye Git
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                </div>

                {/* Decorative Right Side */}
                <div className="hidden lg:flex flex-1 bg-gradient-to-br from-gray-50 to-white relative items-center justify-center p-8 border-l border-gray-100">
                    <div className="absolute top-0 right-0 size-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 size-48">
                         {/* Abstract Visualization */}
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="size-20 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-gray-100 z-10">
                                <span className="material-symbols-outlined text-primary text-4xl">analytics</span>
                            </div>
                            <div className="absolute inset-0 border-2 border-dashed border-gray-200 rounded-full animate-[spin_10s_linear_infinite]"></div>
                            <div className="absolute size-[70%] border border-gray-200 rounded-full"></div>
                            {/* Orbiting labels */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100 text-[10px] font-bold text-gray-500">ANALİZ</div>
                            <div className="absolute bottom-4 right-0 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100 text-[10px] font-bold text-gray-500">BÜTÇE</div>
                            <div className="absolute bottom-4 left-0 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100 text-[10px] font-bold text-gray-500">PLAN</div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">bolt</span>
                    Hızlı İşlemler
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {[
                        { title: 'Ekip Oluştur', icon: 'group_add', path: '/create-team' },
                        { title: 'Ekibe Katıl', icon: 'group', path: '/join-team' },
                        { title: 'Proje Fikri', icon: 'lightbulb', path: '/project-idea' },
                        { title: 'Taslak Düzenle', icon: 'edit_note', path: '/draft', featured: true },
                        { title: 'Sonuçlar', icon: 'fact_check', path: '/applications' },
                    ].map((action, idx) => (
                        <button 
                            key={idx}
                            onClick={() => navigate(action.path)}
                            className={`group flex flex-col justify-between p-5 rounded-2xl border text-left h-full transition-all relative overflow-hidden active:scale-95 ${action.featured ? 'bg-white border-gray-200 shadow-md shadow-primary/5' : 'bg-white border-gray-200 hover:border-primary hover:shadow-lg hover:shadow-primary/5'}`}
                        >
                            {action.featured && <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full -mr-8 -mt-8"></div>}
                            <div className="flex flex-col gap-3 relative z-10">
                                <div className={`size-10 rounded-lg flex items-center justify-center transition-colors ${action.featured ? 'bg-primary/10 text-primary' : 'bg-gray-50 text-gray-600 group-hover:bg-primary group-hover:text-white'}`}>
                                    <span className="material-symbols-outlined">{action.icon}</span>
                                </div>
                                <p className="font-bold text-sm text-gray-900">{action.title}</p>
                            </div>
                            <div className="mt-4 flex justify-end relative z-10">
                                <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-all text-sm group-hover:translate-x-1">arrow_forward</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Announcement Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-[#b90812] shadow-xl shadow-red-900/10">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
                <div className="flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 gap-6 relative z-10">
                    <div className="flex items-start gap-5">
                         <div className="hidden sm:flex size-12 items-center justify-center rounded-full bg-white/20 text-white shrink-0 backdrop-blur-sm">
                            <span className="material-symbols-outlined">campaign</span>
                         </div>
                         <div className="flex flex-col gap-1 text-white">
                             <div className="flex items-center gap-3">
                                 <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Duyuru</span>
                                 <span className="text-white/80 text-xs font-medium">10 Kasım 2024</span>
                             </div>
                             <h3 className="text-lg font-bold">2209-A Başvuruları Uzatıldı!</h3>
                             <p className="text-sm text-white/90 max-w-lg leading-relaxed">Öğrenci talepleri üzerine son başvuru tarihi 25 Kasım 2024'e kadar uzatılmıştır.</p>
                         </div>
                    </div>
                    <button 
                        onClick={() => navigate('/announcements')}
                        className="bg-white text-primary px-6 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-gray-50 transition-colors whitespace-nowrap active:scale-95"
                    >
                        Detaylı İncele
                    </button>
                </div>
            </div>
        </div>
    );
};