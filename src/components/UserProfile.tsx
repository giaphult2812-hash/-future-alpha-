import React, { useState, useEffect } from 'react';
import { User, Eye, EyeOff, Camera, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UserProfileData {
  email: string;
  nickname: string;
  firstName: string;
  lastName: string;
  password: string;
  avatarUrl: string | null;
}

export const UserProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<UserProfileData>({
    email: 'giaphult2812@gmail.com',
    nickname: 'Giaphu2009',
    firstName: '',
    lastName: '',
    password: '',
    avatarUrl: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('futureAlpha_userProfile');
    if (storedData) {
      try {
        setProfileData(JSON.parse(storedData));
      } catch (e) {
        console.error('Failed to parse user profile data', e);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdate = () => {
    localStorage.setItem('futureAlpha_userProfile', JSON.stringify(profileData));
    showToast('Cập nhật tài khoản thành công!');
  };

  const handleAvatarChange = () => {
    // Simulate avatar change
    showToast('Tính năng thay đổi ảnh đang được phát triển', 'success');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0F0518] overflow-y-auto">
      <div className="p-5 pt-8 pb-20 max-w-md mx-auto w-full">
        <div className="bg-[#131722] border border-[#2A2E39] rounded-2xl overflow-hidden shadow-xl">
          {/* Header */}
          <div className="p-5 border-b border-[#2A2E39]">
            <h2 className="text-xl font-semibold text-white">Thông tin cá nhân</h2>
          </div>

          <div className="p-5 space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-[#1E2329] border-2 border-[#2A2E39] flex items-center justify-center overflow-hidden relative group">
                {profileData.avatarUrl ? (
                  <img src={profileData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-slate-500" />
                )}
              </div>
              <button 
                onClick={handleAvatarChange}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-2.5 px-6 rounded-lg transition-colors shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              >
                Thay ảnh
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm text-slate-400 mb-1.5 font-medium">Địa chỉ Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#1E2329] border border-[#2A2E39] rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-purple-500/50 transition-colors"
                  placeholder="Nhập email"
                />
              </div>

              {/* Nickname */}
              <div>
                <label className="block text-sm text-slate-400 mb-1.5 font-medium">Biệt danh</label>
                <input
                  type="text"
                  name="nickname"
                  value={profileData.nickname}
                  onChange={handleInputChange}
                  className="w-full bg-[#1E2329] border border-[#2A2E39] rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-purple-500/50 transition-colors"
                  placeholder="Nhập biệt danh"
                />
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm text-slate-400 mb-1.5 font-medium">Tên</label>
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-[#1E2329] border border-[#2A2E39] rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-purple-500/50 transition-colors"
                  placeholder="Nhập tên"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm text-slate-400 mb-1.5 font-medium">Họ</label>
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-[#1E2329] border border-[#2A2E39] rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-purple-500/50 transition-colors"
                  placeholder="Nhập họ"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-slate-400 mb-1.5 font-medium">Mật khẩu</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={profileData.password}
                    onChange={handleInputChange}
                    className="w-full bg-[#1E2329] border border-[#2A2E39] rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-purple-500/50 transition-colors pr-12"
                    placeholder="Nhập mật khẩu"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                onClick={handleUpdate}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3.5 px-8 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all active:scale-[0.98]"
              >
                Cập nhật Tài khoản
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`absolute bottom-24 left-1/2 -translate-x-1/2 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-medium z-50 border backdrop-blur-md whitespace-nowrap
              ${toast.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
