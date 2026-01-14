import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        // Fetch all votes with video information
        const { data, error } = await supabase
            .from('votes')
            .select('video_id, videos(id, title, youtube_id)')
            .order('video_id');

        if (error) throw error;

        // Count votes for each video
        const voteCounts: { [key: number]: { id: number; title: string; youtube_id: string; votes: number } } = {};

        data.forEach((vote: any) => {
            const videoId = vote.video_id;
            if (!voteCounts[videoId]) {
                voteCounts[videoId] = {
                    id: videoId,
                    title: vote.videos?.title || '',
                    youtube_id: vote.videos?.youtube_id || '',
                    votes: 0
                };
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
