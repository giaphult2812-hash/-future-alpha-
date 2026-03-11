import React, { useState, useEffect } from 'react';
import { X, EyeOff, Mail } from 'lucide-react';

interface Props {
  onAuthenticated: () => void;
}

export const FutureAlphaAuth: React.FC<Props> = ({ onAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [isCheckEmail, setIsCheckEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Register state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [referral, setReferral] = useState('');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('verify') === 'true') {
      const verifiedEmail = params.get('email');
      if (verifiedEmail) {
        setLoginEmail(verifiedEmail);
      }
      setIsLogin(true);
      alert('Xác thực email thành công! Vui lòng đăng nhập.');
      // Remove query params to clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleRegister = async () => {
    if (email && password) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem('futurealpha_user', JSON.stringify({ email, password, nickname }));
        localStorage.setItem('futurealpha_demo_balance', '10000');
        setIsCheckEmail(true);
      }, 1000);
    } else {
      alert("Vui lòng nhập email và mật khẩu!");
    }
  };

  const handleLogin = () => {
    if (loginEmail && loginPassword) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const storedUserStr = localStorage.getItem('futurealpha_user');
        if (storedUserStr) {
          const storedUser = JSON.parse(storedUserStr);
          if (storedUser.email === loginEmail && storedUser.password === loginPassword) {
            onAuthenticated();
          } else {
            alert('Email hoặc mật khẩu không đúng!');
          }
        } else {
          // Allow default login if no user is registered yet for demo purposes
          if (loginEmail === 'demo@futurealpha.net' && loginPassword === '123456') {
            localStorage.setItem('futurealpha_user', JSON.stringify({ email: loginEmail, password: loginPassword, nickname: 'Demo User' }));
            localStorage.setItem('futurealpha_demo_balance', '10000');
            onAuthenticated();
          } else {
            alert('Tài khoản không tồn tại! (Dùng demo@futurealpha.net / 123456 để test)');
          }
        }
      }, 1000);
    } else {
      alert('Vui lòng nhập email và mật khẩu!');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0F0518] flex flex-col font-sans text-white overflow-y-auto">
      <div className="w-full max-w-md mx-auto p-5 sm:p-6 flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 relative pt-2">
          <div className="flex items-center gap-2">
            {/* Custom Logo SVG */}
            <div className="w-8 h-8 relative shrink-0 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logoBodyAuth" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D8B4FE" />
                    <stop offset="50%" stopColor="#9333EA" />
                    <stop offset="100%" stopColor="#581C87" />
                  </linearGradient>
                </defs>
                <path d="M10 55 C 10 25, 90 25, 90 55" stroke="url(#logoBodyAuth)" strokeWidth="4" fill="none" strokeLinecap="round" transform="rotate(-20 50 50)" opacity="0.8" />
                <path d="M28 20 H 72 L 62 35 H 42 V 45 H 58 L 50 58 H 42 V 80 L 28 80 V 20 Z" fill="url(#logoBodyAuth)" stroke="#E9D5FF" strokeWidth="0.5" />
                <path d="M 52 80 L 65 45 L 82 80 H 68 L 66 72 H 58 L 55 80 H 52 Z M 62 62 L 65 52 L 68 62 H 62 Z" fill="url(#logoBodyAuth)" stroke="#E9D5FF" strokeWidth="0.5" />
                <path d="M90 55 C 90 85, 10 85, 10 55" stroke="url(#logoBodyAuth)" strokeWidth="4" fill="none" strokeLinecap="round" transform="rotate(-20 50 50)" opacity="0.9" strokeDasharray="100" strokeDashoffset="0" />
              </svg>
            </div>
            <span className="text-purple-500 font-bold text-xl tracking-wide">FutureAlpha</span>
          </div>
          <div className="flex justify-end">
            <button className="w-10 h-10 bg-[#1E2329] rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#2A2F36] transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isCheckEmail ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-12 h-12 text-purple-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">Nhập mã OTP</h1>
            <p className="text-gray-400 max-w-[280px]">
              Vui lòng nhập mã OTP (123456) để xác thực tài khoản.
            </p>
            <input 
              type="text" 
              placeholder="Nhập mã OTP..."
              className="w-full bg-[#130720] border border-purple-500/20 rounded-lg py-3.5 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors text-center text-xl tracking-widest"
              onChange={(e) => {
                if (e.target.value === '123456') {
                  setIsCheckEmail(false);
                  setIsLogin(true);
                  setLoginEmail(email);
                  alert('Xác thực thành công! Vui lòng đăng nhập.');
                }
              }}
            />
            <button 
              onClick={() => {
                setIsCheckEmail(false);
                setIsLogin(true);
              }}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg py-4 mt-8 transition-colors text-lg shadow-[0_0_15px_rgba(147,51,234,0.3)]"
            >
              Quay lại Đăng nhập
            </button>
          </div>
        ) : isLogin ? (
          <>
            <h1 className="text-purple-500 font-bold text-3xl mb-10 leading-tight">
              Đăng nhập vào Tài khoản của bạn
            </h1>

            {/* Login Form */}
            <div className="space-y-6 flex-1">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">Địa chỉ Email *</label>
                <input 
                  type="email" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Điền Email..."
                  className="w-full bg-[#130720] border border-purple-500/20 rounded-lg py-3.5 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">Mật khẩu *</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Điền mật khẩu..."
                    className="w-full bg-[#130720] border border-purple-500/20 rounded-lg py-3.5 px-4 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400">
                    <EyeOff className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-right mt-2">
                  <button className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
                    Quên mật khẩu?
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                onClick={handleLogin}
                disabled={isLoading}
                className={`w-full bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg py-4 mt-6 transition-colors text-lg shadow-[0_0_15px_rgba(147,51,234,0.3)] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </div>

            {/* Footer */}
            <div className="mt-12 pb-6 flex flex-col gap-3 text-sm">
              <div>
                <span className="text-gray-300">Cần tài khoản FutureAlpha? </span>
                <button 
                  onClick={() => setIsLogin(false)}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Đăng ký
                </button>
              </div>
              <div>
                <span className="text-gray-300">Không nhận được email xác nhận? </span>
                <button className="text-purple-400 hover:text-purple-300 transition-colors">
                  Yêu cầu một email mới.
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-purple-500 font-bold text-xl text-center mb-8">
              Tạo tài khoản FutureAlpha
            </h1>

            {/* Register Form */}
            <div className="space-y-5 flex-1">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Địa chỉ Email *</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Điền Email..."
                  className="w-full bg-[#130720] border border-purple-500/20 rounded-lg py-3.5 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Mật khẩu *</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Điền mật khẩu..."
                    className="w-full bg-[#130720] border border-purple-500/20 rounded-lg py-3.5 px-4 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400">
                    <EyeOff className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">{password.length} / 20</div>
              </div>

              {/* Nickname */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Biệt danh *</label>
                <input 
                  type="text" 
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Điền Nickname..."
                  className="w-full bg-[#130720] border border-purple-500/20 rounded-lg py-3.5 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <div className="text-right text-xs text-gray-500 mt-1">{nickname.length} / 20</div>
              </div>

              {/* Referral */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Mã giới thiệu / Mã khuyến mãi</label>
                <input 
                  type="text" 
                  value={referral}
                  onChange={(e) => setReferral(e.target.value)}
                  placeholder="Điền Mã giới thiệu..."
                  className="w-full bg-[#130720] border border-purple-500/20 rounded-lg py-3.5 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button 
                onClick={handleRegister}
                disabled={isLoading}
                className={`w-full bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg py-4 mt-8 transition-colors text-lg shadow-[0_0_15px_rgba(147,51,234,0.3)] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Đang gửi email...' : 'Đăng ký'}
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 pb-6 text-center text-sm">
              <span className="text-gray-500">Có tài khoản FutureAlpha? </span>
              <button 
                onClick={() => setIsLogin(true)}
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Đăng nhập vào Tài khoản của bạn
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
