import React, { useState, useEffect } from 'react';
import { Application } from '../types';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastProvider';

const MOCK_APPLICATIONS: Application[] = [
    {
        id: '1',
        projectTitle: 'Akıllı Tarım Sistemi',
        area: 'Mühendislik',
        teamName: 'GreenTech',
        submissionDate: '12.10.2023',
        status: 'InReview',
        feedback: 'Yöntem kısmı güçlü, bütçe detaylandırılmalı.',
        refNo: '#2209A-2023-0142',
        score: 85
    },
    {
        id: '2',
        projectTitle: 'Engelsiz Kampüs',
        area: 'Sosyal Bilimler',
        teamName: 'SosyalEtki',
        submissionDate: '05.10.2023',
        status: 'Approved',
        feedback: 'Kabul edilebilir.',
        refNo: '#2209A-2023-0089',
        score: 92
    },
    {
        id: '3',
        projectTitle: 'Yapay Zeka Destekli İHA',
        area: 'Havacılık',
        teamName: 'SkyHunters',
        submissionDate: '28.09.2023',
        status: 'Rejected',
        feedback: 'Özgün değer kriteri zayıf.',
        refNo: '#2209A-2023-0056',
        score: 45
    },
    {
        id: '4',
        projectTitle: 'Kütüphane Otomasyonu',
        area: 'Yazılım',
        teamName: 'LibSys',
        submissionDate: '15.09.2023',
        status: 'Pending',
        feedback: 'Literatür taraması eksik.',
        refNo: '#2209A-2023-0012',
        score: 65
    }
];

