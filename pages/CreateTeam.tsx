import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastProvider';

export const CreateTeam: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [memberCount, setMemberCount] = useState(2);
    const [selectedArea, setSelectedArea] = useState('Sağlık');
    const [inviteEmails, setInviteEmails] = useState<string[]>(['']);
    const [formData, setFormData] = useState({
        teamName: '',
        projectName: '',
        advisor: '',
        description: ''
    });

    // Update invites array when member count changes
    useEffect(() => {
        const invitesNeeded = Math.max(0, memberCount - 1);
        setInviteEmails(prev => {
            const newEmails = [...prev];
            if (newEmails.length < invitesNeeded) {
                while(newEmails.length < invitesNeeded) newEmails.push('');
            } else if (newEmails.length > invitesNeeded) {
                return newEmails.slice(0, invitesNeeded);
            }
            return newEmails;
        });
    }, [memberCount]);

    const handleEmailChange = (index: number, value: string) => {
        const newEmails = [...inviteEmails];
        newEmails[index] = value;
        setInviteEmails(newEmails);
    };

    const handleCreate = () => {
        if (!formData.teamName || !formData.projectName) {
            showToast('Lütfen ekip adı ve proje adını giriniz.', 'error');
            return;
        }
        showToast(`Ekip "${formData.teamName}" başarıyla oluşturuldu!`, 'success');
        
        if (inviteEmails.some(e => e.length > 0)) {
            setTimeout(() => {
                showToast(`${inviteEmails.filter(e => e).length} kişiye davet gönderildi.`, 'info');
            }, 1000);
        }

        setTimeout(() => {
            navigate('/dashboard');
        }, 1500);
    };

    return (
        <div className="flex flex-col gap-8 max-w-[960px] mx-auto pb-20">
             {/* Header */}
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                        <button onClick={() => navigate(-1)} className="group flex items-center gap-1 hover:text-gray-900 transition-colors">
                            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                            <span>Geri Dön</span>
                        </button>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Proje Yolculuğuna Başla</h1>
                    <p className="text-gray-500 text-lg">TÜBİTAK 2209-A başvurun için ekibini kur, proje alanını belirle ve arkadaşlarını davet et.</p>
                </div>
             </div>

             <div className="space-y-6">
                {/* Step 1: Basic Info */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm group hover:border-primary/20 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm shadow-lg shadow-primary/20">1</div>
                        <h2 className="text-xl font-bold text-gray-900">Temel Bilgiler</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900 ml-1">Ekip Adı</label>
                            <div className="relative group/input">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-primary transition-colors">group</span>
                                <input 
                                    type="text" 
                                    value={formData.teamName}
                                    onChange={(e) => setFormData({...formData, teamName: e.target.value})}
                                    placeholder="Örn: İnovasyon Mimarları" 
                                    className="w-full h-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 pl-11 pr-5 text-gray-900 placeholder:text-gray-400 transition-all" 
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900 ml-1">Proje Adı (Taslak)</label>
                            <div className="relative group/input">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-primary transition-colors">lightbulb</span>
                                <input 
                                    type="text" 
                                    value={formData.projectName}
                                    onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                                    placeholder="Örn: Akıllı Tarım Çözümleri" 
                                    className="w-full h-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 pl-11 pr-5 text-gray-900 placeholder:text-gray-400 transition-all" 
                                />
                            </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-gray-900 ml-1">Danışman Hoca (Opsiyonel)</label>
                            <div className="relative group/input">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-primary transition-colors">school</span>
                                <input 
                                    type="text" 
                                    value={formData.advisor}
                                    onChange={(e) => setFormData({...formData, advisor: e.target.value})}
                                    placeholder="Akademisyen Ara..." 
                                    className="w-full h-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 pl-11 pr-5 text-gray-900 placeholder:text-gray-400 transition-all" 
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-gray-100">
                                    <span className="material-symbols-outlined">search</span>
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-gray-900 ml-1">Kısa Açıklama & Amaç</label>
                            <div className="relative">
                                <textarea 
                                    rows={3} 
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Projenizin temel amacı ve hedefi nedir? Kısaca bahsedin..." 
                                    className="w-full rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 p-5 text-gray-900 placeholder:text-gray-400 resize-none transition-all"
                                ></textarea>
                                <div className="absolute bottom-3 right-3 text-xs font-bold text-gray-400 bg-white/50 px-2 py-1 rounded-md border border-gray-100">{formData.description.length}/300</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 2: Area Selection */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm group hover:border-primary/20 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm shadow-lg shadow-primary/20">2</div>
                        <h2 className="text-xl font-bold text-gray-900">Proje Alanı</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: 'Sağlık', icon: 'cardiology', sub: 'Tıp, Eczacılık' },
                            { name: 'Eğitim', icon: 'school', sub: 'Eğitim Tek.' },
                            { name: 'Mühendislik', icon: 'precision_manufacturing', sub: 'Ar-Ge, İnovasyon' },
                            { name: 'Sosyal', icon: 'psychology', sub: 'Psikoloji, Sosyoloji' },
                            { name: 'Yapay Zeka', icon: 'smart_toy', sub: 'ML, DL, NLP' },
                            { name: 'Tarım', icon: 'agriculture', sub: 'Gıda, Ziraat' },
                            { name: 'Savunma', icon: 'rocket_launch', sub: 'Havacılık, Uzay' },
                            { name: 'Diğer', icon: 'more_horiz', sub: 'Disiplinlerarası' },
                        ].map((item, idx) => {
                            const isSelected = selectedArea === item.name;
                            return (
                                <button 
                                    key={idx} 
                                    onClick={() => setSelectedArea(item.name)}
                                    className={`relative flex flex-col items-start gap-3 p-4 rounded-2xl border-2 transition-all text-left group/btn ${isSelected ? 'border-primary bg-primary/5 shadow-md shadow-primary/5 scale-[1.02]' : 'border-transparent bg-gray-50 hover:bg-white hover:border-gray-200'}`}
                                >
                                    <div className={`size-10 rounded-full flex items-center justify-center shadow-sm transition-colors ${isSelected ? 'bg-primary text-white' : 'bg-white text-gray-900 group-hover/btn:scale-110'}`}>
                                        <span className="material-symbols-outlined">{item.icon}</span>
                                    </div>
                                    <div>
                                        <p className={`font-bold transition-colors ${isSelected ? 'text-primary' : 'text-gray-900'}`}>{item.name}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                                    </div>
                                    {isSelected && <div className="absolute top-4 right-4 text-primary animate-fade-in"><span className="material-symbols-outlined filled">check_circle</span></div>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Step 3: Team Config */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm group hover:border-primary/20 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm shadow-lg shadow-primary/20">3</div>
                        <h2 className="text-xl font-bold text-gray-900">Ekip Yapılandırması</h2>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4 items-start">
                                <div className="bg-white p-2 rounded-full h-fit text-blue-600 shadow-sm shrink-0">
                                    <span className="material-symbols-outlined">info</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">TÜBİTAK Kuralı</h3>
                                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">2209-A projeleri için ekip üye sayısı (yürütücü dahil) en az 1, en fazla 5 lisans öğrencisi ile sınırlandırılmıştır.</p>
                                </div>
                            </div>
                            <div className="flex-1 space-y-3 flex flex-col justify-center">
                                <label className="text-sm font-bold text-gray-900 ml-1">Hedeflenen Üye Sayısı</label>
                                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-full w-fit border border-gray-200">
                                    <button 
                                        onClick={() => setMemberCount(Math.max(1, memberCount - 1))}
                                        className="size-10 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary flex items-center justify-center transition-all disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-600 active:scale-90"
                                        disabled={memberCount <= 1}
                                    >
                                        <span className="material-symbols-outlined">remove</span>
                                    </button>
                                    <div className="w-12 text-center font-black text-xl text-gray-900">{memberCount}</div>
                                    <button 
                                        onClick={() => setMemberCount(Math.min(5, memberCount + 1))}
                                        className="size-10 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary flex items-center justify-center transition-all disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-600 active:scale-90"
                                        disabled={memberCount >= 5}
                                    >
                                        <span className="material-symbols-outlined">add</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Invitation Inputs */}
                        {inviteEmails.length > 0 && (
                            <div className="animate-fade-in bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">mail</span>
                                    Ekip Davetleri ({inviteEmails.length})
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {inviteEmails.map((email, idx) => (
                                        <div key={idx} className="relative group/input">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">person_add</span>
                                            <input 
                                                type="email" 
                                                value={email}
                                                onChange={(e) => handleEmailChange(idx, e.target.value)}
                                                placeholder={`${idx + 1}. Ekip Üyesinin E-posta Adresi`} 
                                                className="w-full h-12 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 pl-11 pr-5 text-sm text-gray-900 transition-all placeholder:text-gray-400"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
             </div>

             <div className="sticky bottom-6 mt-4 z-30 animate-slide-in">
                 <div className="bg-gray-900 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center shadow-xl gap-4 border border-gray-800">
                     <div className="flex items-center gap-3 px-2">
                         <div className={`hidden sm:flex size-10 items-center justify-center rounded-full ${formData.teamName && formData.projectName ? 'bg-green-500 text-white' : 'bg-white/10 text-white/50'} transition-colors`}>
                             <span className="material-symbols-outlined">checklist</span>
                         </div>
                         <div className="text-white">
                             <p className="font-bold text-sm">
                                {formData.teamName && formData.projectName ? 'Bilgiler Tamamlandı' : 'Zorunlu Alanlar Boş'}
                             </p>
                             <p className="text-xs text-gray-400">
                                {formData.teamName && formData.projectName ? 'Ekibinizi oluşturmaya hazırsınız.' : 'Lütfen ekip ve proje adını giriniz.'}
                             </p>
                         </div>
                     </div>
                     <button 
                        onClick={handleCreate}
                        className="w-full sm:w-auto h-12 px-8 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(227,10,23,0.4)] hover:shadow-[0_0_30px_rgba(227,10,23,0.6)] active:scale-95"
                     >
                         Ekibi Oluştur
                         <span className="material-symbols-outlined">arrow_forward</span>
                     </button>
                 </div>
             </div>
        </div>
    );
};