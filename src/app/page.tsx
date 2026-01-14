'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect directly to vote page for easier access
    router.push('/vote');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
      <div className="text-center">
        <div className="text-2xl font-bold text-[#be9e69] mb-4">載入中...</div>
        <p className="text-gray-400">正在前往投票頁面</p>
      </div>
    </div>
  );
}