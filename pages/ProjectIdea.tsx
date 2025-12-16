import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastProvider';

const MOCK_IDEAS = [
    {
        id: 1,
        title: "Engelsiz Kampüs Navigasyonu",
        summary: "Üniversite kampüsündeki engelli rampaları, asansörler ve erişilebilir yolları gösteren, sesli komut desteği sunan mobil navigasyon uygulaması. Proje, görüntü işleme ile engelleri tespit etmeyi de hedefler.",
        keywords: ["Erişilebilirlik", "Mobil Uygulama", "Görüntü İşleme"],
        area: "Sosyal Sorumluluk",
        icon: "accessible"
    },
    {
        id: 2,
        title: "Akıllı Atık Ayrıştırma Kutusu",
        summary: "Nesnelerin İnterneti (IoT) ve makine öğrenmesi kullanarak atılan çöpün türünü (plastik, metal, kağıt) otomatik tespit eden ve ilgili hazneye yönlendiren akıllı atık kutusu.",
        keywords: ["IoT", "Geri Dönüşüm", "Makine Öğrenmesi"],
        area: "Çevre & Mühendislik",
        icon: "recycling"
    },
    {
        id: 3,
        title: "Yerel Tohum Takas Platformu",
        summary: "Yerel tohumların korunması ve yaygınlaştırılması amacıyla çiftçileri ve hobi bahçecilerini bir araya getiren blokzincir tabanlı güvenilir takas ve takip platformu.",
        keywords: ["Sürdürülebilir Tarım", "Blokzincir", "Web Platformu"],
        area: "Tarım & Yazılım",
        icon: "grass"
    },
    {
        id: 4,
        title: "Sanal Gerçeklik ile Tarih Eğitimi",
        summary: "Lise öğrencilerine tarihi mekanları ve olayları deneyimleyerek öğretmeyi amaçlayan, müfredata uygun interaktif sanal gerçeklik (VR) eğitim modülleri.",
        keywords: ["Sanal Gerçeklik", "Eğitim Teknolojileri", "Tarih"],
        area: "Eğitim",
        icon: "view_in_ar"
    }
];

