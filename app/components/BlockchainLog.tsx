"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "./DemoComponents";
import { Icon } from "./DemoComponents";
import { useAccount } from "wagmi";
import { useNotification } from "@coinbase/onchainkit/minikit";

type LogEntry = {
  id: string;
  type: "tea-session" | "ai-conversation" | "blockchain-transaction";
  title: string;
  description: string;
  timestamp: number;
  blockchainHash?: string;
  status: "pending" | "confirmed" | "failed";
  metadata?: any;
};

type BlockchainLogProps = {
  setActiveTab: (tab: string) => void;
};

const mockLogs: LogEntry[] = [
  {
    id: "1",
    type: "tea-session",
    title: "Yeşil Çay Seansı",
    description: "Yeşil çay seansı tamamlandı ve blockchain'e kaydedildi",
    timestamp: Date.now() - 3600000, // 1 saat önce
    blockchainHash: "0x1234...5678",
    status: "confirmed",
    metadata: {
      teaType: "Yeşil Çay",
      rating: 5,
      notes: "Harika bir deneyimdi"
    }
  },
  {
    id: "2",
    type: "ai-conversation",
    title: "Çay Demleme Sorusu",
    description: "AI asistan ile çay demleme hakkında konuşuldu",
    timestamp: Date.now() - 7200000, // 2 saat önce
    blockchainHash: "0x8765...4321",
    status: "confirmed",
    metadata: {
      question: "Çay ne kadar süre demlenmeli?",
      response: "Çay türüne göre 2-5 dakika arası"
    }
  },
  {
    id: "3",
    type: "blockchain-transaction",
    title: "Base Network İşlemi",
    description: "Çay kültürü NFT'si oluşturuldu",
    timestamp: Date.now() - 10800000, // 3 saat önce
    blockchainHash: "0xabcd...efgh",
    status: "confirmed",
    metadata: {
      nftName: "Çay Kültürü #001",
      contractAddress: "0x9876...5432"
    }
  }
];

export function BlockchainLog({ setActiveTab }: BlockchainLogProps) {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [filterType, setFilterType] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { address } = useAccount();
  const sendNotification = useNotification();

  const fetchLogs = useCallback(async () => {
    if (!address) return;

    setIsRefreshing(true);
    try {
      const response = await fetch(`/api/blockchain-logs?address=${address}`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || mockLogs);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [address]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return "✅";
      case "pending":
        return "⏳";
      case "failed":
        return "❌";
      default:
        return "❓";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "tea-session":
        return "🍵";
      case "ai-conversation":
        return "🤖";
      case "blockchain-transaction":
        return "⛓️";
      default:
        return "📝";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "tea-session":
        return "Çay Seansı";
      case "ai-conversation":
        return "AI Konuşması";
      case "blockchain-transaction":
        return "Blockchain İşlemi";
      default:
        return "Bilinmeyen";
    }
  };

  const filteredLogs = logs.filter(log => 
    filterType === "all" || log.type === filterType
  );

  const handleRefresh = useCallback(async () => {
    await fetchLogs();
    await sendNotification({
      title: "Loglar Yenilendi! 🔄",
      body: "Blockchain log kayıtları güncellendi.",
    });
  }, [fetchLogs, sendNotification]);

  const handleViewOnExplorer = useCallback((hash: string) => {
    const baseExplorerUrl = "https://basescan.org/tx/";
    window.open(baseExplorerUrl + hash, "_blank");
  }, []);

  const getLogDetails = (log: LogEntry) => {
    switch (log.type) {
      case "tea-session":
        return (
          <div className="text-xs text-[var(--app-foreground-muted)]">
            <p>Çay Türü: {log.metadata?.teaType}</p>
            <p>Değerlendirme: {log.metadata?.rating}/5 ⭐</p>
            {log.metadata?.notes && <p>Notlar: {log.metadata.notes}</p>}
          </div>
        );
      case "ai-conversation":
        return (
          <div className="text-xs text-[var(--app-foreground-muted)]">
            <p>Soru: {log.metadata?.question}</p>
            <p>Yanıt: {log.metadata?.response}</p>
          </div>
        );
      case "blockchain-transaction":
        return (
          <div className="text-xs text-[var(--app-foreground-muted)]">
            <p>NFT: {log.metadata?.nftName}</p>
            <p>Kontrat: {log.metadata?.contractAddress}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[var(--app-foreground)] mb-2">
          ⛓️ Blockchain Log
        </h1>
        <p className="text-[var(--app-foreground-muted)]">
          Base blockchain üzerindeki tüm işlemlerinizi takip edin
        </p>
      </div>

      <div className="bg-[var(--app-card-bg)] rounded-lg p-4 border border-[var(--app-card-border)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-[var(--app-foreground)]">
            Filtrele
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            icon={<Icon name="plus" size="sm" />}
          >
            {isRefreshing ? "Yenileniyor..." : "Yenile"}
          </Button>
        </div>

        <div className="flex space-x-2 mb-4">
          {["all", "tea-session", "ai-conversation", "blockchain-transaction"].map((type) => (
            <Button
              key={type}
              variant={filterType === type ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilterType(type)}
              className="text-xs"
            >
              {type === "all" ? "Tümü" : getTypeLabel(type)}
            </Button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-[var(--app-foreground-muted)]">
              <div className="text-4xl mb-2">📝</div>
              <p>Henüz log kaydı bulunmuyor</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="bg-[var(--app-gray)] rounded-lg p-3 border border-[var(--app-card-border)]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getTypeIcon(log.type)}</span>
                    <div>
                      <h4 className="font-medium text-[var(--app-foreground)] text-sm">
                        {log.title}
                      </h4>
                      <p className="text-xs text-[var(--app-foreground-muted)]">
                        {new Date(log.timestamp).toLocaleString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{getStatusIcon(log.status)}</span>
                    <span className="text-xs text-[var(--app-foreground-muted)]">
                      {log.status === "confirmed" ? "Onaylandı" : 
                       log.status === "pending" ? "Bekliyor" : "Başarısız"}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-[var(--app-foreground-muted)] mb-2">
                  {log.description}
                </p>

                {getLogDetails(log)}

                {log.blockchainHash && (
                  <div className="mt-3 pt-2 border-t border-[var(--app-card-border)]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--app-foreground-muted)]">
                        Hash: {log.blockchainHash}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewOnExplorer(log.blockchainHash!)}
                        className="text-xs"
                      >
                        Explorer'da Gör
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-[var(--app-card-bg)] rounded-lg p-4 border border-[var(--app-card-border)]">
        <h3 className="font-medium text-[var(--app-foreground)] mb-3">
          Blockchain İstatistikleri
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--app-accent)]">
              {logs.filter(l => l.status === "confirmed").length}
            </div>
            <div className="text-[var(--app-foreground-muted)]">Onaylanan İşlem</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--app-accent)]">
              {logs.filter(l => l.type === "tea-session").length}
            </div>
            <div className="text-[var(--app-foreground-muted)]">Çay Seansı</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--app-accent)]">
              {logs.filter(l => l.type === "ai-conversation").length}
            </div>
            <div className="text-[var(--app-foreground-muted)]">AI Konuşması</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--app-accent)]">
              {logs.filter(l => l.type === "blockchain-transaction").length}
            </div>
            <div className="text-[var(--app-foreground-muted)]">NFT İşlemi</div>
          </div>
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
