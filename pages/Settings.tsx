import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastProvider';

export const Settings: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [emailNotif, setEmailNotif] = useState(true);
    const [pushNotif, setPushNotif] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const handleLogout = () => {
        showToast('Çıkış yapılıyor...', 'info');
        localStorage.removeItem('auth');
        setTimeout(() => {
            navigate('/');
        }, 1000);
    };

    const handlePasswordReset = () => {
        showToast('E-posta adresinize şifre sıfırlama bağlantısı gönderildi.', 'success');
    };

    const handleDeleteAccount = () => {
        if(confirm("DİKKAT! Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
            showToast('Hesap silme talebi alındı. Verileriniz temizleniyor...', 'info');
            setTimeout(() => {
                localStorage.removeItem('auth');
                navigate('/');
                showToast('Hesabınız başarıyla silindi.', 'success');
            }, 2000);
        }
    };

    const handleToggle = (setting: string, val: boolean) => {
        showToast(`${setting} ${val ? 'aktif edildi' : 'devre dışı bırakıldı'}`, 'info');
    };

    const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (val: boolean) => void, label: string }) => (
        <button 
            onClick={() => {
                const newVal = !checked;
                onChange(newVal);
                handleToggle(label, newVal);
            }}
            className={`w-12 h-7 rounded-full transition-colors relative ${checked ? 'bg-primary' : 'bg-gray-200'}`}
        >
            <span className={`absolute top-1 left-1 size-5 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}></span>
        </button>
    );

    return (
        <div className="max-w-3xl mx-auto pb-12">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="group flex items-center gap-2 px-3 py-2 rounded-full text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm transition-all">
                    <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    <span className="font-bold text-sm">Geri</span>
                </button>
                <h1 className="text-2xl font-black text-gray-900">Ayarlar</h1>
            </div>

            <div className="space-y-6">
                {/* Account Settings */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400">manage_accounts</span>
                            Hesap Ayarları
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                        <button onClick={handlePasswordReset} className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left">
                            <div>
                                <p className="font-medium text-gray-900">Şifre Değiştir</p>
                                <p className="text-sm text-gray-500">Son değişiklik: 3 ay önce</p>
                            </div>
                            <span className="material-symbols-outlined text-gray-300">chevron_right</span>
                        </button>
                        <button onClick={() => showToast("2FA zaten aktif durumda.", "info")} className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left">
                            <div>
                                <p className="font-medium text-gray-900">İki Faktörlü Doğrulama</p>
                                <p className="text-sm text-green-600 font-bold">Aktif</p>
                            </div>
                            <span className="material-symbols-outlined text-gray-300">chevron_right</span>
                        </button>
                        <button onClick={() => showToast("Bağlı hesaplar yönetimi şu an devre dışı.", "info")} className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left">
                             <div>
                                <p className="font-medium text-gray-900">Bağlı Hesaplar</p>
                                <p className="text-sm text-gray-500">Google, LinkedIn</p>
                            </div>
                            <span className="material-symbols-outlined text-gray-300">chevron_right</span>
                        </button>
                    </div>
                </div>

                {/* Preferences */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400">tune</span>
                            Tercihler
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                        <div className="flex items-center justify-between p-6">
                            <div>
                                <p className="font-medium text-gray-900">E-posta Bildirimleri</p>
                                <p className="text-sm text-gray-500">Önemli güncellemeleri e-posta ile al</p>
                            </div>
                            <Toggle checked={emailNotif} onChange={setEmailNotif} label="E-posta bildirimleri" />
                        </div>
                        <div className="flex items-center justify-between p-6">
                            <div>
                                <p className="font-medium text-gray-900">Anlık Bildirimler</p>
                                <p className="text-sm text-gray-500">Tarayıcı bildirimlerini etkinleştir</p>
                            </div>
                            <Toggle checked={pushNotif} onChange={setPushNotif} label="Anlık bildirimler" />
                        </div>
                        <div className="flex items-center justify-between p-6">
                            <div>
                                <p className="font-medium text-gray-900">Karanlık Mod (Beta)</p>
                                <p className="text-sm text-gray-500">Koyu tema görünümüne geç</p>
                            </div>
                            <Toggle checked={darkMode} onChange={setDarkMode} label="Karanlık mod" />
                        </div>
                    </div>
                </div>

                {/* Logout */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-6 hover:bg-gray-50 transition-colors text-left group"
                    >
                         <div className="size-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                            <span className="material-symbols-outlined">logout</span>
                         </div>
                         <div>
                             <p className="font-bold text-gray-900">Çıkış Yap</p>
                             <p className="text-sm text-gray-500">Oturumunuzu güvenli bir şekilde sonlandırın.</p>
                         </div>
                    </button>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-2xl border border-red-100 overflow-hidden shadow-sm">
                    <button 
                        onClick={handleDeleteAccount}
                        className="w-full flex items-center gap-3 p-6 hover:bg-red-50 transition-colors text-left group"
                    >
                         <div className="size-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                            <span className="material-symbols-outlined">delete_forever</span>
                         </div>
                         <div>
                             <p className="font-bold text-red-700">Hesabı Sil</p>
                             <p className="text-sm text-red-400">Bu işlem geri alınamaz ve tüm verilerinizi siler.</p>
                         </div>
                    </button>
                </div>
            </div>
        </div>
    );
};