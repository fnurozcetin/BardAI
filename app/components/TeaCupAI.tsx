"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "./DemoComponents";
import { Icon } from "./DemoComponents";
import { useAccount } from "wagmi";
import { useNotification } from "@coinbase/onchainkit/minikit";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Trophy, Coffee } from "lucide-react";
import React from "react";

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
  likes: number;
  isLiked: boolean;
  isShared: boolean;
};

type AIAssistantProps = {
  setActiveTab: (tab: string) => void;
};

const funnyTeaMemes = [
  "🍵 Çay içerken düşünen insan = Felsefeci",
  "☕ Sabah çayı olmadan = Zombi",
  "🫖 Çay demlerken = Kimyager",
  "🥤 Çay yerine kola = Heresy!",
  "🌿 Bitki çayı = Hippie mode activated",
  "🍃 Yeşil çay = Zen master",
  "⚫ Siyah çay = British mode",
  "🟡 Limonlu çay = Vitamin bomb"
];

const teaQuestions = [
  "Çay neden bu kadar harika? 🤔",
  "Hangi çay en komik? 😄",
  "Çay içerken ne düşünürsün? 🧠",
  "Çay vs kahve savaşı? ⚔️",
  "Çay demleme sanatı nasıl? 🎨",
  "Çay kültürü neden önemli? 🌍"
];

