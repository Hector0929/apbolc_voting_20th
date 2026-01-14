'use client';
import { useEffect, useState } from 'react';
import VideoCard from '@/components/VideoCard';
import Leaderboard from '@/components/Leaderboard';
import { getVoteStats } from '../actions/vote';

interface Video {
    id: number;
    title: string;
    youtube_id: string;
}

export default function VotePage() {
    const [videos, setVideos] = useState<Video[]>([
        { id: 1, title: '安平靈糧堂20週年感恩禮拜', youtube_id: 'CRKeQXpDu1k' },
        { id: 2, title: '安平靈糧堂20週年紀念影片', youtube_id: 'yDc0_8emz7M' }
    ]);
    const [voteStats, setVoteStats] = useState<any[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');

    // Login form states
    const [inputName, setInputName] = useState('');
    const [inputPhone, setInputPhone] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkLoginStatus();
        loadVoteStats();
    }, []);

    const checkLoginStatus = () => {
        const storedName = localStorage.getItem('user_name');
        const storedPhone = localStorage.getItem('user_phone');

        if (storedName && storedPhone) {
            setIsLoggedIn(true);
            setUserName(storedName);
            setUserPhone(storedPhone);
        }
        setLoading(false);
    };

    const loadVoteStats = async () => {
        const stats = await getVoteStats();
        setVoteStats(stats);
    };

    const handleLogin = () => {
        const name = inputName.trim();
        const phone = inputPhone.trim();

        // Validation
        if (!name) {
            alert('請輸入您的姓名');
            return;
        }

        if (!phone) {
            alert('請輸入您的電話號碼');
            return;
        }

        // Phone number validation (Taiwan format)
        const phoneRegex = /^09\d{8}$/;
        if (!phoneRegex.test(phone)) {
            alert('請輸入有效的手機號碼格式 (例如: 0912345678)');
            return;
        }

        // Check if returning user
        const storedName = localStorage.getItem('user_name');
        const storedPhone = localStorage.getItem('user_phone');

        if (storedName && storedPhone) {
            // Returning user - must match exactly
            if (storedName !== name || storedPhone !== phone) {
                alert('❌ 姓名或電話號碼不正確！\n\n請輸入您第一次登入時使用的姓名和電話號碼。');
                return;
            }
        }

        // Save to localStorage
        localStorage.setItem('user_name', name);
        localStorage.setItem('user_phone', phone);

        // Also save to cookie for server-side access
        document.cookie = `user_id=${phone}; path=/; max-age=31536000`;
        document.cookie = `user_name=${encodeURIComponent(name)}; path=/; max-age=31536000`;

        setIsLoggedIn(true);
        setUserName(name);
        setUserPhone(phone);
        setInputName('');
        setInputPhone('');
    };

    const handleLogout = () => {
        const confirmLogout = confirm('確定要登出嗎？\n\n下次登入時需要輸入相同的姓名和電話號碼。');
        if (!confirmLogout) return;

        // Don't clear localStorage - keep user data for next login
        // Only clear cookies
        document.cookie = 'user_id=; path=/; max-age=0';
        document.cookie = 'user_name=; path=/; max-age=0';

        setIsLoggedIn(false);
        setUserName('');
        setUserPhone('');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
                <div className="text-2xl font-bold text-[#be9e69]">載入中...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1a1a1a] py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header with Back Button */}
                <header className="text-center mb-12 relative">
                    <a
                        href="/20th.html"
                        className="absolute left-0 top-0 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md border border-[#be9e69]/30 rounded-xl text-gray-300 hover:text-[#be9e69] hover:border-[#be9e69] transition-all duration-300 group"
                    >
                        <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
                        <span className="hidden md:inline">返回首頁</span>
                    </a>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#be9e69] via-[#d4af7a] to-[#be9e69] bg-clip-text text-transparent">
                        🎉 安平靈糧堂20週年
                    </h1>
                    <p className="text-2xl text-gray-300 font-semibold">影片票選活動</p>
                </header>

                {/* Login Section */}
                <div className="bg-black/40 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-12 border border-[#be9e69]/30">
                    {!isLoggedIn ? (
                        <div className="flex flex-col items-center justify-center">
                            <div className="mb-6 text-center">
                                <i className="fas fa-user-circle text-[#be9e69] text-5xl mb-4"></i>
                                <h2 className="text-2xl font-bold text-white mb-2">登入投票</h2>
                                <p className="text-gray-400 text-sm">請輸入您的姓名和電話號碼</p>
                                <p className="text-gray-500 text-xs mt-2">
                                    <i className="fas fa-info-circle mr-1"></i>
                                    下次登入請使用相同的資料
                                </p>
                            </div>

                            <div className="w-full max-w-md space-y-4">
                                {/* Name Input */}
                                <div>
                                    <label className="block text-gray-300 text-sm font-semibold mb-2">
                                        <i className="fas fa-user mr-2"></i>姓名
                                    </label>
                                    <input
                                        type="text"
                                        value={inputName}
                                        onChange={(e) => setInputName(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && document.getElementById('phone-input')?.focus()}
                                        placeholder="請輸入您的姓名"
                                        className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#be9e69] focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Phone Input */}
                                <div>
                                    <label className="block text-gray-300 text-sm font-semibold mb-2">
                                        <i className="fas fa-phone mr-2"></i>電話號碼
                                    </label>
                                    <input
                                        id="phone-input"
                                        type="tel"
                                        value={inputPhone}
                                        onChange={(e) => setInputPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                                        placeholder="0912345678"
                                        maxLength={10}
                                        className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#be9e69] focus:border-transparent transition-all"
                                    />
                                    <p className="text-gray-500 text-xs mt-1">
                                        請輸入 10 位數手機號碼
                                    </p>
                                </div>

                                {/* Login Button */}
                                <button
                                    onClick={handleLogin}
                                    className="w-full py-3 bg-gradient-to-r from-[#be9e69] to-[#d4af7a] hover:from-[#d4af7a] hover:to-[#be9e69] text-black font-bold text-lg rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(190,158,105,0.5)] transition-all duration-300 transform hover:scale-105 active:scale-95"
                                >
                                    <i className="fas fa-sign-in-alt mr-2"></i>
                                    開始投票
                                </button>
                            </div>

                            {/* Info Box */}
                            <div className="mt-6 p-4 bg-[#be9e69]/10 border border-[#be9e69]/30 rounded-lg max-w-md">
                                <p className="text-gray-300 text-sm text-center">
                                    <i className="fas fa-shield-alt text-[#be9e69] mr-2"></i>
                                    您的資料將被安全保存，下次登入時請使用相同的姓名和電話號碼
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="text-center md:text-left">
                                <div className="text-xl font-semibold text-white mb-1">
                                    <i className="fas fa-user-check text-[#be9e69] mr-2"></i>
                                    歡迎，<span className="text-[#be9e69]">{userName}</span>！
                                </div>
                                <div className="text-sm text-gray-400">
                                    <i className="fas fa-phone text-gray-500 mr-1"></i>
                                    {userPhone}
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-6 py-2 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all duration-300 border border-gray-600"
                            >
                                <i className="fas fa-sign-out-alt mr-2"></i>
                                登出
                            </button>
                        </div>
                    )}
                </div>

                {/* Leaderboard */}
                <Leaderboard stats={voteStats} />

                {/* Videos Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {videos.map((video) => (
                        <VideoCard
                            key={video.id}
                            video={video}
                            isLoggedIn={isLoggedIn}
                            onVoteSuccess={loadVoteStats}
                        />
                    ))}
                </div>

                {/* Footer */}
                <footer className="text-center mt-12 text-gray-500">
                    <p className="text-lg">© 2026 安平靈糧堂 APBOLC | 感謝主恩典滿滿 🙏</p>
                </footer>
            </div>
        </div>
    );
}
