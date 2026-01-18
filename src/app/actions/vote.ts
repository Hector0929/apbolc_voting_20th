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

        // 檢查今天是否已經投過這部特定的影片
        const hasVotedForThisVideo = todayVotes?.some(v => v.video_id === videoId);
        if (hasVotedForThisVideo) {
            return {
                success: false,
                message: '您今天已經投過這部影片了！請投給其他不同的影片 📹'
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
        let allVotes: any[] = [];
        let from = 0;
        const pageSize = 1000;
        let hasMore = true;

        // 分頁取得所有投票記錄
        while (hasMore) {
            const { data, error } = await supabase
                .from('votes')
                .select('video_id, videos(title, youtube_id)')
                .order('video_id')
                .range(from, from + pageSize - 1);

            if (error) throw error;

            if (data && data.length > 0) {
                allVotes = allVotes.concat(data);
                from += pageSize;

                // 如果這次取得的記錄少於 pageSize，表示已經是最後一頁
                if (data.length < pageSize) {
                    hasMore = false;
                }
            } else {
                hasMore = false;
            }
        }

        console.log(`✅ getVoteStats: 成功取得 ${allVotes.length} 筆投票記錄`);

        // 統計每個影片的票數（包含沒有影片資料的投票）
        const stats = allVotes.reduce((acc: any, vote: any) => {
            const videoId = vote.video_id;
            if (!acc[videoId]) {
                acc[videoId] = {
                    id: videoId,
                    title: vote.videos?.title || `未知影片 #${videoId}`,
                    youtube_id: vote.videos?.youtube_id || '',
                    votes: 0
                };

                // 記錄孤兒投票以便追蹤
                if (!vote.videos) {
                    console.warn(`發現孤兒投票: video_id ${videoId} 不存在於 videos 表中`);
                }
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