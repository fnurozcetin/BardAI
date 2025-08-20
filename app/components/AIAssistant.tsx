"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "./DemoComponents";
import { Icon } from "./DemoComponents";
import { useAccount } from "wagmi";
import { useNotification } from "@coinbase/onchainkit/minikit";

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
  teaRecommendation?: TeaRecommendation;
};

type TeaRecommendation = {
  teaType: string;
  reason: string;
  brewingTips: string;
  benefits: string[];
};

type AIAssistantProps = {
  setActiveTab: (tab: string) => void;
};

const teaKnowledgeBase = {
  "yeşil çay": {
    description: "Yeşil çay, minimal işlenmiş çay yapraklarından elde edilir. Antioksidan açısından zengindir ve metabolizmayı hızlandırır.",
    bestTime: "Sabah veya öğleden sonra",
    healthBenefits: ["Antioksidan", "Metabolizma", "Odaklanma", "Kalp sağlığı"],
    brewingTips: "70-80°C sıcaklıkta 2-3 dakika demleyin. Acı olmaması için uzun süre demlemeyin."
  },
  "siyah çay": {
    description: "Siyah çay tam fermente edilmiş çay yapraklarından yapılır. Güçlü aroma ve kafein içeriği ile bilinir.",
    bestTime: "Sabah veya erken öğleden sonra",
    healthBenefits: ["Enerji", "Uyanıklık", "Kalp sağlığı", "Bağışıklık"],
    brewingTips: "90-95°C sıcaklıkta 3-5 dakika demleyin. Süt ve şeker ile servis edilebilir."
  },
  "oolong çay": {
    description: "Oolong çay yarı fermente edilmiş çaydır. Yeşil ve siyah çay arasında bir yerde durur.",
    bestTime: "Öğleden sonra veya akşam",
    healthBenefits: ["Kilo kontrolü", "Sindirim", "Detoks", "Cilt sağlığı"],
    brewingTips: "85-90°C sıcaklıkta 3-4 dakika demleyin. Çoklu demleme yapılabilir."
  },
  "beyaz çay": {
    description: "Beyaz çay en az işlenmiş çay türüdür. Narin ve tatlı aroması vardır.",
    bestTime: "Herhangi bir zaman",
    healthBenefits: ["Cilt sağlığı", "Bağışıklık", "Anti-aging", "Stres azaltma"],
    brewingTips: "65-70°C sıcaklıkta 4-5 dakika demleyin. Çok sıcak su kullanmayın."
  }
};

const commonQuestions = [
  "Hangi çay türü en sağlıklı?",
  "Çay ne zaman içilmeli?",
  "Çay demleme süresi ne kadar olmalı?",
  "Çayın faydaları nelerdir?",
  "Hangi çay uykuyu kaçırır?",
  "Çay nasıl saklanmalı?"
];

