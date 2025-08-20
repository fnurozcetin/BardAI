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
  parseAbiItem("function logTeaSession(string memory teaType, uint8 rating, string memory notes, address user) external"),
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { session, address } = body;

    if (!session || !address) {
      return NextResponse.json(
        { error: "Session ve address gerekli" },
        { status: 400 }
      );
    }

    // Mock blockchain transaction - gerçek uygulamada gerçek kontrat çağrısı yapılır
    const mockTransactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Log the session data
    console.log("Çay seansı blockchain'e kaydedildi:", {
      teaType: session.teaType,
      rating: session.rating,
      notes: session.notes,
      user: address,
      timestamp: session.timestamp,
      hash: mockTransactionHash
    });

    // Return success with mock hash
    return NextResponse.json({
      success: true,
      hash: mockTransactionHash,
      message: "Çay seansı başarıyla blockchain'e kaydedildi"
    });

  } catch (error) {
    console.error("Tea session logging failed:", error);
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

    // Mock tea sessions data - gerçek uygulamada blockchain'den veri çekilir
    const mockSessions = [
      {
        id: "1",
        teaType: "Yeşil Çay",
        rating: 5,
        notes: "Harika bir deneyimdi",
        timestamp: Date.now() - 3600000,
        hash: "0x1234...5678"
      },
      {
        id: "2", 
        teaType: "Siyah Çay",
        rating: 4,
        notes: "Güçlü aroma",
        timestamp: Date.now() - 7200000,
        hash: "0x8765...4321"
      }
    ];

    return NextResponse.json({
      success: true,
      sessions: mockSessions
    });

  } catch (error) {
    console.error("Tea sessions fetch failed:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Bilinmeyen hata",
      },
      { status: 500 }
    );
  }
}
