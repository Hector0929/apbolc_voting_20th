import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';


export async function GET() {
    try {
        let allVotes: any[] = [];
        let from = 0;
        const pageSize = 1000;
        let hasMore = true;

        // 分頁取得所有投票記錄
        while (hasMore) {
            const { data, error } = await supabase
                .from('votes')
                .select('video_id, videos(id, title, youtube_id)')
                .order('video_id')
                .range(from, from + pageSize - 1);

            if (error) throw error;

            if (data && data.length > 0) {
                allVotes = allVotes.concat(data);
                from += pageSize;

                if (data.length < pageSize) {
                    hasMore = false;
                }
            } else {
                hasMore = false;
            }
        }

        console.log(`✅ top-videos API: 成功取得 ${allVotes.length} 筆投票記錄`);

        // Count votes for each video
        const voteCounts: { [key: number]: { id: number; title: string; youtube_id: string; votes: number } } = {};

        allVotes.forEach((vote: any) => {
            const videoId = vote.video_id;
            if (!voteCounts[videoId]) {
                voteCounts[videoId] = {
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
            voteCounts[videoId].votes += 1;
        });

        // Convert to array and sort by votes
        const sortedVideos = Object.values(voteCounts)
            .sort((a, b) => b.votes - a.votes)
            .slice(0, 3); // Get top 3

        return NextResponse.json(sortedVideos);
    } catch (error) {
        console.error('Error fetching top videos:', error);
        return NextResponse.json([], { status: 500 });
    }
}
