'use server';
import { supabase } from '@/lib/supabaseClient';
import { cookies } from 'next/headers';


export async function submitVote(videoId: number) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('user_id')?.value;

        if (!userId) {
            return { success: false, message: '請先登入！' };
        }

        // 檢查是否已投過票
        const { data: existingVote } = await supabase
            .from('votes')
            .select('*')
            .eq('user_id', userId)
            .eq('video_id', videoId)
            .single();

        if (existingVote) {
            return { success: false, message: '您已經投過這個影片了！' };
        }

        // 新增投票記錄
        const { error } = await supabase
            .from('votes')
            .insert({ user_id: userId, video_id: videoId });

        if (error) throw error;

        return { success: true, message: '投票成功！' };
    } catch (error) {
        console.error('投票錯誤:', error);
        return { success: false, message: '投票失敗，請稍後再試' };
    }
}

export async function getVoteStats() {
    try {
        const { data, error } = await supabase
            .from('votes')
            .select('video_id, videos(title, youtube_id)')
            .order('video_id');

        if (error) throw error;

        // 統計每個影片的票數
        const stats = data.reduce((acc: any, vote: any) => {
            const videoId = vote.video_id;
            if (!acc[videoId]) {
                acc[videoId] = {
                    id: videoId,
                    title: vote.videos?.title || '',
                    youtube_id: vote.videos?.youtube_id || '',
                    votes: 0
                };
            }
            acc[videoId].votes += 1;
            return acc;
        }, {});

        return Object.values(stats);
    } catch (error) {
        console.error('獲取投票統計錯誤:', error);
        return [];
    }
}