export function AIAssistant({ setActiveTab }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Merhaba! Ben BardAI, çay kültürü konusunda size yardımcı olmaya geldim. 🍵 Hangi konuda bilgi almak istersiniz?",
      isUser: false,
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();
  const sendNotification = useNotification();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = useCallback(async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Çay türü hakkında soru
    for (const [teaType, info] of Object.entries(teaKnowledgeBase)) {
      if (lowerMessage.includes(teaType)) {
        return `${teaType.charAt(0).toUpperCase() + teaType.slice(1)} hakkında bilgi:\n\n${info.description}\n\nEn iyi içim zamanı: ${info.bestTime}\n\nSağlık faydaları: ${info.healthBenefits.join(", ")}\n\nDemleme ipuçları: ${info.brewingTips}`;
      }
    }

    // Genel sorular
    if (lowerMessage.includes("sağlıklı") || lowerMessage.includes("en iyi")) {
      return "Tüm çay türleri sağlıklıdır, ancak yeşil çay antioksidan açısından en zengin olanıdır. Beyaz çay da minimal işlendiği için çok faydalıdır. Kişisel tercihlerinize ve sağlık hedeflerinize göre seçim yapabilirsiniz.";
    }

    if (lowerMessage.includes("ne zaman") || lowerMessage.includes("zaman")) {
      return "Çay içim zamanı çay türüne göre değişir:\n\n• Yeşil çay: Sabah veya öğleden sonra\n• Siyah çay: Sabah veya erken öğleden sonra\n• Oolong çay: Öğleden sonra veya akşam\n• Beyaz çay: Herhangi bir zaman\n\nKafein içeriği yüksek çayları akşam geç saatlerde içmemeye dikkat edin.";
    }

    if (lowerMessage.includes("demleme") || lowerMessage.includes("süre")) {
      return "Çay demleme süreleri:\n\n• Yeşil çay: 2-3 dakika\n• Siyah çay: 3-5 dakika\n• Oolong çay: 3-4 dakika\n• Beyaz çay: 4-5 dakika\n\nÇok uzun demlemek acı tat verebilir. Su sıcaklığı da önemlidir.";
    }

    if (lowerMessage.includes("fayda") || lowerMessage.includes("yarar")) {
      return "Çayın genel faydaları:\n\n• Antioksidan içerir\n• Kalp sağlığını destekler\n• Metabolizmayı hızlandırır\n• Bağışıklık sistemini güçlendirir\n• Stresi azaltır\n• Odaklanmayı artırır\n\nHer çay türünün kendine özgü faydaları da vardır.";
    }

    if (lowerMessage.includes("uyku") || lowerMessage.includes("kaçırır")) {
      return "Siyah çay ve yeşil çay kafein içerir ve uykuyu kaçırabilir. Akşam saatlerinde kafeinsiz bitki çayları (papatya, melisa, ıhlamur) tercih edebilirsiniz. Beyaz çay da daha az kafein içerir.";
    }

    if (lowerMessage.includes("sakla") || lowerMessage.includes("muhafaza")) {
      return "Çayı saklama önerileri:\n\n• Hava geçirmez, koyu renkli kaplarda saklayın\n• Serin, kuru ve karanlık bir yerde tutun\n• Güçlü kokulara yakın tutmayın\n• Buzdolabında saklamayın (nem yapabilir)\n• Açıldıktan sonra 6-12 ay içinde tüketin";
    }

    // Çay önerisi
    if (lowerMessage.includes("öner") || lowerMessage.includes("tavsiye")) {
      const recommendations = [
        "Sabah enerji için: Siyah çay",
        "Öğleden sonra odaklanma için: Yeşil çay", 
        "Akşam rahatlama için: Beyaz çay",
        "Kilo kontrolü için: Oolong çay"
      ];
      return `Çay önerilerim:\n\n${recommendations.join('\n')}\n\nHangi durumda çay içmek istediğinizi belirtirseniz daha spesifik öneriler verebilirim.`;
    }

    // Varsayılan yanıt
    return "Çay kültürü hakkında daha spesifik bir soru sorabilir misiniz? Örneğin:\n\n• Hangi çay türü hakkında bilgi almak istiyorsunuz?\n• Çay demleme konusunda yardıma mı ihtiyacınız var?\n• Belirli bir sağlık faydası mı arıyorsunuz?\n\nSize en iyi şekilde yardımcı olmaya çalışacağım! 🍵";
  };

  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: inputText.trim(),
      isUser: true,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(userMessage.text);
      
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        text: aiResponse,
        isUser: false,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);

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
              timestamp: Date.now()
            }),
          });
        } catch (error) {
          console.error('Blockchain logging failed:', error);
        }
      }

      // Bildirim gönder
      await sendNotification({
        title: "AI Asistan Yanıtladı! 🤖",
        body: "Çay kültürü hakkında sorunuz yanıtlandı.",
      });

    } catch (error) {
      console.error('AI response generation failed:', error);
      
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: "Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.",
        isUser: false,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-[var(--app-foreground)] mb-2">
          🤖 BardAI Asistan
        </h1>
        <p className="text-[var(--app-foreground-muted)]">
          Çay kültürü hakkında her şeyi öğrenin
        </p>
      </div>

      <div className="bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)] h-96 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
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
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[var(--app-gray)] rounded-lg px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[var(--app-foreground-muted)] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[var(--app-foreground-muted)] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-[var(--app-foreground-muted)] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
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
              placeholder="Çay hakkında bir soru sorun..."
              className="flex-1 px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
              disabled={isLoading}
            />
            <Button
              variant="primary"
              onClick={handleSendMessage}
              disabled={isLoading || !inputText.trim()}
              size="sm"
            >
              Gönder
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-[var(--app-card-bg)] rounded-lg p-4 border border-[var(--app-card-border)]">
        <h3 className="font-medium text-[var(--app-foreground)] mb-3">
          Hızlı Sorular
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {commonQuestions.map((question, index) => (
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

      <Button
        variant="ghost"
        onClick={() => setActiveTab("home")}
        className="w-full"
      >
        Ana Sayfaya Dön
      </Button>
    </div>
  );
}
