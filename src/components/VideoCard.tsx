'use client';
import YouTube from 'react-youtube';
import { submitVote } from '@/app/actions/vote';
import { useState } from 'react';

interface VideoCardProps {
    video: {
        id: number;
        title: string;
        youtube_id: string;
    };
    isLoggedIn: boolean;
    onVoteSuccess?: () => void;
}

export default function VideoCard({ video, isLoggedIn, onVoteSuccess }: VideoCardProps) {
    const [loading, setLoading] = useState(false);

    const handleVote = async () => {
        if (!isLoggedIn) {
            alert('請先登入！');
            return;
        }

        setLoading(true);
        const result = await submitVote(video.id);
        alert(result.message);
        setLoading(false);

        if (result.success && onVoteSuccess) {
            onVoteSuccess();
        }
    };

    return (
        <div className="bg-black/40 backdrop-blur-md border border-[#be9e69]/30 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-[#be9e69] transition-all duration-300 hover:scale-105 group">
            {/* YouTube 播放器 */}
            <div className="aspect-video bg-black relative">
                <YouTube
                    videoId={video.youtube_id}
                    opts={{
                        width: '100%',
                        height: '100%',
                        playerVars: {
                            autoplay: 0,
                        }
                    }}
                    className="w-full h-full"
                />
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#be9e69]/20 to-transparent pointer-events-none"></div>
            </div>

            <div className="p-6 bg-gradient-to-b from-transparent to-black/20">
                <h3 className="font-bold text-2xl mb-4 text-white line-clamp-2 group-hover:text-[#be9e69] transition-colors">{video.title}</h3>
                <button
                    onClick={handleVote}
                    disabled={true}
                    className="w-full py-3 rounded-xl font-bold text-lg transition-all duration-300 transform bg-gray-700 cursor-not-allowed text-gray-400 border border-gray-600"
                >
                    🔒 投票已結束
                </button>
            </div>
        </div>
    );
}