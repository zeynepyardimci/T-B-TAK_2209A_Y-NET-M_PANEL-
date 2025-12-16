import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastProvider';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      university: '',
      department: '',
      password: '',
      confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
        showToast('Şifreler eşleşmiyor.', 'error');
        return;
    }

    if (!formData.name || !formData.email || !formData.password) {
        showToast('Lütfen zorunlu alanları doldurunuz.', 'error');
        return;
    }

    // Get existing users
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if email already exists
    if (existingUsers.some((u: any) => u.email === formData.email)) {
        showToast('Bu e-posta adresi ile zaten bir kayıt mevcut.', 'error');
        return;
    }

    // Add new user
    const newUser = {
        name: formData.name,
        email: formData.email,
        university: formData.university,
        department: formData.department,
        password: formData.password
    };

    localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));

    showToast('Hesap başarıyla oluşturuldu! Giriş yapabilirsiniz.', 'success');
    
    // Redirect to login instead of dashboard to force login with new credentials
    setTimeout(() => {
        navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white overflow-hidden font-display">
      {/* Left Side - Form */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-center p-8 lg:p-12 relative z-10 overflow-y-auto h-screen">
        <div className="max-w-md mx-auto w-full py-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="size-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-xl">science</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary leading-none">TÜBİTAK</h1>
              <p className="text-xs font-medium text-gray-500">2209-A Proje Yönetimi</p>
            </div>
          </div>

          <div className="mb-8 flex gap-8 border-b border-gray-200">
            <button onClick={() => navigate('/')} className="pb-4 text-base font-bold text-gray-400 hover:text-gray-900 transition-all border-b-2 border-transparent hover:border-gray-300">Giriş Yap</button>
            <button className="pb-4 text-base font-bold text-gray-900 border-b-2 border-primary transition-all">Kayıt Ol</button>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Aramıza Katıl</h2>
              <p className="text-gray-500 text-sm">Proje yolculuğuna başlamak için hesabını oluştur.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Ad Soyad</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">person</span>
                  <input 
                    name="name"
                    type="text" 
                    placeholder="Adınız Soyadınız"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-gray-50 focus:bg-white" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">E-posta Adresi</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">mail</span>
                  <input 
                    name="email"
                    type="email" 
                    placeholder="ogrenci@universite.edu.tr" 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-gray-50 focus:bg-white" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Üniversite</label>
                    <div className="relative group">
                       <select 
                            name="university"
                            value={formData.university}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-gray-50 focus:bg-white text-sm appearance-none"
                        >
                            <option value="">Seçiniz...</option>
                            <option value="SAMU">SAMÜ</option>
                            <option value="OMU">OMÜ</option>
                            <option value="KTU">KTÜ</option>
                            <option value="ITU">İTÜ</option>
                            <option value="ODTU">ODTÜ</option>
                            <option value="YTU">YTÜ</option>
                            <option value="Other">Diğer</option>
                       </select>
                       <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-lg">expand_more</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Bölüm</label>
                    <input 
                        name="department"
                        type="text" 
                        placeholder="Örn: Bilgisayar Müh." 
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-gray-50 focus:bg-white text-sm" 
                    />
                  </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Şifre Oluştur</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">lock</span>
                  <input 
                    name="password"
                    type="password" 
                    placeholder="En az 6 karakter"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-gray-50 focus:bg-white" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Şifre Tekrar</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">lock_reset</span>
                  <input 
                    name="confirmPassword"
                    type="password" 
                    placeholder="Şifrenizi tekrar giriniz"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-gray-50 focus:bg-white" 
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2">
                  <input type="checkbox" className="mt-1 rounded text-primary focus:ring-primary border-gray-300" />
                  <p className="text-xs text-gray-500">
                    <a href="#" className="text-primary font-bold hover:underline">Kullanım Koşullarını</a> ve <a href="#" className="text-primary font-bold hover:underline">Gizlilik Politikasını</a> okudum, onaylıyorum.
                  </p>
              </div>

              <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl shadow-lg shadow-gray-400/25 transition-all flex items-center justify-center gap-2 group mt-2">
                <span>Hesap Oluştur</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] bg-primary relative items-center justify-center p-12 overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-tl from-primary-dark to-primary z-0"></div>
         {/* Decorative elements */}
         <div className="absolute top-[-10%] left-[-10%] size-[500px] bg-white/10 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] size-[500px] bg-black/10 rounded-full blur-[100px]"></div>
         
         <div className="relative z-10 max-w-2xl text-center">
            <div className="relative mb-12 group">
                 <div className="absolute -inset-1 bg-white/30 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                 <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-sm aspect-video p-8 flex items-center justify-center">
                    {/* Abstract Team Visual */}
                    <div className="grid grid-cols-2 gap-6 w-full h-full">
                        <div className="bg-white/10 rounded-xl p-4 flex flex-col gap-3 animate-pulse">
                            <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                            <div className="w-3/4 h-3 bg-white/20 rounded"></div>
                            <div className="w-1/2 h-3 bg-white/20 rounded"></div>
                        </div>
                        <div className="bg-white/20 rounded-xl p-4 flex flex-col gap-3 translate-y-8 shadow-lg">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary"><span className="material-symbols-outlined">group_add</span></div>
                            <div className="w-3/4 h-3 bg-white/40 rounded"></div>
                            <div className="w-full h-20 bg-white/10 rounded mt-2 border border-white/10"></div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 flex flex-col gap-3 -translate-y-4">
                             <div className="w-full h-24 bg-gradient-to-br from-white/10 to-transparent rounded border border-white/5 relative overflow-hidden">
                                 <div className="absolute inset-0 flex items-center justify-center">
                                     <span className="material-symbols-outlined text-4xl text-white/20">rocket_launch</span>
                                 </div>
                             </div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 flex flex-col gap-3 translate-y-4">
                             <div className="flex justify-between items-center">
                                <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                                <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                                <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                             </div>
                             <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                 <div className="w-2/3 h-full bg-green-400"></div>
                             </div>
                        </div>
                    </div>
                 </div>
            </div>

            <h2 className="text-4xl font-black text-white mb-6 leading-tight">
                Hayalindeki Ekibi Kur<br/>
                <span className="text-white/70">Projelerini Gerçekleştir</span>
            </h2>
            <p className="text-lg text-white/80 leading-relaxed max-w-lg mx-auto">
                Binlerce öğrenci ve akademisyen arasına katıl. Proje ortağını bul, mentörlük al ve başarı hikayeni yazmaya başla.
            </p>
         </div>
      </div>
    </div>
  );
};