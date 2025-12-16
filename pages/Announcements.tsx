import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Announcements: React.FC = () => {
    const navigate = useNavigate();

    const ANNOUNCEMENTS = [
        {
            id: 1,
            title: "2209-A Başvuruları Uzatıldı!",
            date: "10 Kasım 2024",
            type: "Önemli",
            content: "Yoğun talep üzerine TÜBİTAK 2209-A Üniversite Öğrencileri Araştırma Projeleri Destekleme Programı başvuruları 25 Kasım 2024 saat 17:30'a kadar uzatılmıştır. Başvurularınızı tamamlamak için ek süre tanınmıştır."
        },
        {
            id: 2,
            title: "Proje Yazım Eğitimi Semineri",
            date: "05 Kasım 2024",
            type: "Etkinlik",
            content: "Üniversitemiz Teknoloji Transfer Ofisi tarafından 15 Kasım'da online proje yazım eğitimi verilecektir. Eğitime katılım zorunlu değildir ancak proje başarısını artırmak için tavsiye edilir."
        },
        {
            id: 3,
            title: "2023/2 Dönemi Sonuçları Açıklandı",
            date: "28 Ekim 2024",
            type: "Sonuç",
            content: "Geçen döneme ait proje başvuru sonuçları açıklanmıştır. Başvuru sahipleri BİDEB izleme sistemi üzerinden detaylı puanlarını görüntüleyebilirler."
        }
    ];

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="group flex items-center gap-2 px-3 py-2 rounded-full text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm transition-all">
                    <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    <span className="font-bold text-sm">Geri</span>
                </button>
                <h1 className="text-3xl font-black text-gray-900">Duyurular</h1>
            </div>

            <div className="space-y-6">
                {ANNOUNCEMENTS.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-primary/20 group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{item.title}</h2>
                            <div className="flex items-center gap-3 shrink-0">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                    ${item.type === 'Önemli' ? 'bg-red-100 text-red-700' : 
                                      item.type === 'Etkinlik' ? 'bg-blue-100 text-blue-700' : 
                                      'bg-gray-100 text-gray-700'}`}>
                                    {item.type}
                                </span>
                                <span className="text-sm text-gray-500 font-medium">{item.date}</span>
                            </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{item.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};