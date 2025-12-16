import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastProvider';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Clear auth and current user on mount to ensure fresh login
  useEffect(() => {
      localStorage.removeItem('auth');
      localStorage.removeItem('currentUser');
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Default Demo credentials
    const isDemoUser = email === 'ogrenci@universite.edu.tr' && password === '123456';
    
    // Check against registered users in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const validUser = existingUsers.find((u: any) => u.email === email && u.password === password);

    if (isDemoUser || validUser) {
        localStorage.setItem('auth', 'true');
        
        if (validUser) {
            // Store real user info
            localStorage.setItem('currentUser', JSON.stringify(validUser));
        } else {
            // Store demo user info so dashboard works dynamically
            localStorage.setItem('currentUser', JSON.stringify({
                name: 'Ahmet Yılmaz',
                email: 'ogrenci@universite.edu.tr',
                university: 'İstanbul Teknik Üniversitesi',
                department: 'Bilgisayar Mühendisliği',
                role: 'Öğrenci'
            }));
        }

        showToast('Giriş başarılı!', 'success');
        navigate('/dashboard');
    } else {
        showToast('E-posta veya şifre hatalı.', 'error');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white overflow-hidden font-display">
      {/* Left Side - Form */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-center p-8 lg:p-16 relative z-10">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-10 flex items-center gap-3">
            <div className="size-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-2xl">science</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary leading-none">TÜBİTAK</h1>
              <p className="text-sm font-medium text-gray-500">2209-A Proje Yönetimi</p>
            </div>
          </div>

          <div className="mb-8 flex gap-8 border-b border-gray-200">
            <button className="pb-4 text-base font-bold text-gray-900 border-b-2 border-primary transition-all">Giriş Yap</button>
            <button onClick={() => navigate('/register')} className="pb-4 text-base font-bold text-gray-400 hover:text-gray-900 transition-all border-b-2 border-transparent hover:border-gray-300">Kayıt Ol</button>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Öğrenci Girişi</h2>
              <p className="text-gray-500">Sisteme erişmek için bilgilerinizi giriniz.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">E-posta Adresi</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">mail</span>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ogrenci@universite.edu.tr" 
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-gray-50 focus:bg-white" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Şifre</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">lock</span>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="******" 
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-gray-50 focus:bg-white" 
                  />
                </div>
                <div className="flex justify-end">
                    <button type="button" className="text-xs font-bold text-gray-500 hover:text-primary">Şifreni mi unuttun?</button>
                </div>
              </div>

              <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 group">
                <span>Giriş Yap</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">login</span>
              </button>
            </form>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">veya</span>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-4">
               <div className="size-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                   <span className="material-symbols-outlined text-primary">groups</span>
               </div>
               <div className="flex-1">
                   <p className="font-bold text-sm text-gray-900">Henüz ekibin yok mu?</p>
                   <p className="text-xs text-gray-500">Ekip oluştur veya ekibe katıl.</p>
               </div>
               <button onClick={() => navigate('/join-team')} className="text-xs font-bold text-primary bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                   Ekip Bul
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] bg-gray-900 relative items-center justify-center p-12 overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 to-black z-0"></div>
         {/* Decorative elements */}
         <div className="absolute top-[-10%] right-[-10%] size-[600px] bg-primary/20 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] left-[-10%] size-[600px] bg-blue-900/20 rounded-full blur-[120px]"></div>
         
         <div className="relative z-10 max-w-2xl text-center">
            <div className="relative mb-12 group">
                 <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                 <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-800 bg-gray-900 aspect-video">
                    <img src="https://picsum.photos/1200/675" alt="Dashboard Preview" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent">
                        <div className="flex justify-between items-end text-white">
                            <div className="text-left">
                                <p className="font-bold text-lg">Araştırma & Geliştirme</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                                    <span className="text-xs text-gray-300 font-medium">2024 Başvuruları Açık</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-black">2209-A</p>
                                <p className="text-xs text-gray-400 font-bold tracking-widest">TÜBİTAK</p>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Bilimsel Yolculuğunuza <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-400">Burada Başlayın</span>
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed max-w-lg mx-auto">
                TÜBİTAK 2209-A Proje Yönetim Sistemi ile fikirlerinizi hayata geçirin, akademik geleceğinizi şekillendirin.
            </p>
         </div>
      </div>
    </div>
  );
};