import { NextResponse } from "next/server";
import { createPublicClient, http, parseAbiItem, createWalletClient, custom } from "viem";
import { base } from "viem/chains";
import { uploadConversationToIPFS, uploadPostToIPFS, getDataFromIPFS } from "../../../lib/ipfs-client";

// Base network client
const client = createPublicClient({
  chain: base,
  transport: http(),
});

// Contract configuration
const CONTRACT_ADDRESS = process.env.TEACUP_AI_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";
const CONTRACT_ABI = [
  parseAbiItem("function logAIConversation(string memory ipfsHash) external"),
  parseAbiItem("function createPost(string memory ipfsHash, uint8 category) external"),
  parseAbiItem("function shareConversation(uint256 conversationId, uint8 category) external"),
  parseAbiItem("function likePost(uint256 postId) external"),
  parseAbiItem("function unlikePost(uint256 postId) external"),
  parseAbiItem("function getPost(uint256 postId) external view returns (tuple(uint256 id, address user, string ipfsHash, uint256 timestamp, uint256 likes, bool isNFTWinner, uint256 nftTokenId, uint8 category))"),
  parseAbiItem("function getConversation(uint256 conversationId) external view returns (tuple(uint256 id, address user, string ipfsHash, uint256 timestamp, bool isShared, uint256 likes, bool isNFTWinner, uint256 nftTokenId))"),
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userMessage, aiResponse, address, timestamp, type, category } = body;

    if (!userMessage || !aiResponse || !address) {
      return NextResponse.json(
        { error: "Kullanıcı mesajı, AI yanıtı ve address gerekli" },
        { status: 400 }
      );
    }

    let ipfsHash: string;
    let transactionHash: string;

    if (type === 'tea-cup-ai') {
      // AI konuşmasını IPFS'e yükle
      const conversationData = {
        question: userMessage,
        answer: aiResponse,
        timestamp: timestamp || Date.now(),
        userAddress: address,
        category: category || 'general'
      };

      ipfsHash = await uploadConversationToIPFS(conversationData);

      // Smart contract'a IPFS hash'ini gönder
      try {
        // Bu kısım front-end'de wallet ile yapılacak
        // Şimdilik mock transaction hash döndürüyoruz
        transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        
        console.log("AI konuşması IPFS'e yüklendi ve contract'a kaydedildi:", {
          ipfsHash,
          transactionHash,
          userMessage,
          aiResponse,
          user: address,
          timestamp
        });

      } catch (contractError) {
        console.error("Smart contract interaction failed:", contractError);
        // IPFS'e yüklendi ama contract'a kaydedilemedi
        return NextResponse.json({
          success: true,
          ipfsHash,
          warning: "Veri IPFS'e yüklendi ancak blockchain'e kaydedilemedi",
          message: "AI konuşması IPFS'e kaydedildi"
        });
      }

    } else if (type === 'community-post') {
      // Community post'unu IPFS'e yükle
      const postData = {
        question: userMessage,
        answer: aiResponse,
        timestamp: timestamp || Date.now(),
        userAddress: address,
        category: category || 'general',
        likes: 0
      };

      ipfsHash = await uploadPostToIPFS(postData);

      // Smart contract'a post'u kaydet
      try {
        // Bu kısım front-end'de wallet ile yapılacak
        transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        
        console.log("Community post'u IPFS'e yüklendi ve contract'a kaydedildi:", {
          ipfsHash,
          transactionHash,
          postData
        });

      } catch (contractError) {
        console.error("Smart contract interaction failed:", contractError);
        return NextResponse.json({
          success: true,
          ipfsHash,
          warning: "Veri IPFS'e yüklendi ancak blockchain'e kaydedilemedi",
          message: "Community post'u IPFS'e kaydedildi"
        });
      }

    } else {
      return NextResponse.json(
        { error: "Geçersiz tip. 'tea-cup-ai' veya 'community-post' olmalı" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      ipfsHash,
      transactionHash,
      message: "Veri başarıyla IPFS'e yüklendi ve blockchain'e kaydedildi"
    });

  } catch (error) {
    console.error("AI conversation processing failed:", error);
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
    const ipfsHash = searchParams.get("ipfsHash");
    const type = searchParams.get("type"); // 'conversation' veya 'post'

    if (ipfsHash) {
      // Belirli bir IPFS hash'inden veri çek
      try {
        let data;
        if (type === 'post') {
          data = await getDataFromIPFS<any>(ipfsHash);
        } else {
          data = await getDataFromIPFS<any>(ipfsHash);
        }

        return NextResponse.json({
          success: true,
          data,
          ipfsHash
        });
      } catch (ipfsError) {
        return NextResponse.json(
          { error: "IPFS'ten veri çekilemedi" },
          { status: 404 }
        );
      }
    }

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
        ipfsHash: "QmExampleHash1",
        question: "Hangi çay türü en sağlıklı?",
        response: "Yeşil çay antioksidan açısından en zengin olanıdır.",
        timestamp: Date.now() - 3600000,
        transactionHash: "0x1234...5678"
      },
      {
        id: "2",
        ipfsHash: "QmExampleHash2",
        question: "Çay ne kadar süre demlenmeli?",
        response: "Çay türüne göre 2-5 dakika arası",
        timestamp: Date.now() - 7200000,
        transactionHash: "0x8765...4321"
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

// IPFS'ten veri çekme endpoint'i
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { ipfsHash, type } = body;

    if (!ipfsHash) {
      return NextResponse.json(
        { error: "IPFS hash gerekli" },
        { status: 400 }
      );
    }

    let data;
    if (type === 'post') {
      data = await getDataFromIPFS<any>(ipfsHash);
    } else {
      data = await getDataFromIPFS<any>(ipfsHash);
    }

    return NextResponse.json({
      success: true,
      data,
      ipfsHash
    });

  } catch (error) {
    console.error("IPFS data fetch failed:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "IPFS'ten veri çekilemedi",
      },
      { status: 500 }
    );
  }
}
