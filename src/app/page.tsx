'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the static HTML page
    window.location.href = '/20th.html';
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
      <div className="text-center">
        <div className="text-2xl font-bold text-[#be9e69] mb-4">載入中...</div>
        <p className="text-gray-400">正在前往 20 週年紀念頁面</p>
      </div>
    </div>
  );
}