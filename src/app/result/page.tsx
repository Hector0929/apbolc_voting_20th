'use client';
import { useEffect, useState } from 'react';
import Leaderboard from '@/components/Leaderboard';
import { getVoteStats } from '../actions/vote';

export default function ResultPage() {
    const [voteStats, setVoteStats] = useState<any[]>([]);

    useEffect(() => {
        loadVoteStats();
    }, []);

    const loadVoteStats = async () => {
        const stats = await getVoteStats();
        setVoteStats(stats);
    };

    return (
        <div className="min-h-screen bg-[#1a1a1a] py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#be9e69] via-[#d4af7a] to-[#be9e69] bg-clip-text text-transparent">
                        🎉 安平靈糧堂20週年
                    </h1>
                    <p className="text-2xl text-gray-300 font-semibold">投票結果</p>
                </header>

                {/* Leaderboard */}
                <Leaderboard stats={voteStats} />

                {/* Footer */}
                <footer className="text-center mt-12 text-gray-500">
                    <p className="text-lg">© 2026 安平靈糧堂 APBOLC | 感謝主恩典滿滿 🙏</p>
                </footer>
            </div>
        </div>
    );
}
