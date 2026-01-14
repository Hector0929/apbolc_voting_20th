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

        // 取得今天的日期（台灣時區）
        const today = new Date().toLocaleDateString('en-CA', {
            timeZone: 'Asia/Taipei'
        }); // 格式: YYYY-MM-DD

        // 檢查今天已投票數
        const { data: todayVotes, error: checkError } = await supabase
            .from('votes')
            .select('*')
            .eq('user_id', userId)
            .eq('vote_date', today);

        if (checkError) {
            console.error('檢查投票錯誤:', checkError);
            return { success: false, message: '檢查投票狀態時發生錯誤' };
        }

        // 檢查是否超過每日限制（3票）
        if (todayVotes && todayVotes.length >= 3) {
            return {
                success: false,
                message: '今天的投票次數已用完！明天再來投票吧 🗳️'
            };
        }

        // 新增投票記錄（包含 vote_date）
        const { error } = await supabase
            .from('votes')
            .insert({
                user_id: userId,
                video_id: videoId,
                vote_date: today
            });

        if (error) throw error;

        const remaining = 3 - (todayVotes?.length || 0) - 1;
        return {
            success: true,
            message: `投票成功！今日還剩 ${remaining} 票`,
            remainingVotes: remaining
        };
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

export async function getRemainingVotes(userId: string) {
    try {
        // 取得今天的日期（台灣時區）
        const today = new Date().toLocaleDateString('en-CA', {
            timeZone: 'Asia/Taipei'
        }); // 格式: YYYY-MM-DD

        // 查詢今天的投票記錄
        const { data, error } = await supabase
            .from('votes')
            .select('*')
            .eq('user_id', userId)
            .eq('vote_date', today);

        if (error) throw error;

        const votedCount = data?.length || 0;
        return {
            remaining: 3 - votedCount,
            voted: votedCount,
            total: 3
        };
    } catch (error) {
        console.error('獲取剩餘票數錯誤:', error);
        return {
            remaining: 0,
            voted: 0,
            total: 3
        };
    }
}