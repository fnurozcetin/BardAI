import { NextResponse } from "next/server";
import { createPublicClient, http, parseAbiItem } from "viem";
import { base } from "viem/chains";

// Base network client
const client = createPublicClient({
  chain: base,
  transport: http(),
});

// Mock contract address - gerçek uygulamada gerçek kontrat adresi kullanılır
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

// Mock ABI - gerçek uygulamada gerçek ABI kullanılır
const CONTRACT_ABI = [
  parseAbiItem("function logAIConversation(string memory question, string memory response, address user) external"),
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userMessage, aiResponse, address, timestamp } = body;

    if (!userMessage || !aiResponse || !address) {
      return NextResponse.json(
        { error: "Kullanıcı mesajı, AI yanıtı ve address gerekli" },
        { status: 400 }
      );
    }

    // Mock blockchain transaction - gerçek uygulamada gerçek kontrat çağrısı yapılır
    const mockTransactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Log the conversation data
    console.log("AI konuşması blockchain'e kaydedildi:", {
      userMessage,
      aiResponse,
      user: address,
      timestamp,
      hash: mockTransactionHash
    });

    // Return success with mock hash
    return NextResponse.json({
      success: true,
      hash: mockTransactionHash,
      message: "AI konuşması başarıyla blockchain'e kaydedildi"
    });

  } catch (error) {
    console.error("AI conversation logging failed:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Bilinmeyen hata",
      },
      { status: 500 }
    );
  }
}

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

    // Mock AI conversations data - gerçek uygulamada blockchain'den veri çekilir
    const mockConversations = [
      {
        id: "1",
        question: "Hangi çay türü en sağlıklı?",
        response: "Yeşil çay antioksidan açısından en zengin olanıdır.",
        timestamp: Date.now() - 3600000,
        hash: "0x1234...5678"
      },
      {
        id: "2",
        question: "Çay ne kadar süre demlenmeli?",
        response: "Çay türüne göre 2-5 dakika arası",
        timestamp: Date.now() - 7200000,
        hash: "0x8765...4321"
      }
    ];

    return NextResponse.json({
      success: true,
      conversations: mockConversations
    });

  } catch (error) {
    console.error("AI conversations fetch failed:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Bilinmeyen hata",
      },
      { status: 500 }
    );
  }
}
