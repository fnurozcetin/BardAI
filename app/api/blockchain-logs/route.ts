import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

// Base network client
const client = createPublicClient({
  chain: base,
  transport: http(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Address parametresi gerekli" },
        { status: 400 }
      );
    }

    // Mock blockchain logs data - gerçek uygulamada blockchain'den veri çekilir
    const mockLogs = [
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
      },
      {
        id: "4",
        type: "tea-session",
        title: "Siyah Çay Seansı",
        description: "Siyah çay seansı tamamlandı ve blockchain'e kaydedildi",
        timestamp: Date.now() - 14400000, // 4 saat önce
        blockchainHash: "0xdef0...1234",
        status: "confirmed",
        metadata: {
          teaType: "Siyah Çay",
          rating: 4,
          notes: "Güçlü aroma, sabah için ideal"
        }
      },
      {
        id: "5",
        type: "ai-conversation",
        title: "Çay Saklama Sorusu",
        description: "AI asistan ile çay saklama hakkında konuşuldu",
        timestamp: Date.now() - 18000000, // 5 saat önce
        blockchainHash: "0x5678...9abc",
        status: "confirmed",
        metadata: {
          question: "Çay nasıl saklanmalı?",
          response: "Hava geçirmez, koyu renkli kaplarda serin ve kuru yerde saklayın"
        }
      }
    ];

    // Filter logs by address if needed (in real app, this would query blockchain)
    const userLogs = mockLogs.filter(log => {
      // Mock filtering - gerçek uygulamada blockchain'den kullanıcıya özel veriler çekilir
      return true;
    });

    return NextResponse.json({
      success: true,
      logs: userLogs,
      total: userLogs.length,
      address: address
    });

  } catch (error) {
    console.error("Blockchain logs fetch failed:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Bilinmeyen hata",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { logEntry, address } = body;

    if (!logEntry || !address) {
      return NextResponse.json(
        { error: "Log entry ve address gerekli" },
        { status: 400 }
      );
    }

    // Mock blockchain transaction - gerçek uygulamada gerçek kontrat çağrısı yapılır
    const mockTransactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Log the entry data
    console.log("Blockchain log entry kaydedildi:", {
      logEntry,
      user: address,
      timestamp: Date.now(),
      hash: mockTransactionHash
    });

    // Return success with mock hash
    return NextResponse.json({
      success: true,
      hash: mockTransactionHash,
      message: "Log entry başarıyla blockchain'e kaydedildi"
    });

  } catch (error) {
    console.error("Blockchain log entry logging failed:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Bilinmeyen hata",
      },
      { status: 500 }
    );
  }
}
