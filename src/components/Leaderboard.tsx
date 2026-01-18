'use client';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface VoteStats {
    id: number;
    title: string;
    youtube_id: string;
    votes: number;
}

interface LeaderboardProps {
    stats: VoteStats[];
}

export default function Leaderboard({ stats }: LeaderboardProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || stats.length === 0) {
        return (
            <div className="bg-black/40 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-[#be9e69]/30">
                <h2 className="text-3xl font-bold mb-6 text-center text-[#be9e69]">
                    ✈️ 投票排行榜 Flight Leaderboard
                </h2>
                <p className="text-center text-gray-400">目前還沒有投票記錄</p>
            </div>
        );
    }

    const sortedStats = [...stats].sort((a, b) => b.votes - a.votes).slice(0, 5);

    const chartData = {
        labels: sortedStats.map(s => s.title),
        datasets: [
            {
                label: '票數',
                data: sortedStats.map(s => s.votes),
                backgroundColor: [
                    'rgba(190, 158, 105, 0.8)',  // gold
                    'rgba(139, 115, 85, 0.8)',   // darker gold
                ],
                borderColor: [
                    'rgba(190, 158, 105, 1)',
                    'rgba(139, 115, 85, 1)',
                ],
                borderWidth: 2,
                borderRadius: 8,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                padding: 12,
                titleFont: {
                    size: 14,
                    weight: 'bold' as const,
                },
                bodyFont: {
                    size: 13,
                },
                borderColor: 'rgba(190, 158, 105, 0.5)',
                borderWidth: 1,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    color: '#9ca3af',
                    font: {
                        size: 12,
                    }
                },
                grid: {
                    color: '#374151',
                }
            },
            x: {
                ticks: {
                    color: '#d1d5db',
                    font: {
                        size: 12,
                    }
                },
                grid: {
                    display: false,
                }
            }
        }
    };

    return (
        <div className="bg-black/40 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-[#be9e69]/30">
            <h2 className="text-3xl font-bold mb-8 text-center text-[#be9e69]">
                ✈️ 投票排行榜 Flight Leaderboard
            </h2>

            {/* 排行榜列表 */}
            <div className="space-y-4 mb-8">
                {sortedStats.map((stat, index) => (
                    <div
                        key={stat.id}
                        className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-105 ${index === 0
                            ? 'bg-gradient-to-r from-[#be9e69]/20 to-[#d4af7a]/20 border-2 border-[#be9e69]'
                            : 'bg-black/20 border border-gray-700'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <span className={`text-2xl font-bold ${index === 0 ? 'text-[#be9e69]' : 'text-gray-400'
                                }`}>
                                {index === 0 ? '🏆' : `#${index + 1}`}
                            </span>
                            <span className="font-semibold text-white">{stat.title}</span>
                        </div>
                        <span className={`text-2xl font-bold ${index === 0 ? 'text-[#be9e69]' : 'text-gray-300'
                            }`}>
                            {stat.votes} 票
                        </span>
                    </div>
                ))}
            </div>

            {/* 圖表 */}
            <div className="h-64">
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
}
