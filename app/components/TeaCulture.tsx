"use client";

import { useState, useCallback } from "react";
import { Button } from "./DemoComponents";
import { Icon } from "./DemoComponents";
import { useAccount } from "wagmi";
import { useNotification } from "@coinbase/onchainkit/minikit";

type TeaType = {
  id: number;
  name: string;
  origin: string;
  description: string;
  brewingTime: string;
  temperature: string;
  benefits: string[];
  image: string;
};

type TeaSession = {
  id: string;
  teaType: string;
  timestamp: number;
  notes: string;
  rating: number;
  blockchainHash?: string;
};

const teaTypes: TeaType[] = [
  {
    id: 1,
    name: "Yeşil Çay",
    origin: "Çin",
    description: "Taze ve hafif aromalı, antioksidan açısından zengin",
    brewingTime: "2-3 dakika",
    temperature: "70-80°C",
    benefits: ["Antioksidan", "Metabolizma", "Odaklanma"],
    image: "🍃"
  },
  {
    id: 2,
    name: "Siyah Çay",
    origin: "Hindistan",
    description: "Güçlü ve koyu aromalı, kafein içerikli",
    brewingTime: "3-5 dakika",
    temperature: "90-95°C",
    benefits: ["Enerji", "Uyanıklık", "Kalp sağlığı"],
    image: "🫖"
  },
  {
    id: 3,
    name: "Oolong Çay",
    origin: "Tayvan",
    description: "Yarı fermente, karmaşık aromalar",
    brewingTime: "3-4 dakika",
    temperature: "85-90°C",
    benefits: ["Kilo kontrolü", "Sindirim", "Detoks"],
    image: "🌿"
  },
  {
    id: 4,
    name: "Beyaz Çay",
    origin: "Çin",
    description: "En az işlenmiş, narin ve tatlı",
    brewingTime: "4-5 dakika",
    temperature: "65-70°C",
    benefits: ["Cilt sağlığı", "Bağışıklık", "Anti-aging"],
    image: "🌸"
  }
];

type TeaCultureProps = {
  setActiveTab: (tab: string) => void;
};

export function TeaCulture({ setActiveTab }: TeaCultureProps) {
  const [selectedTea, setSelectedTea] = useState<TeaType | null>(null);
  const [teaSessions, setTeaSessions] = useState<TeaSession[]>([]);
  const [currentSession, setCurrentSession] = useState<TeaSession | null>(null);
  const [sessionNotes, setSessionNotes] = useState("");
  const [sessionRating, setSessionRating] = useState(5);
  const { address } = useAccount();
  const sendNotification = useNotification();

  const startTeaSession = useCallback((tea: TeaType) => {
    const session: TeaSession = {
      id: crypto.randomUUID(),
      teaType: tea.name,
      timestamp: Date.now(),
      notes: "",
      rating: 5
    };
    setCurrentSession(session);
    setSelectedTea(tea);
  }, []);

  const endTeaSession = useCallback(async () => {
    if (!currentSession || !address) return;

    const completedSession: TeaSession = {
      ...currentSession,
      notes: sessionNotes,
      rating: sessionRating,
      timestamp: Date.now()
    };

    setTeaSessions(prev => [completedSession, ...prev]);
    setCurrentSession(null);
    setSelectedTea(null);
    setSessionNotes("");
    setSessionRating(5);

    // Blockchain'e log kaydı gönder
    try {
      const response = await fetch('/api/tea-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session: completedSession,
          address: address
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.hash) {
          // Session'a blockchain hash'ini ekle
          setTeaSessions(prev => 
            prev.map(s => 
              s.id === completedSession.id 
                ? { ...s, blockchainHash: result.hash }
                : s
            )
          );
        }
      }
    } catch (error) {
      console.error('Blockchain logging failed:', error);
    }

    // Bildirim gönder
    await sendNotification({
      title: "Çay Seansı Tamamlandı! 🍵",
      body: `${completedSession.teaType} çayınızı ${completedSession.rating}/5 yıldızla değerlendirdiniz.`,
    });
  }, [currentSession, sessionNotes, sessionRating, address, sendNotification]);

  const cancelSession = useCallback(() => {
    setCurrentSession(null);
    setSelectedTea(null);
    setSessionNotes("");
    setSessionRating(5);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[var(--app-foreground)] mb-2">
          🍵 Çay Kültürü
        </h1>
        <p className="text-[var(--app-foreground-muted)]">
          Geleneksel çay kültürünü keşfedin ve deneyimlerinizi blockchain'e kaydedin
        </p>
      </div>

      {!currentSession ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            {teaTypes.map((tea) => (
              <div
                key={tea.id}
                className="bg-[var(--app-card-bg)] rounded-lg p-4 border border-[var(--app-card-border)] cursor-pointer hover:border-[var(--app-accent)] transition-colors"
                onClick={() => startTeaSession(tea)}
              >
                <div className="text-3xl text-center mb-2">{tea.image}</div>
                <h3 className="font-medium text-[var(--app-foreground)] text-center">
                  {tea.name}
                </h3>
                <p className="text-xs text-[var(--app-foreground-muted)] text-center mt-1">
                  {tea.origin}
                </p>
              </div>
            ))}
          </div>

          {teaSessions.length > 0 && (
            <div className="bg-[var(--app-card-bg)] rounded-lg p-4 border border-[var(--app-card-border)]">
              <h3 className="font-medium text-[var(--app-foreground)] mb-3">
                Son Çay Seanslarınız
              </h3>
              <div className="space-y-2">
                {teaSessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{session.teaType}</span>
                      <span className="text-[var(--app-foreground-muted)] ml-2">
                        {new Date(session.timestamp).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < session.rating ? "text-yellow-400" : "text-gray-400"}>
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-[var(--app-card-bg)] rounded-lg p-4 border border-[var(--app-card-border)]">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">{selectedTea?.image}</div>
            <h3 className="text-xl font-medium text-[var(--app-foreground)]">
              {selectedTea?.name} Çay Seansı
            </h3>
            <p className="text-[var(--app-foreground-muted)] text-sm">
              {selectedTea?.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[var(--app-foreground-muted)]">Demleme Süresi:</span>
                <p className="font-medium">{selectedTea?.brewingTime}</p>
              </div>
              <div>
                <span className="text-[var(--app-foreground-muted)]">Sıcaklık:</span>
                <p className="font-medium">{selectedTea?.temperature}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--app-foreground)] mb-2">
                Notlarınız
              </label>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Çay deneyiminiz hakkında notlar..."
                className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--app-foreground)] mb-2">
                Değerlendirme
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSessionRating(rating)}
                    className={`text-2xl ${rating <= sessionRating ? "text-yellow-400" : "text-gray-400"}`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="primary"
                onClick={endTeaSession}
                className="flex-1"
              >
                Seansı Tamamla
              </Button>
              <Button
                variant="outline"
                onClick={cancelSession}
                className="flex-1"
              >
                İptal Et
              </Button>
            </div>
          </div>
        </div>
      )}

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
