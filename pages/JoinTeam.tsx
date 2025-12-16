import React, { useState } from 'react';
import { Team } from '../types';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastProvider';

const MOCK_TEAMS: Team[] = [
    {
        id: '1',
        name: 'Elif Demir',
        area: 'Bilgisayar Mühendisliği',
        description: 'Merhaba! Yapay zeka ve görüntü işleme üzerine çalışıyorum. 2209-A projemde sağlık alanında bir tanı sistemi geliştirmek istiyorum.',
        capacity: 5,
        currentMembers: 3,
        isTrending: true
    },
    {
        id: '2',
        name: 'Mert Yılmaz',
        area: 'Elektrik Elektronik Müh.',
        description: 'IoT tabanlı akıllı tarım sistemleri üzerine bir proje fikrim var. Gömülü sistemler ve sensörler konusunda bilgiliyim.',
        capacity: 4,
        currentMembers: 1
    },
    {
        id: '3',
        name: 'Zeynep Kaya',
        area: 'Psikoloji',
        description: 'Eğitim teknolojileri ve öğrenme psikolojisi üzerine bir çalışma planlıyorum. Veri analizi konusunda desteğe ihtiyacım var.',
        capacity: 5,
        currentMembers: 4
    },
    {
        id: '4',
        name: 'Can Ozturk',
        area: 'Moleküler Biyoloji',
        description: 'Kanser araştırmaları üzerine laboratuvar deneyimi olan biriyim. Biyoinformatik analizler için kodlama bilen arkadaş arıyorum.',
        capacity: 5,
        currentMembers: 4,
        urgent: true
    },
    {
        id: '5',
        name: 'Burak Özkan',
        area: 'Endüstri Mühendisliği',
        description: 'Tedarik zinciri optimizasyonu üzerine bir simülasyon projesi yapıyorum. Arena veya AnyLogic bilen, süreç analizi yapabilen arkadaşlar arıyorum.',
        capacity: 3,
        currentMembers: 2
    }
];