export function TeaCupAI({ setActiveTab }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Merhaba! Ben CAI ☕\n\nÇay hakkında her şeyi biliyorum ve komik yanıtlar veriyorum! 🎭\n\nHangi konuda yardıma ihtiyacın var? (Meme garantili! 😂)",
      isUser: false,
      timestamp: Date.now(),
      likes: 42,
      isLiked: false,
      isShared: false
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [teaCupAnimation, setTeaCupAnimation] = useState(false);
  const { address } = useAccount();
  const sendNotification = useNotification();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateFallbackResponse = useCallback((userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Çay türleri hakkında komik yanıtlar
    if (lowerMessage.includes("yeşil") || lowerMessage.includes("green")) {
      return `🍃 Yeşil çay hakkında mı? Ah, bu zen master'ların favorisi! 🧘‍♂️\n\nYeşil çay o kadar sağlıklı ki, içtikten sonra kendini yoga yaparken bulabilirsin! 😂\n\nAma dikkat et, çok içersen kendini bir ağaç gibi hissetmeye başlayabilirsin 🌳\n\n*Çay bardağından zen enerjisi yayılıyor* ✨`;
    }

    if (lowerMessage.includes("siyah") || lowerMessage.includes("black")) {
      return `⚫ Siyah çay! British Empire'ın gururu! 🇬🇧\n\nBu çay o kadar güçlü ki, içtikten sonra kendini Buckingham Palace'da çay partisi verirken bulabilirsin! 🫖\n\nAma dikkat et, çok içersen aksanın İngilizce olmaya başlayabilir! "Would you like some tea, old chap?" 😂\n\n*Çay bardağından British vibes yayılıyor* 🎩`;
    }

    if (lowerMessage.includes("oolong")) {
      return `🟠 Oolong çay! Çay dünyasının en kararsızı! 🤷‍♂️\n\nBu çay o kadar kararsız ki, demlenirken bile "Ben yeşil miyim siyah mı?" diye düşünüyor! 😅\n\nAma bu kararsızlık onu özel yapıyor! Hem yeşil çayın sağlığını hem de siyah çayın gücünü birleştiriyor! 💪\n\n*Çay bardağından kararsızlık enerjisi yayılıyor* 🤔`;
    }

    if (lowerMessage.includes("beyaz") || lowerMessage.includes("white")) {
      return `⚪ Beyaz çay! Çay dünyasının en naif ve masum olanı! 😇\n\nBu çay o kadar saf ki, içtikten sonra kendini bir bebek gibi hissetmeye başlayabilirsin! 👶\n\nAma dikkat et, çok saf olduğu için kötü niyetli çay bardakları tarafından kandırılabilir! 😂\n\n*Çay bardağından masumiyet enerjisi yayılıyor* ✨`;
    }

    // Genel komik yanıtlar
    if (lowerMessage.includes("sağlık") || lowerMessage.includes("fayda")) {
      return `🏥 Çayın faydaları mı? Ah, bu konuda çok şey biliyorum! 📚\n\nÇay o kadar sağlıklı ki:\n• İçtikten sonra kendini süper kahraman gibi hissedersin! 🦸‍♂️\n• Yaşlanmayı yavaşlatır (ama çay bardağı yaşlanmaz!) 😂\n• Stresi azaltır (çay içerken stres yapmak imkansız!) 😌\n• Kalbi güçlendirir (çay kalbi, gerçek kalp değil!) 💚\n\n*Çay bardağından sağlık enerjisi yayılıyor* 💪`;
    }

    if (lowerMessage.includes("demleme") || lowerMessage.includes("nasıl")) {
      return `🫖 Çay demleme sanatı! Ah, bu ciddi bir iş! 🎨\n\nÇay demleme adımları:\n1. Suyu kaynat (ama çok kaynatma, su kızacak!) 😤\n2. Çay yapraklarını ekle (ama çok ekleme, çay bardağı taşacak!) 🌊\n3. Bekle (ama çok bekleme, çay sıkılacak!) 😴\n4. İç (ama çok içme, tuvalet sırası bekleyeceksin!) 🚽\n\n*Çay bardağından sanat enerjisi yayılıyor* 🎭`;
    }

    if (lowerMessage.includes("zaman") || lowerMessage.includes("ne zaman")) {
      return `⏰ Çay içme zamanı! Bu çok önemli bir konu! 🕐\n\nÇay içme zamanları:\n• Sabah: Uyanmak için (kahve yerine çay! Take that, coffee!) ☕\n• Öğle: Enerji için (siesta yerine çay!) 💪\n• Akşam: Rahatlamak için (alkol yerine çay! Sağlıklı yaşam!) 🧘‍♀️\n• Gece: Uyumak için (ama kafeinli çay değil, yoksa sabaha kadar uyuyamazsın!) 😴\n\n*Çay bardağından zaman enerjisi yayılıyor* ⏳`;
    }

    if (lowerMessage.includes("meme") || lowerMessage.includes("komik")) {
      const randomMeme = funnyTeaMemes[Math.floor(Math.random() * funnyTeaMemes.length)];
      return `😂 Meme zamanı! İşte senin için özel bir çay meme'i:\n\n${randomMeme}\n\n*Çay bardağından meme enerjisi yayılıyor* 🎭\n\nBaşka meme ister misin? Ben çay bardağı olarak çok komikim! 😄`;
    }

    // Varsayılan komik yanıt
    const randomResponses = [
      "Hmm, bu konuda düşünmem gerekiyor... *çay bardağı düşünme moduna geçiyor* 🤔",
      "Ah, bu ilginç bir soru! *çay bardağından bilgelik buharı çıkıyor* 💭",
      "Çay bardağı olarak bu konuda çok şey biliyorum! *gururla şişiyor* 😤",
      "Bu soru için özel bir çay demleyeyim... *çay demleme ritüeli başlıyor* 🫖",
      "Çay kültüründe bu konu çok önemli! *çay bardağından kültür enerjisi yayılıyor* 🌍"
    ];
    
    const randomResponse = randomResponses[Math.floor(Math.random() * randomResponses.length)];
    return `${randomResponse}\n\nAma gerçekten, çay hakkında ne öğrenmek istiyorsun? Ben buradayım ve hazırım! ☕✨`;
  }, []);

  const generateFunnyResponse = useCallback(async (userMessage: string): Promise<string> => {
    try {
      // OpenAI API'yi kullan
      const response = await fetch('/api/tea-cup-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages.filter((m: Message) => m.id !== 'welcome')
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      if (data.success) {
        return data.response;
      } else {
        // Fallback yanıt
        return generateFallbackResponse(userMessage);
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fallback yanıt
      return generateFallbackResponse(userMessage);
    }
  }, [messages, generateFallbackResponse]);

  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: inputText.trim(),
      isUser: true,
      timestamp: Date.now(),
      likes: 0,
      isLiked: false,
      isShared: false
    };

    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    setTeaCupAnimation(true);

    try {
      const aiResponse = await generateFunnyResponse(userMessage.text);
      
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        text: aiResponse,
        isUser: false,
        timestamp: Date.now(),
        likes: Math.floor(Math.random() * 50) + 10,
        isLiked: false,
        isShared: false
      };

      setMessages((prev: Message[]) => [...prev, aiMessage]);

      // Blockchain'e log kaydı gönder
      if (address) {
        try {
          await fetch('/api/ai-conversation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userMessage: userMessage.text,
              aiResponse: aiResponse,
              address: address,
              timestamp: Date.now(),
              type: 'tea-cup-ai'
            }),
          });
        } catch (error) {
          console.error('Blockchain logging failed:', error);
        }
      }

      // Bildirim gönder
      await sendNotification({
        title: "CAI Yanıtladı! ☕",
        body: "Komik yanıtın hazır!",
      });

    } catch (error) {
      console.error('AI response generation failed:', error);
      
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: "Üzgünüm, şu anda yanıt veremiyorum. Çay bardağım bozuldu! 😅 Lütfen daha sonra tekrar deneyin.",
        isUser: false,
        timestamp: Date.now(),
        likes: 0,
        isLiked: false,
        isShared: false
      };

      setMessages((prev: Message[]) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => setTeaCupAnimation(false), 1000);
    }
  }, [inputText, isLoading, generateFunnyResponse, address, sendNotification]);

  const handleLike = useCallback((messageId: string) => {
    setMessages((prev: Message[]) => prev.map((msg: Message) => 
      msg.id === messageId 
        ? { ...msg, likes: msg.isLiked ? msg.likes - 1 : msg.likes + 1, isLiked: !msg.isLiked }
        : msg
    ));
  }, []);

  const handleShare = useCallback((messageId: string) => {
    setMessages((prev: Message[]) => prev.map((msg: Message) => 
      msg.id === messageId 
        ? { ...msg, isShared: !msg.isShared }
        : msg
    ));
    
    sendNotification({
      title: "Mesaj Paylaşıldı! 📤",
      body: "Çay kültürü yayılıyor!",
    });
  }, [sendNotification]);

  const handleQuickQuestion = useCallback((question: string) => {
    setInputText(question);
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <motion.div
          animate={teaCupAnimation ? { rotate: [0, -10, 10, -10, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="inline-block mb-4"
        >
          <div className="text-6xl">☕</div>
        </motion.div>
        <h1 className="text-2xl font-bold text-[var(--app-foreground)] mb-2">
          ☕ CAI
        </h1>
        <p className="text-[var(--app-foreground-muted)]">
          Çay hakkında komik yanıtlar ve meme'ler! 🎭
        </p>
      </div>

      <div className="bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)] h-96 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  message.isUser
                    ? 'bg-[var(--app-accent)] text-[var(--app-background)]'
                    : 'bg-[var(--app-gray)] text-[var(--app-foreground)]'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString('tr-TR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {!message.isUser && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleLike(message.id)}
                        className={`flex items-center space-x-1 text-xs ${
                          message.isLiked ? 'text-red-500' : 'text-gray-500'
                        } hover:text-red-500 transition-colors`}
                      >
                        <Heart size={12} className={message.isLiked ? 'fill-current' : ''} />
                        <span>{message.likes}</span>
                      </button>
                      <button
                        onClick={() => handleShare(message.id)}
                        className={`flex items-center space-x-1 text-xs ${
                          message.isShared ? 'text-blue-500' : 'text-gray-500'
                        } hover:text-blue-500 transition-colors`}
                      >
                        <Share2 size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div 
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="bg-[var(--app-gray)] rounded-lg px-3 py-2">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl animate-bounce">☕</div>
                  <div className="text-sm">Çay demleniyor...</div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-[var(--app-card-border)]">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Çay hakkında komik bir soru sorun... ☕"
              className="flex-1 px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
              disabled={isLoading}
            />
            <Button
              variant="primary"
              onClick={handleSendMessage}
              disabled={isLoading || !inputText.trim()}
              size="sm"
            >
              ☕
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-[var(--app-card-bg)] rounded-lg p-4 border border-[var(--app-card-border)]">
        <h3 className="font-medium text-[var(--app-foreground)] mb-3 flex items-center">
          <Coffee size={16} className="mr-2" />
          Hızlı Sorular
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {teaQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickQuestion(question)}
              className="text-xs text-left h-auto py-2"
              disabled={isLoading}
            >
              {question}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-4 text-white text-center">
        <h3 className="font-bold mb-2">🏆 NFT Ödül Sistemi</h3>
        <p className="text-sm opacity-90">
          En çok beğenilen yanıtlar NFT kazanır! Community sekmesine git ve katıl!
        </p>
        <Button
          variant="ghost"
          onClick={() => setActiveTab("community")}
          className="mt-3 text-white border-white hover:bg-white hover:text-green-500"
        >
          Community'e Git 👥
        </Button>
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