export const ProjectIdea: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'manual' | 'selection'>('manual');
    
    // Form State
    const [projectTitle, setProjectTitle] = useState('');
    const [projectSummary, setProjectSummary] = useState('');
    const [projectKeywords, setProjectKeywords] = useState<string[]>([]);
    const [keywordInput, setKeywordInput] = useState('');

    const handleSelectIdea = (idea: typeof MOCK_IDEAS[0]) => {
        setProjectTitle(idea.title);
        setProjectSummary(idea.summary);
        setProjectKeywords(idea.keywords);
        setActiveTab('manual');
        showToast(`"${idea.title}" fikri seçildi ve forma aktarıldı.`, 'success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const addKeyword = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && keywordInput.trim()) {
            e.preventDefault();
            if (!projectKeywords.includes(keywordInput.trim())) {
                setProjectKeywords([...projectKeywords, keywordInput.trim()]);
            }
            setKeywordInput('');
        }
    };

    const removeKeyword = (keyword: string) => {
        setProjectKeywords(projectKeywords.filter(k => k !== keyword));
    };

    const handleSaveDraft = () => {
        if(!projectTitle) {
            showToast('Lütfen proje başlığını giriniz.', 'error');
            return;
        }
        showToast('Taslak kaydedildi.', 'success');
    };

    return (
        <div className="max-w-[960px] mx-auto flex flex-col gap-8 pb-12">
             <div className="flex flex-col gap-2">
                 <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                     <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        <span>Başvuru Adımları</span>
                     </button>
                 </div>
                 <h1 className="text-4xl font-black text-gray-900 tracking-tight">Proje Fikri Belirleme</h1>
                 <p className="text-gray-500 text-lg">Proje yolculuğunuzun en önemli adımı. Fikrinizi oluşturun veya seçin.</p>
             </div>

             {/* Team Info */}
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6 items-center">
                 <div className="bg-gray-900 rounded-xl size-20 shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-3xl">token</span>
                 </div>
                 <div className="flex flex-col flex-1 gap-1 w-full text-center md:text-left">
                     <div className="flex items-center justify-center md:justify-between flex-wrap gap-2">
                         <h3 className="text-xl font-bold text-gray-900">Takım: İnovasyon Mimarları</h3>
                         <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Aktif Başvuru</span>
                     </div>
                     <div className="flex items-center justify-center md:justify-start gap-4 text-gray-500 text-sm">
                         <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">category</span> Bilgi Teknolojileri</div>
                         <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">groups</span> 3 Üye</div>
                         <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">fingerprint</span> ID: #48291</div>
                     </div>
                 </div>
             </div>

             {/* Tabs */}
             <div className="flex flex-col gap-6">
                 <div className="border-b border-gray-200">
                     <div className="flex gap-8 overflow-x-auto">
                         <button 
                            onClick={() => setActiveTab('manual')}
                            className={`pb-4 px-2 font-bold text-base tracking-wide border-b-[3px] transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'manual' ? 'text-gray-900 border-primary' : 'text-gray-500 hover:text-gray-900 border-transparent'}`}
                         >
                             <span className={`material-symbols-outlined ${activeTab === 'manual' ? 'filled text-primary' : ''}`}>edit_note</span>
                             Kendi Fikrimi Gireceğim
                         </button>
                         <button 
                            onClick={() => setActiveTab('selection')}
                            className={`pb-4 px-2 font-bold text-base tracking-wide border-b-[3px] transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'selection' ? 'text-gray-900 border-primary' : 'text-gray-500 hover:text-gray-900 border-transparent'}`}
                         >
                             <span className={`material-symbols-outlined ${activeTab === 'selection' ? 'filled text-primary' : ''}`}>lightbulb</span>
                             Hazır Fikirlerden Seçeceğim
                         </button>
                     </div>
                 </div>

                 {/* Form */}
                 {activeTab === 'manual' ? (
                     <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 flex flex-col gap-6 animate-fade-in">
                         <div className="flex flex-col gap-2">
                             <label className="text-gray-900 font-bold text-base">Proje Başlığı</label>
                             <input 
                                type="text" 
                                value={projectTitle}
                                onChange={(e) => setProjectTitle(e.target.value)}
                                placeholder="Örn: Akıllı Tarım için IoT Tabanlı Sulama Sistemi" 
                                className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition placeholder:text-gray-400" 
                             />
                         </div>
                         <div className="flex flex-col gap-2">
                             <div className="flex justify-between items-baseline">
                                 <label className="text-gray-900 font-bold text-base">Proje Özeti</label>
                                 <span className="text-xs text-gray-500">Maksimum 200 kelime</span>
                             </div>
                             <textarea 
                                value={projectSummary}
                                onChange={(e) => setProjectSummary(e.target.value)}
                                rows={6} 
                                placeholder="Projenizin amacını, yöntemini ve beklenen sonuçlarını kısaca açıklayınız..." 
                                className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition placeholder:text-gray-400 resize-none"
                             ></textarea>
                         </div>
                         <div className="flex flex-col gap-2">
                             <label className="text-gray-900 font-bold text-base">Anahtar Kelimeler</label>
                             <div className="flex items-center gap-2 flex-wrap bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary">
                                 {projectKeywords.map((keyword, idx) => (
                                     <span key={idx} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 border border-primary/20 animate-fade-in">
                                         {keyword}
                                         <button onClick={() => removeKeyword(keyword)} className="hover:bg-primary/10 rounded-full p-0.5"><span className="material-symbols-outlined text-[14px]">close</span></button>
                                     </span>
                                 ))}
                                 <input 
                                    type="text" 
                                    value={keywordInput}
                                    onChange={(e) => setKeywordInput(e.target.value)}
                                    onKeyDown={addKeyword}
                                    placeholder={projectKeywords.length === 0 ? "Kelime ekle (Enter)..." : "..."} 
                                    className="bg-transparent border-none outline-none text-sm text-gray-900 flex-1 min-w-[100px] p-0 focus:ring-0" 
                                 />
                             </div>
                             <p className="text-xs text-gray-500">Enter tuşuna basarak kelimeleri ekleyebilirsiniz.</p>
                         </div>
                     </div>
                 ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        {MOCK_IDEAS.map((idea) => (
                            <div key={idea.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="size-12 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-2xl">{idea.icon}</span>
                                    </div>
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{idea.area}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{idea.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">{idea.summary}</p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {idea.keywords.map((k, i) => (
                                        <span key={i} className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">{k}</span>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => handleSelectIdea(idea)}
                                    className="w-full bg-white border border-gray-300 text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2 active:scale-95"
                                >
                                    Fikri Seç ve Düzenle
                                    <span className="material-symbols-outlined text-sm">edit_square</span>
                                </button>
                            </div>
                        ))}
                    </div>
                 )}
             </div>

             {/* Footer Actions */}
             <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-4 border-t border-gray-200 mt-4">
                 <button onClick={handleSaveDraft} className="px-8 py-3.5 rounded-full border border-gray-300 text-gray-900 font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 active:scale-95">
                     <span className="material-symbols-outlined text-lg">save</span>
                     Taslak Olarak Kaydet
                 </button>
                 <button onClick={() => navigate('/draft')} className="px-8 py-3.5 rounded-full bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 active:scale-95">
                     Başvuru Formuna Devam Et
                     <span className="material-symbols-outlined text-lg">arrow_forward</span>
                 </button>
             </div>
        </div>
    );
};