export const JoinTeam: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [filter, setFilter] = useState('Tümü');
    const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
    const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());

    const toggleBookmark = (id: string) => {
        const newBookmarks = new Set(bookmarks);
        if (newBookmarks.has(id)) {
            newBookmarks.delete(id);
            showToast('Favorilerden kaldırıldı.', 'info');
        } else {
            newBookmarks.add(id);
            showToast('Favorilere eklendi.', 'success');
        }
        setBookmarks(newBookmarks);
    };

    const handleJoinRequest = (teamId: string, teamName: string) => {
        setSentRequests(prev => new Set(prev).add(teamId));
        showToast(`${teamName} ile iletişime geçildi.`, 'success');
    };

    const filteredTeams = MOCK_TEAMS.filter(team => {
        if (filter === 'Tümü') return true;
        // Simple mock filtering logic
        if (filter === 'Mühendislik' && (team.area.includes('Mühendisliği') || team.area.includes('Müh.'))) return true;
        if (filter === 'Sağlık' && (team.area.includes('Biyoloji') || team.area.includes('Tıp'))) return true;
        if (filter === 'Sosyal Bilimler' && (team.area.includes('Psikoloji') || team.area.includes('Sosyoloji'))) return true;
        return false;
    });

    const getInitials = (name: string) => {
        return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
    };

    const getRandomColor = (id: string) => {
        const colors = [
            'bg-emerald-100 text-emerald-700',
            'bg-blue-100 text-blue-700',
            'bg-amber-100 text-amber-700',
            'bg-purple-100 text-purple-700',
            'bg-rose-100 text-rose-700'
        ];
        return colors[parseInt(id) % colors.length];
    };

    const getUniversity = (id: string) => {
        const unis = ['Orta Doğu Teknik Üniversitesi', 'İstanbul Teknik Üniversitesi', 'Hacettepe Üniversitesi', 'Boğaziçi Üniversitesi', 'Gazi Üniversitesi'];
        return unis[parseInt(id) % unis.length];
    }

    const getTags = (area: string) => {
        if (area.includes('Bilgisayar')) return ['Yazılım', 'AI/ML', 'Sağlık Bilimleri'];
        if (area.includes('Elektrik')) return ['Mühendislik', 'IoT', 'Tarım'];
        if (area.includes('Psikoloji')) return ['Sosyal Bilimler', 'Eğitim', 'İstatistik'];
        if (area.includes('Biyoloji')) return ['Sağlık Bilimleri', 'Genetik', 'Laboratuvar'];
        return ['Mühendislik', 'Lojistik', 'Analiz'];
    }

    return (
        <div className="flex flex-col gap-8 pb-12">
            {/* Header */}
            <div className="flex flex-col gap-2">
                 <h1 className="text-3xl font-black text-gray-900 tracking-tight">Eşleşme Listesi</h1>
                 <p className="text-gray-500 text-lg">Proje alanına göre takım arkadaşı arayan öğrenciler burada listelenir. Profillerini inceleyip iletişime geçebilirsiniz.</p>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-2">
                 <div className="flex-1 flex items-center h-12 bg-gray-50 rounded-lg px-4 hover:bg-gray-100 transition-colors focus-within:ring-2 focus-within:ring-primary/20">
                     <span className="material-symbols-outlined text-gray-400">search</span>
                     <input type="text" placeholder="İsim, yetenek veya ilgi alanı ara..." className="bg-transparent border-none focus:ring-0 text-sm text-gray-900 placeholder:text-gray-400 w-full ml-2" />
                 </div>
                 
                 <div className="hidden md:block w-px bg-gray-200 my-2"></div>
                 
                 <div className="flex gap-2 overflow-x-auto no-scrollbar">
                     <select 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="h-12 bg-gray-50 border-none rounded-lg text-sm font-medium text-gray-700 px-4 focus:ring-2 focus:ring-primary/20 cursor-pointer min-w-[160px]"
                     >
                         <option value="Tümü">Tüm Proje Alanları</option>
                         <option value="Mühendislik">Mühendislik</option>
                         <option value="Sosyal Bilimler">Sosyal Bilimler</option>
                         <option value="Sağlık">Sağlık</option>
                     </select>
                     
                     <select className="h-12 bg-gray-50 border-none rounded-lg text-sm font-medium text-gray-700 px-4 focus:ring-2 focus:ring-primary/20 cursor-pointer min-w-[160px]">
                         <option>Tüm Üniversiteler</option>
                         <option>İstanbul Teknik Üni.</option>
                         <option>Orta Doğu Teknik Üni.</option>
                         <option>Boğaziçi Üni.</option>
                     </select>
                     
                     <button className="h-12 px-8 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-bold transition-colors shadow-sm active:scale-95">
                         Filtrele
                     </button>
                 </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTeams.map((team) => {
                    const isSent = sentRequests.has(team.id);
                    return (
                        <div key={team.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full relative group">
                            <div className="absolute top-4 right-4">
                                <button 
                                    onClick={() => toggleBookmark(team.id)}
                                    className={`text-gray-300 hover:text-primary transition-colors ${bookmarks.has(team.id) ? 'text-primary' : ''}`}
                                >
                                    <span className={`material-symbols-outlined ${bookmarks.has(team.id) ? 'filled' : ''}`}>bookmark</span>
                                </button>
                            </div>

                            {/* Card Header */}
                            <div className="flex items-start gap-4 mb-4 pr-8">
                                <div className={`size-14 rounded-full flex items-center justify-center shrink-0 text-xl font-bold ${getRandomColor(team.id)} shadow-sm`}>
                                    {getInitials(team.name)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 leading-tight text-lg">{team.name}</h3>
                                    <p className="text-sm font-bold text-primary mb-0.5">{team.area}</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">{getUniversity(team.id)}</p>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100 w-full mb-4"></div>

                            {/* Description */}
                            <p className="text-sm text-gray-600 leading-relaxed mb-6 line-clamp-3 flex-1">
                                {team.description}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {getTags(team.area).map((tag, i) => (
                                    <span key={i} className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-md text-xs font-bold border border-gray-100 hover:bg-gray-100 transition-colors cursor-default">{tag}</span>
                                ))}
                                {team.area.includes('Sağlık') && <span className="px-2.5 py-1 bg-red-50 text-red-700 rounded-md text-xs font-bold border border-red-100">Sağlık Bilimleri</span>}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 mt-auto">
                                <button className="flex-1 h-10 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                                    Profili Gör
                                </button>
                                <button 
                                    onClick={() => handleJoinRequest(team.id, team.name)}
                                    disabled={isSent}
                                    className={`flex-1 h-10 rounded-lg text-sm font-bold text-white transition-colors shadow-sm flex items-center justify-center gap-2
                                    ${isSent ? 'bg-green-600 cursor-default' : 'bg-primary hover:bg-primary-dark'}`}
                                >
                                    {isSent ? 'İletildi' : 'İletişime Geç'}
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* "Create Your Own" Card */}
                <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-center gap-4 bg-gray-50/50 hover:bg-white hover:border-gray-300 transition-all group min-h-[340px]">
                    <div className="size-16 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:scale-110 transition-all">
                        <span className="material-symbols-outlined text-3xl">person_add</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Henüz Aradığını Bulamadın mı?</h3>
                        <p className="text-sm text-gray-500 mt-2 max-w-[240px] mx-auto leading-relaxed">Kendi profilini oluşturarak diğer öğrencilerin seni bulmasını sağlayabilirsin.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/create-team')}
                        className="px-6 py-2.5 bg-white border border-gray-200 text-primary font-bold text-sm rounded-lg hover:border-primary hover:bg-primary hover:text-white transition-all shadow-sm mt-2"
                    >
                        İlan Oluştur
                    </button>
                </div>
            </div>
        </div>
    );
};