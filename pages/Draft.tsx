import React, { useState } from 'react';
import { generateProjectDraft, improveText, evaluateProposal, generateProjectImage } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastProvider';
import { AIAnalysisResult, Application } from '../types';

interface CalendarItem {
    id: number;
    code: string;
    month: string;
    task: string;
    status: 'Completed' | 'Ongoing' | 'Pending';
}

interface TeamMember {
    id: number;
    initials: string;
    name: string;
    role: string;
    color: string;
}

export const Draft: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    
    // Form State
    const [title, setTitle] = useState('IoT Tabanlı Akıllı Sera Sulama Otomasyonu');
    const [summary, setSummary] = useState('Bu projenin temel amacı, küçük ölçekli sera işletmeleri için maliyet etkin ve enerji verimli bir sulama sistemi geliştirmektir. Mevcut sistemlerin aksine, önerilen yapı toprak nem sensörleri ve yerel hava durumu verilerini birleştirerek su tüketimini %40 oranında azaltmayı hedeflemektedir. Ayrıca sistem, çiftçilere mobil uygulama üzerinden anlık veri takibi imkanı sunacaktır. Proje, sürdürülebilir tarım uygulamalarına teknolojik bir katkı sunmayı amaçlar.');
    const [method, setMethod] = useState('');
    
    // UI State
    const [loadingAI, setLoadingAI] = useState(false);
    const [activeField, setActiveField] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
    const [isEditingMethod, setIsEditingMethod] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [showDownloadOptions, setShowDownloadOptions] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    // Dynamic Widget State
    const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([
        { id: 1, code: 'EKM', month: '15', task: 'Literatür Taraması', status: 'Completed' },
        { id: 2, code: 'KAS', month: '01', task: 'Sistem Tasarımı', status: 'Ongoing' }
    ]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
        { id: 1, initials: 'AY', name: 'Ali Yılmaz', role: 'Proje Yürütücüsü', color: 'bg-blue-50 text-blue-600 ring-blue-100' },
        { id: 2, initials: 'ZK', name: 'Zeynep Kaya', role: 'Araştırmacı', color: 'bg-purple-50 text-purple-600 ring-purple-100' }
    ]);

    // Calendar Handlers
    const addCalendarItem = () => {
        const newTask = prompt("Yeni görev adı giriniz:");
        if (newTask) {
            setCalendarItems([...calendarItems, {
                id: Date.now(),
                code: 'YEN',
                month: '01',
                task: newTask,
                status: 'Pending'
            }]);
            showToast('Takvim güncellendi.', 'success');
        }
    };

    const editCalendarItem = (id: number) => {
        const item = calendarItems.find(i => i.id === id);
        if (!item) return;
        const newTask = prompt("Görevi düzenle:", item.task);
        if (newTask !== null) {
             setCalendarItems(calendarItems.map(i => i.id === id ? { ...i, task: newTask } : i));
        }
    }

    const removeCalendarItem = (id: number) => {
        if(confirm("Bu görevi silmek istediğinize emin misiniz?")) {
            setCalendarItems(calendarItems.filter(i => i.id !== id));
            showToast('Görev silindi.', 'info');
        }
    };

    const toggleTaskStatus = (id: number) => {
        setCalendarItems(calendarItems.map(item => {
            if (item.id === id) {
                const nextStatus = item.status === 'Pending' ? 'Ongoing' : item.status === 'Ongoing' ? 'Completed' : 'Pending';
                return { ...item, status: nextStatus };
            }
            return item;
        }));
    };

    // Team Handlers
    const addTeamMember = () => {
        const name = prompt("Ekip üyesi Ad Soyad:");
        if (name) {
            const role = prompt("Rolü (Örn: Araştırmacı):") || "Araştırmacı";
            const initials = name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
            setTeamMembers([...teamMembers, {
                id: Date.now(),
                initials,
                name,
                role,
                color: 'bg-green-50 text-green-600 ring-green-100'
            }]);
            showToast('Ekip güncellendi.', 'success');
        }
    };

    const editTeamMember = (id: number) => {
        const member = teamMembers.find(m => m.id === id);
        if (!member) return;
        const newName = prompt("İsim düzenle:", member.name);
        const newRole = prompt("Rol düzenle:", member.role);
        
        if (newName && newRole) {
             setTeamMembers(teamMembers.map(m => m.id === id ? { ...m, name: newName, role: newRole } : m));
        }
    }

    const removeTeamMember = (id: number) => {
        if(confirm("Bu kişiyi ekipten çıkarmak istediğinize emin misiniz?")) {
            setTeamMembers(teamMembers.filter(m => m.id !== id));
            showToast('Kişi çıkarıldı.', 'info');
        }
    };

    // AI & Core Logic
    const handleAIFill = async () => {
        setLoadingAI(true);
        try {
            const data = await generateProjectDraft("Akıllı Sera Sulama");
            setTitle(data.title);
            setSummary(data.summary);
            setMethod(data.method);
            showToast('Taslak yapay zeka tarafından oluşturuldu.', 'success');
        } catch (e) {
            showToast("AI servisi şu an kullanılamıyor.", 'error');
        } finally {
            setLoadingAI(false);
        }
    };

    const handleImprove = async (field: 'summary' | 'method') => {
        setLoadingAI(true);
        setActiveField(field);
        try {
            const current = field === 'summary' ? summary : method;
            const context = `Proje Başlığı: ${title}. ${field === 'method' ? `Özet: ${summary}` : ''}`;
            const improved = await improveText(current, context);
            
            if(field === 'summary') setSummary(improved);
            else {
                setMethod(improved);
                setIsEditingMethod(true);
            }
            showToast('Metin yapay zeka ile oluşturuldu/iyileştirildi.', 'success');
        } catch(e) {
            console.error(e);
            showToast("İyileştirme sırasında bir hata oluştu.", 'error');
        } finally {
            setLoadingAI(false);
            setActiveField(null);
        }
    };

    const handleGenerateImage = async () => {
        if (!title) {
            showToast("Lütfen önce bir proje başlığı giriniz.", 'error');
            return;
        }
        setLoadingAI(true);
        setActiveField('image');
        try {
            const imageBase64 = await generateProjectImage(`${title}. ${summary.substring(0, 100)}...`);
            if (imageBase64) {
                setGeneratedImage(imageBase64);
                showToast("Proje görseli başarıyla oluşturuldu.", 'success');
            } else {
                showToast("Görsel oluşturulamadı.", 'error');
            }
        } catch (e) {
             showToast("Görsel servisi şu an meşgul.", 'error');
        } finally {
             setLoadingAI(false);
             setActiveField(null);
        }
    };

    // Real File Download Logic
    const handleDownload = (format: 'Word' | 'PDF' | 'TXT') => {
        setShowDownloadOptions(false);
        
        if (format === 'PDF') {
            // Trigger browser print dialog for PDF
            setShowPreview(true);
            showToast("PDF oluşturuluyor... Lütfen açılan pencerede 'PDF Olarak Kaydet'i seçin.", 'info');
            setTimeout(() => {
                window.print();
            }, 800);
            return;
        }

        // Prepare Content
        const content = `
            PROJE BAŞVURU FORMU (TÜBİTAK 2209-A)
            ------------------------------------------------
            PROJE BAŞLIĞI: ${title}
            
            ÖZET:
            ${summary}
            
            YÖNTEM:
            ${method || "Belirtilmemiş"}
            
            ÇALIŞMA TAKVİMİ:
            ${calendarItems.map(i => `- ${i.task} (${i.status === 'Completed' ? 'Tamamlandı' : i.status === 'Ongoing' ? 'Devam Ediyor' : 'Planlandı'})`).join('\n')}
            
            PROJE EKİBİ:
            ${teamMembers.map(m => `- ${m.name} (${m.role})`).join('\n')}
        `;

        let blob;
        let filename;

        if (format === 'Word') {
            // Create a Blob with HTML content pretending to be a Word doc (works in Word/LibreOffice)
            const htmlContent = `
                <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                <head><meta charset='utf-8'><title>${title}</title></head>
                <body>
                    <h1>${title}</h1>
                    <h3>Proje Özeti</h3><p>${summary}</p>
                    <h3>Yöntem</h3><p>${method}</p>
                    <h3>Takvim</h3><ul>${calendarItems.map(i => `<li>${i.task}</li>`).join('')}</ul>
                    <h3>Ekip</h3><ul>${teamMembers.map(m => `<li>${m.name} - ${m.role}</li>`).join('')}</ul>
                </body></html>
            `;
            blob = new Blob([htmlContent], { type: 'application/msword' });
            filename = 'Proje_Basvuru_Taslagi.doc';
        } else {
            // Standard Text File
            blob = new Blob([content], { type: 'text/plain' });
            filename = 'Proje_Basvuru_Taslagi.txt';
        }

        // Trigger Download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast(`${filename} bilgisayarınıza indirildi.`, 'success');
    };

    const handleSubmit = async () => {
        if (!title || !summary || !method) {
            showToast("Lütfen tüm alanları doldurunuz.", "error");
            return;
        }

        setLoadingAI(true);
        setActiveField('submit');
        try {
            const result = await evaluateProposal(title, summary, method);
            setAnalysisResult(result);
            
            const newApp: Application = {
                id: Date.now().toString(),
                projectTitle: title,
                area: 'Mühendislik',
                teamName: 'İnovasyon Mimarları',
                submissionDate: new Date().toLocaleDateString('tr-TR'),
                status: 'InReview',
                feedback: 'AI Ön Değerlendirme Tamamlandı.',
                refNo: `#2209A-2024-${Math.floor(1000 + Math.random() * 9000)}`,
                score: result.score
            };
            
            const existingApps = JSON.parse(localStorage.getItem('applications') || '[]');
            localStorage.setItem('applications', JSON.stringify([newApp, ...existingApps]));

        } catch (error) {
            showToast("Analiz sırasında bir hata oluştu.", "error");
        } finally {
            setLoadingAI(false);
            setActiveField(null);
        }
    };

    const handleCloseAnalysis = () => {
        setAnalysisResult(null);
        navigate('/applications');
    };

    return (
        <div className="max-w-4xl mx-auto pb-24 space-y-6 relative">
            {/* Header */}
            <div className="flex flex-col gap-4">
                 <button onClick={() => navigate(-1)} className="group flex items-center gap-2 px-3 py-2 rounded-full w-fit text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm transition-all">
                    <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    <span className="font-bold text-sm">Geri</span>
                </button>
                <div className="flex flex-col gap-1">
                     <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                         <span>Başvurular</span>
                         <span className="material-symbols-outlined text-xs">chevron_right</span>
                         <span>Yeni Başvuru</span>
                     </div>
                     <div className="flex flex-wrap items-end justify-between gap-4">
                         <div>
                             <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Proje Başvuru Taslağı</h1>
                             <p className="text-gray-500 mt-1">2024/1 Dönemi • Son Başvuru: 25 Kasım</p>
                         </div>
                         <span className="px-3 py-1 bg-red-100 text-primary rounded-full text-xs font-bold tracking-wide border border-red-200">DÜZENLEME MODU</span>
                     </div>
                </div>
            </div>

            {/* AI Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gray-900 p-8 text-white shadow-xl group border border-gray-800">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 z-0"></div>
                <div className="absolute right-0 top-0 -mt-10 -mr-10 size-64 rounded-full bg-primary blur-[100px] opacity-30 group-hover:opacity-40 transition-opacity"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 text-red-400">
                            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                            <span className="text-xs font-bold uppercase tracking-wider">Yapay Zeka Hazır</span>
                        </div>
                        <h3 className="text-xl font-bold">Veriler Analiz Edildi</h3>
                        <p className="text-gray-300 max-w-xl text-sm leading-relaxed">Ekip bilgileri, proje alanı ve temel fikir sistemde kayıtlı. AI, bu verileri kullanarak saniyeler içinde taslak bir TÜBİTAK 2209-A formu oluşturabilir.</p>
                    </div>
                    <button 
                        onClick={handleAIFill}
                        disabled={loadingAI}
                        className="group flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(227,0,27,0.4)] hover:shadow-[0_0_30px_rgba(227,0,27,0.6)] border border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loadingAI && !activeField ? (
                            <span className="material-symbols-outlined animate-spin">sync</span>
                        ) : (
                            <span className="material-symbols-outlined transition-transform group-hover:rotate-12">magic_button</span>
                        )}
                        <span>{loadingAI && !activeField ? 'Oluşturuluyor...' : 'Yapay Zeka ile Doldur'}</span>
                    </button>
                </div>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-8 rounded-2xl bg-white p-8 shadow-sm border border-gray-200">
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">Proje Adı</label>
                    <div className="relative group">
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-900 font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-lg" 
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setTitle("Akıllı Sulama Sistemi")} className="rounded-lg p-2 text-gray-400 hover:text-primary hover:bg-white transition-colors">
                                <span className="material-symbols-outlined text-[20px]">refresh</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gray-100 w-full"></div>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">Projenin Amacı</label>
                        <button 
                            onClick={() => handleImprove('summary')}
                            disabled={loadingAI}
                            className="flex items-center gap-1.5 rounded-full bg-primary/5 border border-primary/20 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
                        >
                            {loadingAI && activeField === 'summary' ? (
                                <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                            ) : (
                                <span className="material-symbols-outlined text-[16px]">auto_fix</span>
                            )}
                            <span className="hidden sm:inline">AI İyileştir</span>
                        </button>
                    </div>
                    <div className="relative w-full rounded-xl border border-gray-200 bg-gray-50 p-1 transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                        <textarea 
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            rows={6}
                            className="w-full bg-transparent border-none focus:ring-0 p-4 text-gray-800 leading-relaxed resize-none"
                        ></textarea>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">Yöntem</label>
                        <button 
                             onClick={() => handleImprove('method')}
                             disabled={loadingAI}
                             className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-primary-dark transition-colors disabled:opacity-50"
                        >
                             {loadingAI && activeField === 'method' ? (
                                <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                            ) : (
                                <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                            )}
                            <span className="hidden sm:inline">AI ile Üret</span>
                        </button>
                    </div>
                    {method || isEditingMethod ? (
                         <div className="relative w-full rounded-xl border border-gray-200 bg-gray-50 p-1 transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                            <textarea 
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                                rows={6}
                                placeholder="Projenin yöntemini, kullanılacak materyalleri ve izlenecek adımları detaylıca açıklayınız..."
                                className="w-full bg-transparent border-none focus:ring-0 p-4 text-gray-800 leading-relaxed resize-none"
                            ></textarea>
                        </div>
                    ) : (
                        <div className="relative min-h-[120px] w-full rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-6 flex flex-col items-center justify-center text-center gap-4 hover:bg-white hover:border-gray-400 transition-all">
                            <div className="size-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <span className="material-symbols-outlined text-2xl">edit_note</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">Yöntem bölümü henüz boş</p>
                                <p className="text-xs text-gray-500 mt-1">İçeriği kendiniz yazabilir veya yapay zeka ile oluşturabilirsiniz.</p>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setIsEditingMethod(true)}
                                    className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[16px]">edit</span>
                                    Kendim Yazacağım
                                </button>
                                <button 
                                    onClick={() => handleImprove('method')}
                                    disabled={loadingAI}
                                    className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-xs font-bold text-primary hover:bg-primary/20 transition-all flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                                    AI Taslak Oluştur
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Image Generation Section */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                         <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">Proje Görseli (Opsiyonel)</label>
                         {!generatedImage && (
                            <button 
                                onClick={handleGenerateImage}
                                disabled={loadingAI}
                                className="flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
                                {loadingAI && activeField === 'image' ? (
                                    <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                                ) : (
                                    <span className="material-symbols-outlined text-[16px]">image</span>
                                )}
                                <span className="hidden sm:inline">Görsel Oluştur</span>
                            </button>
                         )}
                    </div>
                    {generatedImage ? (
                        <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 group">
                            <img src={generatedImage} alt="Generated Project" className="w-full h-64 object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button onClick={handleGenerateImage} className="px-4 py-2 bg-white rounded-lg text-xs font-bold text-gray-900 hover:bg-gray-100 transition-colors">Yeniden Oluştur</button>
                                <button onClick={() => setGeneratedImage(null)} className="px-4 py-2 bg-red-600 rounded-lg text-xs font-bold text-white hover:bg-red-700 transition-colors">Kaldır</button>
                            </div>
                        </div>
                    ) : (
                        <div className="relative h-32 w-full rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-6 flex flex-col items-center justify-center text-center gap-2 hover:bg-white hover:border-gray-400 transition-all">
                             <div className="flex gap-2 text-gray-400">
                                 <span className="material-symbols-outlined">image</span>
                                 <span className="material-symbols-outlined">auto_awesome</span>
                             </div>
                             <p className="text-xs text-gray-500">Yapay zeka ile projenizi anlatan özgün bir kapak görseli oluşturabilirsiniz.</p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                     {/* Calendar Widget (Dynamic) */}
                     <div className="flex flex-col gap-4">
                         <div className="flex items-center justify-between">
                             <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">Çalışma Takvimi</label>
                             <button onClick={addCalendarItem} className="text-xs font-bold text-primary flex items-center gap-1 hover:text-primary-dark transition-colors cursor-pointer p-1 rounded hover:bg-primary/5"><span className="material-symbols-outlined text-[14px]">add_circle</span> Görev Ekle</button>
                         </div>
                         <div className="rounded-xl border border-gray-200 bg-gray-50 p-1 overflow-hidden">
                             {calendarItems.length === 0 && (
                                 <div className="p-6 text-center text-gray-500 text-sm">Henüz görev eklenmedi.</div>
                             )}
                             {calendarItems.map((item, index) => (
                                 <React.Fragment key={item.id}>
                                     {index > 0 && <div className="h-px bg-gray-200 mx-3 my-1"></div>}
                                     <div className="p-3 hover:bg-white rounded-lg transition-colors group flex items-center gap-4 relative">
                                         <div 
                                            className={`flex flex-col items-center justify-center rounded-lg border p-2 shadow-sm min-w-[56px] cursor-pointer hover:scale-105 transition-transform
                                            ${item.status === 'Completed' ? 'bg-white border-gray-200' : 'bg-primary/10 border-primary/20'}`}
                                            onClick={() => toggleTaskStatus(item.id)}
                                            title="Durumu değiştirmek için tıkla"
                                        >
                                             <span className={`text-[10px] font-bold uppercase tracking-widest ${item.status === 'Completed' ? 'text-gray-400' : 'text-primary'}`}>{item.code}</span>
                                             <span className="text-xl font-black text-gray-900">{item.month}</span>
                                         </div>
                                         <div className="flex-1 cursor-pointer" onClick={() => editCalendarItem(item.id)} title="Düzenlemek için tıkla">
                                             <p className="text-sm font-bold text-gray-900 hover:text-primary transition-colors">{item.task}</p>
                                             <div className="flex items-center gap-2 mt-1">
                                                {item.status === 'Completed' && <><span className="size-2 rounded-full bg-green-500"></span><p className="text-xs text-gray-500">Tamamlandı</p></>}
                                                {item.status === 'Ongoing' && <><span className="size-2 rounded-full bg-primary animate-pulse"></span><p className="text-xs text-primary font-bold">Devam Ediyor</p></>}
                                                {item.status === 'Pending' && <><span className="size-2 rounded-full bg-gray-300"></span><p className="text-xs text-gray-400">Planlandı</p></>}
                                             </div>
                                         </div>
                                         <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                             <button onClick={() => editCalendarItem(item.id)} className="p-2 text-gray-400 hover:text-blue-500 transition-all rounded-full hover:bg-gray-100">
                                                 <span className="material-symbols-outlined text-[18px]">edit</span>
                                             </button>
                                             <button onClick={() => removeCalendarItem(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-all rounded-full hover:bg-gray-100">
                                                 <span className="material-symbols-outlined text-[18px]">delete</span>
                                             </button>
                                         </div>
                                     </div>
                                 </React.Fragment>
                             ))}
                         </div>
                     </div>

                     {/* Team Widget (Dynamic) */}
                     <div className="flex flex-col gap-4">
                         <div className="flex items-center justify-between">
                             <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">Ekip Durumu</label>
                             <button onClick={addTeamMember} className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 transition-colors cursor-pointer p-1 rounded hover:bg-gray-100"><span className="material-symbols-outlined text-[14px]">person_add</span> Üye Ekle</button>
                         </div>
                         <div className="flex flex-col gap-3">
                             {teamMembers.map(member => (
                                 <div key={member.id} className="flex items-center justify-between rounded-xl bg-white border border-gray-200 p-3 shadow-sm hover:border-primary/50 transition-colors group">
                                     <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => editTeamMember(member.id)} title="Düzenlemek için tıkla">
                                         <div className={`size-10 rounded-full flex items-center justify-center font-black text-xs ring-2 ${member.color}`}>
                                             {member.initials}
                                         </div>
                                         <div className="flex flex-col">
                                             <span className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{member.name}</span>
                                             <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{member.role}</span>
                                         </div>
                                     </div>
                                     
                                     <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => editTeamMember(member.id)} className="p-2 text-gray-300 hover:text-blue-500 transition-all rounded-full hover:bg-gray-50">
                                             <span className="material-symbols-outlined text-[20px]">edit</span>
                                         </button>
                                         <button onClick={() => removeTeamMember(member.id)} className="p-2 text-gray-300 hover:text-red-500 transition-all rounded-full hover:bg-gray-50">
                                             <span className="material-symbols-outlined text-[20px]">delete</span>
                                         </button>
                                     </div>
                                     <span className="material-symbols-outlined text-green-500 text-[20px] group-hover:hidden">check_circle</span>
                                 </div>
                             ))}
                             {teamMembers.length === 0 && (
                                <div className="text-center p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-sm text-gray-500">Ekip üyesi bulunmuyor.</div>
                             )}
                         </div>
                     </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="sticky bottom-6 flex w-full items-center justify-between bg-white/90 backdrop-blur-xl px-6 py-4 shadow-lg border border-gray-100 rounded-2xl z-40 no-print">
                <div className="hidden md:flex items-center gap-3">
                    <span className="flex size-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                    <span className="text-xs font-bold text-gray-500">Taslak kaydedildi (14:32)</span>
                </div>
                <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-3">
                    <div className="relative">
                        <button 
                            onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                            className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">download</span>
                            <span className="hidden sm:inline">Taslağı İndir</span>
                            <span className="material-symbols-outlined text-[18px] text-gray-400">arrow_drop_down</span>
                        </button>
                        
                        {showDownloadOptions && (
                            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in z-50">
                                <button onClick={() => handleDownload('Word')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 text-left transition-colors">
                                    <span className="material-symbols-outlined text-blue-600">description</span>
                                    <span className="text-sm font-bold text-gray-700">Word İndir</span>
                                </button>
                                <div className="h-px bg-gray-100 mx-4"></div>
                                <button onClick={() => handleDownload('PDF')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-left transition-colors">
                                    <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                                    <span className="text-sm font-bold text-gray-700">PDF İndir</span>
                                </button>
                                <div className="h-px bg-gray-100 mx-4"></div>
                                <button onClick={() => handleDownload('TXT')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors">
                                    <span className="material-symbols-outlined text-gray-500">text_snippet</span>
                                    <span className="text-sm font-bold text-gray-700">Metin İndir (TXT)</span>
                                </button>
                            </div>
                        )}
                        {showDownloadOptions && <div className="fixed inset-0 z-40" onClick={() => setShowDownloadOptions(false)}></div>}
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => setShowPreview(true)} className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2 active:scale-95">
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                            <span className="hidden sm:inline">Önizleme</span>
                        </button>
                        <button 
                            onClick={handleSubmit} 
                            disabled={loadingAI}
                            className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:bg-primary-dark transition-all flex items-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loadingAI && activeField === 'submit' ? (
                                <>
                                    <span>AI İnceliyor...</span>
                                    <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                                </>
                            ) : (
                                <>
                                    <span>Onaya Sun</span>
                                    <span className="material-symbols-outlined text-[18px]">send</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Document Preview Modal (Word-like Sidebar) */}
            {showPreview && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm animate-fade-in print:bg-white print:static print:block">
                    <div className="w-full max-w-2xl bg-gray-100 h-full shadow-2xl animate-slide-in flex flex-col print:w-full print:max-w-none print:shadow-none print:h-auto print:bg-white">
                        <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between no-print">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-600">description</span>
                                Belge Önizleme
                            </h2>
                            <div className="flex gap-2">
                                <button onClick={() => handleDownload('Word')} className="text-gray-500 hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <span className="material-symbols-outlined">download</span>
                                </button>
                                <button onClick={() => {
                                    window.print();
                                }} className="text-gray-500 hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-colors" title="Yazdır / PDF Kaydet">
                                    <span className="material-symbols-outlined">print</span>
                                </button>
                                <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 flex justify-center print:p-0 print:overflow-visible">
                            <div id="printable-area" className="bg-white w-[595px] min-h-[842px] shadow-lg p-[50px] text-gray-900 text-sm leading-relaxed font-serif print:shadow-none print:w-full print:p-0">
                                <div className="text-center border-b-2 border-black pb-4 mb-6">
                                    <h1 className="text-xl font-bold uppercase mb-2">TÜBİTAK 2209-A PROJE BAŞVURU FORMU</h1>
                                </div>
                                
                                <h2 className="text-base font-bold uppercase mb-2 border-b border-gray-300 pb-1">1. Proje Başlığı</h2>
                                <p className="mb-6">{title}</p>
                                
                                {generatedImage && (
                                    <div className="mb-6 flex justify-center">
                                        <img src={generatedImage} alt="Project Cover" className="max-h-48 object-contain border border-gray-200" />
                                    </div>
                                )}

                                <h2 className="text-base font-bold uppercase mb-2 border-b border-gray-300 pb-1">2. Proje Özeti</h2>
                                <p className="mb-6 text-justify">{summary}</p>
                                
                                <h2 className="text-base font-bold uppercase mb-2 border-b border-gray-300 pb-1">3. Yöntem</h2>
                                <p className="mb-6 text-justify whitespace-pre-line">{method || "Henüz girilmemiş."}</p>
                                
                                <h2 className="text-base font-bold uppercase mb-2 border-b border-gray-300 pb-1">4. Çalışma Takvimi</h2>
                                <table className="w-full border-collapse border border-gray-300 mb-6 text-xs">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 p-2 text-left">Dönem</th>
                                            <th className="border border-gray-300 p-2 text-left">İş Paketi</th>
                                            <th className="border border-gray-300 p-2 text-left">Durum</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {calendarItems.map(item => (
                                            <tr key={item.id}>
                                                <td className="border border-gray-300 p-2">{item.month}. Ay</td>
                                                <td className="border border-gray-300 p-2">{item.task}</td>
                                                <td className="border border-gray-300 p-2">{item.status === 'Completed' ? 'Tamamlandı' : 'Planlandı'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <h2 className="text-base font-bold uppercase mb-2 border-b border-gray-300 pb-1">5. Proje Ekibi</h2>
                                <ul className="list-disc pl-5 mb-6">
                                    {teamMembers.map(member => (
                                        <li key={member.id}>{member.name} - <span className="italic text-gray-600">{member.role}</span></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Analysis Result Modal */}
            {analysisResult && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={handleCloseAnalysis}></div>
                    <div className="relative bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-slide-in">
                        <div className="bg-primary/5 p-6 border-b border-primary/10 flex items-center justify-between">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">psychology</span>
                                AI Ön Değerlendirme Raporu
                            </h2>
                            <button onClick={handleCloseAnalysis} className="size-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <div className="p-8">
                            <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                                <div className="relative size-40 shrink-0">
                                    <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                        <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                        <path className="text-primary transition-all duration-1000 ease-out" strokeDasharray={`${analysisResult.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-primary">
                                        <span className="text-4xl font-black">%{analysisResult.score}</span>
                                        <span className="text-xs font-bold uppercase tracking-wider">Başarı Şansı</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold text-gray-900 text-lg">Genel Analiz</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">{analysisResult.analysis}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                                    <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined">thumb_up</span>
                                        Güçlü Yönler
                                    </h4>
                                    <ul className="space-y-2">
                                        {analysisResult.strengths.map((s, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                                                <span className="mt-1 size-1.5 rounded-full bg-green-500 shrink-0"></span>
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-red-50 rounded-xl p-5 border border-red-100">
                                    <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined">warning</span>
                                        Geliştirilmesi Gerekenler
                                    </h4>
                                    <ul className="space-y-2">
                                        {analysisResult.weaknesses.map((w, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                                                <span className="mt-1 size-1.5 rounded-full bg-red-500 shrink-0"></span>
                                                {w}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
                            <button 
                                onClick={handleCloseAnalysis} 
                                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2"
                            >
                                Anlaşıldı, Başvurularıma Git
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};