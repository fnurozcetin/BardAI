"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "./DemoComponents";
import { Icon } from "./DemoComponents";
import { useAccount } from "wagmi";
import { useNotification } from "@coinbase/onchainkit/minikit";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Trophy, Coffee, Star, Users, TrendingUp } from "lucide-react";

type CommunityPost = {
  id: string;
  userAddress: string;
  username: string;
  question: string;
  answer: string;
  likes: number;
  isLiked: boolean;
  isShared: boolean;
  timestamp: number;
  isNFTWinner: boolean;
  nftId?: string;
  category: 'tea-culture' | 'brewing' | 'health' | 'funny' | 'general';
};

type CommunityProps = {
  setActiveTab: (tab: string) => void;
};

const mockPosts: CommunityPost[] = [
  {
    id: "1",
    userAddress: "0x1234...5678",
    username: "ÇayMaster",
    question: "Hangi çay türü en sağlıklı?",
    answer: "Yeşil çay kesinlikle! Antioksidan açısından zengin ve metabolizmayı hızlandırıyor. Her sabah içiyorum ve kendimi çok iyi hissediyorum! 🍃✨",
    likes: 156,
    isLiked: false,
    isShared: false,
    timestamp: Date.now() - 3600000,
    isNFTWinner: true,
    nftId: "NFT-001",
    category: 'health'
  },
  {
    id: "2",
    userAddress: "0x8765...4321",
    username: "TeaLover",
    question: "Çay demleme sırrı nedir?",
    answer: "Su sıcaklığı çok önemli! Yeşil çay için 70-80°C, siyah çay için 90-95°C. Çok uzun demlemeyin, acı olur. Ben 3 dakika bekliyorum ve mükemmel! 🫖⏰",
    likes: 89,
    isLiked: false,
    isShared: false,
    timestamp: Date.now() - 7200000,
    isNFTWinner: false,
    category: 'brewing'
  },
  {
    id: "3",
    userAddress: "0x9999...8888",
    username: "MemeLord",
    question: "Çay vs Kahve savaşı?",
    answer: "Çay tabii ki! Kahve sadece kafein bombası, çay ise kültür! Çay içerken kendini zen master gibi hissediyorsun. Kahve içerken sadece titriyorsun! 😂☕ vs ☕",
    likes: 234,
    isLiked: false,
    isShared: false,
    timestamp: Date.now() - 10800000,
    isNFTWinner: true,
    nftId: "NFT-002",
    category: 'funny'
  },
  {
    id: "4",
    userAddress: "0x5555...6666",
    username: "TeaPhilosopher",
    question: "Çay kültürü neden önemli?",
    answer: "Çay sadece bir içecek değil, bir yaşam felsefesi! Sabır, huzur ve birlik duygusu veriyor. Dünyada çay içen herkes birbirine bağlı! 🌍🍵",
    likes: 67,
    isLiked: false,
    isShared: false,
    timestamp: Date.now() - 14400000,
    isNFTWinner: false,
    category: 'tea-culture'
  }
];

const categories = [
  { id: 'all', name: 'Tümü', icon: '🍵' },
  { id: 'tea-culture', name: 'Çay Kültürü', icon: '🌍' },
  { id: 'brewing', name: 'Demleme', icon: '🫖' },
  { id: 'health', name: 'Sağlık', icon: '💚' },
  { id: 'funny', name: 'Komik', icon: '😂' },
  { id: 'general', name: 'Genel', icon: '📝' }
];