const StatusBadge = ({ app }: { app: Application }) => {
    // Show AI Score for InReview/Pending to act as a prediction
    if (app.status === 'InReview' || app.status === 'Pending') {
        let colorClass = 'bg-gray-100 text-gray-700';
        if ((app.score || 0) >= 80) colorClass = 'bg-green-100 text-green-700';
        else if ((app.score || 0) >= 60) colorClass = 'bg-yellow-100 text-yellow-700';
        else colorClass = 'bg-red-100 text-red-700';

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${colorClass} border border-current/10`}>
                <span className="material-symbols-outlined text-[16px]">psychology</span>
                AI Tahmini: %{app.score}
            </span>
        );
    }

    switch (app.status) {
        case 'Approved':
            return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><span className="size-1.5 rounded-full bg-green-600"></span>Kabul Edildi</span>;
        case 'Rejected':
            return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><span className="size-1.5 rounded-full bg-red-600"></span>Red Edildi</span>;
        default:
            return null;
    }
};

const ProjectIcon = ({ area }: { area: string }) => {
    let icon = 'lightbulb';
    let colorClass = 'bg-gray-100 text-gray-600';
    
    if (area === 'Mühendislik') { icon = 'agriculture'; colorClass = 'bg-indigo-100 text-indigo-600'; }
    else if (area === 'Sosyal Bilimler') { icon = 'accessibility_new'; colorClass = 'bg-teal-100 text-teal-600'; }
    else if (area === 'Havacılık') { icon = 'flight_takeoff'; colorClass = 'bg-red-100 text-red-600'; }
    else if (area === 'Yazılım') { icon = 'menu_book'; colorClass = 'bg-orange-100 text-orange-600'; }

    return (
        <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
            <span className="material-symbols-outlined">{icon}</span>
        </div>
    );
};

export const Applications: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [filter, setFilter] = useState<'All' | 'Pending' | 'InReview' | 'Approved' | 'Rejected'>('All');
    const [applications, setApplications] = useState<Application[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('applications');
        if (stored) {
            setApplications(JSON.parse(stored));
        } else {
            // Initial Seed
            localStorage.setItem('applications', JSON.stringify(MOCK_APPLICATIONS));
            setApplications(MOCK_APPLICATIONS);
        }
    }, []);

    const filteredApps = applications.filter(app => {
        if (filter === 'All') return true;
        if (filter === 'Pending') return app.status === 'Pending';
        if (filter === 'InReview') return app.status === 'InReview';
        if (filter === 'Approved') return app.status === 'Approved' || app.status === 'Rejected'; // Grouping concluded
        return true;
    });

    const FilterButton = ({ label, value }: { label: string, value: typeof filter | 'Concluded' }) => {
        // Mapping 'Concluded' to check for Approved or Rejected mostly for UI logic
        const isActive = value === 'Concluded' ? (filter === 'Approved' || filter === 'Rejected') : filter === value;
        
        return (
            <button 
                onClick={() => setFilter(value as any)}
                className={`shrink-0 px-4 h-9 rounded-full text-sm font-medium transition-colors border ${isActive 
                    ? 'bg-primary text-white border-primary shadow-sm' 
                    : 'bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary'}`}
            >
                {label}
            </button>
        );
    }

    return (
        <div className="flex flex-col gap-8 h-[calc(100vh-8rem)]">
            {/* Header */}
            <div className="flex flex-col gap-4">
                 <button onClick={() => navigate(-1)} className="group flex items-center gap-2 px-3 py-2 rounded-full w-fit text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm transition-all">
                    <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    <span className="font-bold text-sm">Geri</span>
                </button>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Başvurularım</h1>
                        <p className="text-gray-500 max-w-2xl">Proje başvurularınızın değerlendirme süreçlerini, hakem geri bildirimlerini ve sonuç durumlarını buradan takip edebilirsiniz.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/create-team')}
                        className="flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold h-10 px-5 shadow-sm transition-all shrink-0 active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                        Yeni Başvuru Oluştur
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative group">
                     <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
                     <input type="text" placeholder="Proje adı, numara veya ekip adı ile ara..." className="w-full h-11 pl-10 pr-3 rounded-lg border-none bg-white shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-primary text-sm transition-all" />
                </div>
                <div className="md:col-span-2 flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                     <FilterButton label="Tümü" value="All" />
                     <FilterButton label="Beklemede" value="Pending" />
                     <FilterButton label="İnceleniyor" value="InReview" />
                     <FilterButton label="Sonuçlananlar" value="Approved" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
                <div className="overflow-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-gray-50 border-b border-gray-200 z-10">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Proje Adı</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Alan</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ekip Adı</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Gönderim Tarihi</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">AI Durumu</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Son Geri Bildirim</th>
                                <th className="px-6 py-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredApps.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        Bu filtrede henüz bir başvuru bulunmamaktadır.
                                    </td>
                                </tr>
                            ) : (
                                filteredApps.map((app) => (
                                    <tr key={app.id} onClick={() => setSelectedApp(app)} className="hover:bg-gray-50 cursor-pointer transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="mr-3">
                                                    <ProjectIcon area={app.area} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{app.projectTitle}</div>
                                                    <div className="text-xs text-gray-500">{app.refNo}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{app.area}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{app.teamName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{app.submissionDate}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge app={app} />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">{app.feedback}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
                    <p className="text-sm text-gray-500">Toplam <span className="font-bold text-gray-900">{filteredApps.length}</span> başvurudan <span className="font-bold text-gray-900">1-{filteredApps.length}</span> arası gösteriliyor</p>
                    <div className="flex gap-2">
                        <button onClick={() => showToast("Önceki sayfa yok", 'info')} className="px-3 py-1 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors">Önceki</button>
                        <button onClick={() => showToast("Sonraki sayfa yok", 'info')} className="px-3 py-1 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Sonraki</button>
                    </div>
                </div>
            </div>

            {/* Detail Slide-over */}
            <div 
                className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col border-l border-gray-200 ${selectedApp ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {selectedApp && (
                    <>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">Başvuru Detayı</h2>
                            <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-primary transition-colors p-1 rounded-full hover:bg-gray-100">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="flex flex-col gap-2">
                                <StatusBadge app={selectedApp} />
                                <h3 className="text-2xl font-bold text-gray-900 leading-tight">{selectedApp.projectTitle}</h3>
                                <p className="text-sm text-gray-500">Başvuru No: {selectedApp.refNo}</p>
                            </div>

                            {selectedApp.score && (
                                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-white flex items-center justify-center text-primary font-black shadow-sm">
                                            %{selectedApp.score}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Yapay Zeka Analizi</p>
                                            <p className="text-xs text-gray-600">Bu proje AI tarafından %{selectedApp.score} ihtimalle desteklenebilir olarak tahmin edilmiştir.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-white rounded-full text-primary shrink-0 shadow-sm">
                                        <span className="material-symbols-outlined text-[20px]">group</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Proje Ekibi</p>
                                        <p className="text-sm font-bold text-gray-900">{selectedApp.teamName}</p>
                                        <p className="text-xs text-gray-500">Yürütücü: Ahmet Yılmaz</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-white rounded-full text-primary shrink-0 shadow-sm">
                                        <span className="material-symbols-outlined text-[20px]">school</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Danışman</p>
                                        <p className="text-sm font-bold text-gray-900">Dr. Öğr. Üyesi Ayşe Yılmaz</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2">Proje Özeti</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Bu proje, nesnelerin interneti (IoT) teknolojilerini kullanarak tarım arazilerinde su verimliliğini artırmayı hedeflemektedir. Toprak nem sensörlerinden alınan veriler, geliştirdiğimiz mobil uygulama üzerinden çiftçiye anlık olarak iletilecek ve otomatik sulama sistemlerini tetikleyecektir. Bu sayede %30'a varan su tasarrufu sağlanması öngörülmektedir.
                                </p>
                            </div>
                            
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2">Değerlendirme Durumu</h4>
                                <div className="flex flex-col gap-4 pl-2">
                                    <div className="relative pl-6 border-l-2 border-green-500">
                                        <div className="absolute -left-[5px] top-0 size-2.5 rounded-full bg-green-500 ring-4 ring-white"></div>
                                        <p className="text-xs text-gray-400">{selectedApp.submissionDate} - 14:30</p>
                                        <p className="text-sm font-bold text-gray-900">Başvuru Sisteme Yüklendi</p>
                                    </div>
                                    <div className="relative pl-6 border-l-2 border-green-500">
                                         <div className="absolute -left-[5px] top-0 size-2.5 rounded-full bg-green-500 ring-4 ring-white"></div>
                                        <p className="text-xs text-gray-400">15.10.2023 - 09:15</p>
                                        <p className="text-sm font-bold text-gray-900">AI Ön Değerlendirme</p>
                                        <p className="text-xs text-gray-500 mt-1">Sistem tarafından %{selectedApp.score || 85} başarı oranı hesaplandı.</p>
                                    </div>
                                    <div className="relative pl-6 border-l-2 border-blue-500">
                                         <div className="absolute -left-[5px] top-0 size-2.5 rounded-full bg-blue-500 ring-4 ring-white animate-pulse"></div>
                                        <p className="text-xs text-gray-400">20.10.2023 - 11:00</p>
                                        <p className="text-sm font-bold text-gray-900">Bilimsel Değerlendirmede</p>
                                        <p className="text-xs text-gray-500 mt-1">Hakem ataması yapıldı, rapor bekleniyor.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50">
                            <button 
                                onClick={() => showToast("Dosya indirme başlatıldı...", 'success')}
                                className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm font-bold h-10 px-4 hover:bg-gray-50 transition-colors shadow-sm active:scale-95"
                            >
                                <span className="material-symbols-outlined text-[18px]">download</span>
                                Başvuru Dosyasını İndir
                            </button>
                        </div>
                    </>
                )}
            </div>
            {/* Overlay */}
            {selectedApp && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setSelectedApp(null)}></div>
            )}
        </div>
    );
};