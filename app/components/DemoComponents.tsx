"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  onClick, 
  className = "", 
  disabled = false,
  icon
}: { 
  children: React.ReactNode; 
  variant?: "primary" | "secondary" | "outline" | "ghost"; 
  size?: "sm" | "md" | "lg"; 
  onClick?: () => void; 
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}) {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-[var(--app-accent)] text-white hover:bg-[var(--app-accent-hover)] focus:ring-[var(--app-accent)]",
    secondary: "bg-[var(--app-gray)] text-[var(--app-foreground)] hover:bg-[var(--app-gray-hover)] focus:ring-[var(--app-gray)]",
    outline: "border border-[var(--app-card-border)] text-[var(--app-foreground)] hover:bg-[var(--app-card-bg)] focus:ring-[var(--app-accent)]",
    ghost: "text-[var(--app-foreground)] hover:bg-[var(--app-card-bg)] focus:ring-[var(--app-accent)]"
  };
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}

export function Icon({ 
  name, 
  size = "md", 
  className = "" 
}: { 
  name: string; 
  size?: "sm" | "md" | "lg"; 
  className?: string; 
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };
  
  const iconMap: { [key: string]: string } = {
    plus: "➕",
    check: "✅",
    home: "🏠",
    tea: "🍵",
    ai: "🤖",
    community: "👥",
    trophy: "🏆",
    heart: "❤️",
    share: "📤",
    time: "⏰"
  };
  
  return (
    <span className={`${sizeClasses[size]} ${className}`}>
      {iconMap[name] || "❓"}
    </span>
  );
}

export function Home({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-8xl mb-4"
        >
          ☕
        </motion.div>
        <h1 className="text-3xl font-bold text-[var(--app-foreground)] mb-2">
          ☕ CAI
        </h1>
        <p className="text-[var(--app-foreground-muted)] text-lg">
          Çay kültürü, komik AI asistanı ve NFT ödül sistemi! 🎭🏆
        </p>
      </div>

      <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-6 text-white text-center">
        <h2 className="text-xl font-bold mb-3">🚀 Yeni Özellikler</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="text-2xl mb-2">🤖</div>
            <div className="font-bold">CAI</div>
            <div className="opacity-90">Komik ve meme'li yanıtlar</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="text-2xl mb-2">👥</div>
            <div className="font-bold">Community</div>
            <div className="opacity-90">Çay severlerin buluşma noktası</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="text-2xl mb-2">🏆</div>
            <div className="font-bold">NFT Ödüller</div>
            <div className="opacity-90">En iyi yanıtlar NFT kazanır</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() => setActiveTab("tea-cup-ai")}
          className="h-24 flex flex-col items-center justify-center space-y-2"
        >
          <div className="text-3xl">☕</div>
          <div className="text-sm font-medium">CAI</div>
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setActiveTab("community")}
          className="h-24 flex flex-col items-center justify-center space-y-2"
        >
          <div className="text-3xl">👥</div>
          <div className="text-sm font-medium">Community</div>
        </Button>
      </div>

      <div className="bg-[var(--app-card-bg)] rounded-lg p-4 border border-[var(--app-card-border)]">
        <h3 className="font-medium text-[var(--app-foreground)] mb-3">🎯 Nasıl Çalışır?</h3>
        <div className="space-y-2 text-sm text-[var(--app-foreground-muted)]">
          <div>1. ☕ CAI'ya soru sorun</div>
          <div>2. 🎭 Komik ve bilgilendirici yanıtlar alın</div>
          <div>3. 👥 Community'de yanıtlarınızı paylaşın</div>
          <div>4. ❤️ Diğer kullanıcıların yanıtlarını beğenin</div>
          <div>5. 🏆 En çok beğenilen yanıtlar NFT kazanır!</div>
        </div>
      </div>

      <div className="text-center text-sm text-[var(--app-foreground-muted)]">
        <p>☕ Çay kültürünü keşfet, komik yanıtlar al, NFT kazan! 🎉</p>
      </div>
    </div>
  );
}

export function Features({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[var(--app-foreground)] mb-2">
          ✨ Özellikler
        </h1>
        <p className="text-[var(--app-foreground-muted)]">
          CAI'nın tüm özellikleri
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-[var(--app-card-bg)] rounded-lg p-4 border border-[var(--app-card-border)]">
          <h3 className="font-medium text-[var(--app-foreground)] mb-2">🤖 AI Asistan</h3>
          <p className="text-sm text-[var(--app-foreground-muted)]">
            OpenAI GPT ile güçlendirilmiş, çay kültürü konusunda uzman AI asistan
          </p>
        </div>

        <div className="bg-[var(--app-card-bg)] rounded-lg p-4 border border-[var(--app-card-border)]">
          <h3 className="font-medium text-[var(--app-foreground)] mb-2">🎭 Komik Yanıtlar</h3>
          <p className="text-sm text-[var(--app-foreground-muted)]">
            Meme'ler ve emoji'lerle zenginleştirilmiş eğlenceli yanıtlar
          </p>
        </div>

        <div className="bg-[var(--app-card-bg)] rounded-lg p-4 border border-[var(--app-card-border)]">
          <h3 className="font-medium text-[var(--app-foreground)] mb-2">👥 Community</h3>
          <p className="text-sm text-[var(--app-foreground-muted)]">
            Çay severlerin soru ve yanıtlarını paylaştığı platform
          </p>
        </div>

        <div className="bg-[var(--app-card-bg)] rounded-lg p-4 border border-[var(--app-card-border)]">
          <h3 className="font-medium text-[var(--app-foreground)] mb-2">🏆 NFT Ödüller</h3>
          <p className="text-sm text-[var(--app-foreground-muted)]">
            En çok beğenilen yanıtlar için blockchain tabanlı NFT ödülleri
          </p>
        </div>

        <div className="bg-[var(--app-card-bg)] rounded-lg p-4 border border-[var(--app-card-border)]">
          <h3 className="font-medium text-[var(--app-foreground)] mb-2">🔗 Blockchain Entegrasyonu</h3>
          <p className="text-sm text-[var(--app-foreground-muted)]">
            Base blockchain üzerinde güvenli ve şeffaf işlemler
          </p>
        </div>
      </div>

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