export function Community({ setActiveTab }: CommunityProps) {
  const [posts, setPosts] = useState<CommunityPost[]>(mockPosts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'likes' | 'time'>('likes');
  const [showNFTWinners, setShowNFTWinners] = useState(false);
  const { address } = useAccount();
  const sendNotification = useNotification();

  const filteredPosts = posts.filter(post => 
    selectedCategory === 'all' || post.category === selectedCategory
  ).sort((a, b) => {
    if (sortBy === 'likes') {
      return b.likes - a.likes;
    } else {
      return b.timestamp - a.timestamp;
    }
  });

  const nftWinners = posts.filter(post => post.isNFTWinner);

  const handleLike = useCallback((postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  }, []);

  const handleShare = useCallback((postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isShared: !post.isShared }
        : post
    ));
    
    sendNotification({
      title: "Post Paylaşıldı! 📤",
      body: "Çay kültürü yayılıyor!",
    });
  }, [sendNotification]);

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} dakika önce`;
    if (hours < 24) return `${hours} saat önce`;
    return `${days} gün önce`;
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : '🍵';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <div className="text-6xl mb-4">👥</div>
        <h1 className="text-2xl font-bold text-[var(--app-foreground)] mb-2">
          👥 Çay Community
        </h1>
        <p className="text-[var(--app-foreground-muted)]">
          Çay severlerin buluşma noktası ve NFT ödül sistemi! 🏆
        </p>
      </div>

      {/* NFT Winners Banner */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-4 text-white text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Trophy size={24} />
          <h3 className="font-bold text-lg">NFT Kazananlar</h3>
        </div>
        <p className="text-sm opacity-90 mb-3">
          En çok beğenilen yanıtlar NFT ile ödüllendirildi!
        </p>
        <div className="flex justify-center space-x-4">
          {nftWinners.slice(0, 3).map((winner) => (
            <div key={winner.id} className="bg-white bg-opacity-20 rounded-lg p-2 text-xs">
              <div className="font-bold">{winner.username}</div>
              <div className="opacity-80">{winner.nftId}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[var(--app-card-bg)] rounded-lg p-3 text-center border border-[var(--app-card-border)]">
          <div className="text-2xl mb-1">📝</div>
          <div className="text-sm font-bold">{posts.length}</div>
          <div className="text-xs text-[var(--app-foreground-muted)]">Toplam Post</div>
        </div>
        <div className="bg-[var(--app-card-bg)] rounded-lg p-3 text-center border border-[var(--app-card-border)]">
          <div className="text-2xl mb-1">👥</div>
          <div className="text-sm font-bold">{new Set(posts.map(p => p.userAddress)).size}</div>
          <div className="text-xs text-[var(--app-foreground-muted)]">Aktif Kullanıcı</div>
        </div>
        <div className="bg-[var(--app-card-bg)] rounded-lg p-3 text-center border border-[var(--app-card-border)]">
          <div className="text-2xl mb-1">🏆</div>
          <div className="text-sm font-bold">{nftWinners.length}</div>
          <div className="text-xs text-[var(--app-foreground-muted)]">NFT Kazanan</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[var(--app-card-bg)] rounded-lg p-4 border border-[var(--app-card-border)]">
        <div className="flex flex-wrap gap-2 mb-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                selectedCategory === category.id
                  ? 'bg-[var(--app-accent)] text-white border-[var(--app-accent)]'
                  : 'bg-transparent border-[var(--app-card-border)] text-[var(--app-foreground)] hover:border-[var(--app-accent)]'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setSortBy('likes')}
            className={`px-3 py-1 rounded text-xs border transition-colors ${
              sortBy === 'likes'
                ? 'bg-[var(--app-accent)] text-white border-[var(--app-accent)]'
                : 'bg-transparent border-[var(--app-card-border)] text-[var(--app-foreground)] hover:border-[var(--app-accent)]'
            }`}
          >
            <TrendingUp size={12} className="inline mr-1" />
            Beğeni
          </button>
          <button
            onClick={() => setSortBy('time')}
            className={`px-3 py-1 rounded text-xs border transition-colors ${
              sortBy === 'time'
                ? 'bg-[var(--app-accent)] text-white border-[var(--app-accent)]'
                : 'bg-transparent border-[var(--app-card-border)] text-[var(--app-foreground)] hover:border-[var(--app-accent)]'
            }`}
          >
            ⏰ Zaman
          </button>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--app-card-bg)] rounded-lg p-4 border border-[var(--app-card-border)]"
          >
            {/* Post Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[var(--app-accent)] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {post.username.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-[var(--app-foreground)]">{post.username}</div>
                  <div className="text-xs text-[var(--app-foreground-muted)]">
                    {formatTime(post.timestamp)}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getCategoryIcon(post.category)}</span>
                {post.isNFTWinner && (
                  <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    🏆 NFT
                  </div>
                )}
              </div>
            </div>

            {/* Question */}
            <div className="mb-3">
              <div className="text-sm text-[var(--app-foreground-muted)] mb-1">Soru:</div>
              <div className="font-medium text-[var(--app-foreground)]">{post.question}</div>
            </div>

            {/* Answer */}
            <div className="mb-3">
              <div className="text-sm text-[var(--app-foreground-muted)] mb-1">Yanıt:</div>
              <div className="text-[var(--app-foreground)]">{post.answer}</div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-1 text-sm ${
                    post.isLiked ? 'text-red-500' : 'text-[var(--app-foreground-muted)]'
                  } hover:text-red-500 transition-colors`}
                >
                  <Heart size={16} className={post.isLiked ? 'fill-current' : ''} />
                  <span>{post.likes}</span>
                </button>
                <button
                  onClick={() => handleShare(post.id)}
                  className={`flex items-center space-x-1 text-sm ${
                    post.isShared ? 'text-blue-500' : 'text-[var(--app-foreground-muted)]'
                  } hover:text-blue-500 transition-colors`}
                >
                  <Share2 size={16} />
                  <span>Paylaş</span>
                </button>
              </div>
              {post.isNFTWinner && (
                <div className="text-xs text-yellow-600 font-medium">
                  NFT ID: {post.nftId}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* How to Win NFT */}
      <div className="bg-[var(--app-card-bg)] rounded-lg p-4 border border-[var(--app-card-border)]">
        <h3 className="font-medium text-[var(--app-foreground)] mb-3 flex items-center">
          <Trophy size={16} className="mr-2" />
          NFT Nasıl Kazanılır?
        </h3>
        <div className="space-y-2 text-sm text-[var(--app-foreground-muted)]">
          <div>1. 🍵 Çay hakkında kaliteli sorular sorun</div>
          <div>2. 💭 Detaylı ve yararlı yanıtlar verin</div>
          <div>3. ❤️ Diğer kullanıcıların yanıtlarını beğenin</div>
          <div>4. 🏆 En çok beğenilen yanıtlar NFT kazanır</div>
          <div>5. 🎉 NFT'ler her hafta dağıtılır</div>
        </div>
      </div>

      <Button
        variant="ghost"
        onClick={() => setActiveTab("tea-cup-ai")}
        className="w-full"
      >
        ☕ CAI'ya Git
      </Button>

      <Button
        variant="ghost"
        onClick={() => setActiveTab("home")}
        className="w-full"
      >
        Ana Sayfaya Dön 🏠
      </Button>
    </div>
  );
}
