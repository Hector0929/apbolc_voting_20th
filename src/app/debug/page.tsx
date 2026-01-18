'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function DebugPage() {
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        debugVotes();
    }, []);

    async function debugVotes() {
        const debug: any = {};

        // 1. 直接查詢 votes 表（不用 JOIN）
        const { data: allVotes, error: votesError } = await supabase
            .from('votes')
            .select('video_id');

        debug.totalVotes = allVotes?.length || 0;
        debug.votesError = votesError?.message;

        // 2. 統計每個影片的票數（不用 JOIN）
        const voteCounts: any = {};
        allVotes?.forEach((vote: any) => {
            voteCounts[vote.video_id] = (voteCounts[vote.video_id] || 0) + 1;
        });
        debug.voteCountsNoJoin = Object.entries(voteCounts)
            .map(([id, count]) => ({ id: Number(id), count }))
            .sort((a: any, b: any) => b.count - a.count);

        // 3. 使用 JOIN 查詢（模擬 getVoteStats）
        const { data: withJoin, error: joinError } = await supabase
            .from('votes')
            .select('video_id, videos(title, youtube_id)');

        debug.withJoinCount = withJoin?.length || 0;
        debug.joinError = joinError?.message;

        // 4. 統計 JOIN 後的結果
        const joinCounts: any = {};
        withJoin?.forEach((vote: any) => {
            const id = vote.video_id;
            joinCounts[id] = joinCounts[id] || {
                count: 0,
                title: vote.videos?.title || '未知',
                hasVideo: !!vote.videos
            };
            joinCounts[id].count++;
        });
        debug.voteCountsWithJoin = Object.entries(joinCounts)
            .map(([id, info]: any) => ({ id: Number(id), ...info }))
            .sort((a: any, b: any) => b.count - a.count);

        // 5. 檢查 videos 表
        const { data: allVideos, error: videosError } = await supabase
            .from('videos')
            .select('id, title')
            .order('id');

        debug.totalVideos = allVideos?.length || 0;
        debug.videosError = videosError?.message;
        debug.videoIds = allVideos?.map(v => v.id);

        // 6. 找出孤兒投票
        const videoIds = new Set(allVideos?.map(v => v.id) || []);
        const orphanVotes: any = {};
        allVotes?.forEach((vote: any) => {
            if (!videoIds.has(vote.video_id)) {
                orphanVotes[vote.video_id] = (orphanVotes[vote.video_id] || 0) + 1;
            }
        });
        debug.orphanVotes = Object.entries(orphanVotes)
            .map(([id, count]) => ({ id: Number(id), count }))
            .sort((a: any, b: any) => b.count - a.count);

        setResults(debug);
        setLoading(false);
    }

    if (loading) {
        return <div className="p-8">Loading debug info...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-3xl font-bold mb-8">🔍 投票系統 Debug 資訊</h1>

            <div className="space-y-6">
                {/* 基本統計 */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">📊 基本統計</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-400">總投票數（votes 表）</p>
                            <p className="text-2xl font-bold text-green-400">{results.totalVotes}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">總影片數（videos 表）</p>
                            <p className="text-2xl font-bold text-blue-400">{results.totalVideos}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">JOIN 後的記錄數</p>
                            <p className="text-2xl font-bold text-yellow-400">{results.withJoinCount}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">遺失的投票</p>
                            <p className="text-2xl font-bold text-red-400">
                                {results.totalVotes - results.withJoinCount}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 影片 IDs */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">🎬 Videos 表中的影片 IDs</h2>
                    <p className="text-sm text-gray-400 mb-2">共 {results.totalVideos} 個影片</p>
                    <p className="font-mono text-sm">{results.videoIds?.join(', ')}</p>
                </div>

                {/* 孤兒投票 */}
                {results.orphanVotes && results.orphanVotes.length > 0 && (
                    <div className="bg-red-900/30 border border-red-500 p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4 text-red-400">⚠️ 孤兒投票（votes 表有但 videos 表沒有）</h2>
                        <div className="space-y-2">
                            {results.orphanVotes.map((orphan: any) => (
                                <div key={orphan.id} className="flex justify-between">
                                    <span>Video ID: {orphan.id}</span>
                                    <span className="font-bold">{orphan.count} 票</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 不使用 JOIN 的統計 */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">📈 實際票數（直接統計 votes 表）</h2>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {results.voteCountsNoJoin?.map((item: any, index: number) => (
                            <div key={item.id} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                                <span>#{index + 1} - Video ID: {item.id}</span>
                                <span className="font-bold text-green-400">{item.count} 票</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 使用 JOIN 的統計 */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">📊 JOIN 後的票數（getVoteStats 的方式）</h2>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {results.voteCountsWithJoin?.map((item: any, index: number) => (
                            <div key={item.id} className={`flex justify-between items-center p-2 rounded ${item.hasVideo ? 'bg-gray-700' : 'bg-red-900/30 border border-red-500'
                                }`}>
                                <div>
                                    <span>#{index + 1} - {item.title}</span>
                                    {!item.hasVideo && <span className="ml-2 text-red-400">(無影片資料)</span>}
                                </div>
                                <span className="font-bold text-blue-400">{item.count} 票</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 錯誤訊息 */}
                {(results.votesError || results.joinError || results.videosError) && (
                    <div className="bg-red-900/30 border border-red-500 p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4 text-red-400">❌ 錯誤訊息</h2>
                        {results.votesError && <p>Votes Error: {results.votesError}</p>}
                        {results.joinError && <p>JOIN Error: {results.joinError}</p>}
                        {results.videosError && <p>Videos Error: {results.videosError}</p>}
                    </div>
                )}

                {/* 原始資料 */}
                <details className="bg-gray-800 p-6 rounded-lg">
                    <summary className="text-xl font-bold cursor-pointer">🔧 原始 Debug 資料（JSON）</summary>
                    <pre className="mt-4 text-xs overflow-x-auto">
                        {JSON.stringify(results, null, 2)}
                    </pre>
                </details>
            </div>
        </div>
    );
}
