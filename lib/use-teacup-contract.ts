import { useCallback, useState } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { parseAbiItem, encodeFunctionData, getContract } from 'viem';

// Contract ABI
const CONTRACT_ABI = [
  parseAbiItem("function logAIConversation(string memory ipfsHash) external"),
  parseAbiItem("function createPost(string memory ipfsHash, uint8 category) external"),
  parseAbiItem("function shareConversation(uint256 conversationId, uint8 category) external"),
  parseAbiItem("function likePost(uint256 postId) external"),
  parseAbiItem("function unlikePost(uint256 postId) external"),
  parseAbiItem("function getPost(uint256 postId) external view returns (tuple(uint256 id, address user, string ipfsHash, uint256 timestamp, uint256 likes, bool isNFTWinner, uint256 nftTokenId, uint8 category))"),
  parseAbiItem("function getConversation(uint256 conversationId) external view returns (tuple(uint256 id, address user, string ipfsHash, uint256 timestamp, bool isShared, uint256 likes, bool isNFTWinner, uint256 nftTokenId))"),
  parseAbiItem("function getUserPosts(address user) external view returns (uint256[])"),
  parseAbiItem("function getUserConversations(address user) external view returns (uint256[])"),
  parseAbiItem("function getTopPosts(uint256 count) external view returns (uint256[])"),
  parseAbiItem("function getTotalPosts() external view returns (uint256)"),
  parseAbiItem("function getTotalConversations() external view returns (uint256)"),
  parseAbiItem("function isPostLiked(uint256 postId, address user) external view returns (bool)"),
  parseAbiItem("function isConversationLiked(uint256 conversationId, address user) external view returns (bool)"),
  parseAbiItem("function getNextNFTDistribution() external view returns (uint256)"),
];

// Post categories enum
export enum PostCategory {
  TEA_CULTURE = 0,
  BREWING = 1,
  HEALTH = 2,
  FUNNY = 3,
  GENERAL = 4
}

// Contract address
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TEACUP_AI_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

export function useTeaCupContract() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI konuşmasını IPFS hash ile kaydet
  const logAIConversation = useCallback(async (ipfsHash: string) => {
    if (!address || !walletClient) {
      setError("Wallet bağlı değil");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = encodeFunctionData({
        abi: CONTRACT_ABI,
        functionName: 'logAIConversation',
        args: [ipfsHash]
      });

      const hash = await walletClient.sendTransaction({
        to: CONTRACT_ADDRESS as `0x${string}`,
        data,
        account: address,
      });

      return hash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Bilinmeyen hata";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address, walletClient]);

  // Community post'u oluştur
  const createPost = useCallback(async (ipfsHash: string, category: PostCategory) => {
    if (!address || !walletClient) {
      setError("Wallet bağlı değil");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = encodeFunctionData({
        abi: CONTRACT_ABI,
        functionName: 'createPost',
        args: [ipfsHash, category]
      });

      const hash = await walletClient.sendTransaction({
        to: CONTRACT_ADDRESS as `0x${string}`,
        data,
        account: address,
      });

      return hash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Bilinmeyen hata";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address, walletClient]);

  // Konuşmayı community'de paylaş
  const shareConversation = useCallback(async (conversationId: number, category: PostCategory) => {
    if (!address || !walletClient) {
      setError("Wallet bağlı değil");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = encodeFunctionData({
        abi: CONTRACT_ABI,
        functionName: 'shareConversation',
        args: [BigInt(conversationId), category]
      });

      const hash = await walletClient.sendTransaction({
        to: CONTRACT_ADDRESS as `0x${string}`,
        data,
        account: address,
      });

      return hash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Bilinmeyen hata";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address, walletClient]);

  // Post'u beğen
  const likePost = useCallback(async (postId: number) => {
    if (!address || !walletClient) {
      setError("Wallet bağlı değil");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = encodeFunctionData({
        abi: CONTRACT_ABI,
        functionName: 'likePost',
        args: [BigInt(postId)]
      });

      const hash = await walletClient.sendTransaction({
        to: CONTRACT_ADDRESS as `0x${string}`,
        data,
        account: address,
      });

      return hash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Bilinmeyen hata";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address, walletClient]);

  // Post beğenisini kaldır
  const unlikePost = useCallback(async (postId: number) => {
    if (!address || !walletClient) {
      setError("Wallet bağlı değil");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = encodeFunctionData({
        abi: CONTRACT_ABI,
        functionName: 'unlikePost',
        args: [BigInt(postId)]
      });

      const hash = await walletClient.sendTransaction({
        to: CONTRACT_ADDRESS as `0x${string}`,
        data,
        account: address,
      });

      return hash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Bilinmeyen hata";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address, walletClient]);

  // Konuşmayı beğen
  const likeConversation = useCallback(async (conversationId: number) => {
    if (!address || !walletClient) {
      setError("Wallet bağlı değil");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = encodeFunctionData({
        abi: CONTRACT_ABI,
        functionName: 'likeConversation',
        args: [BigInt(conversationId)]
      });

      const hash = await walletClient.sendTransaction({
        to: CONTRACT_ADDRESS as `0x${string}`,
        data,
        account: address,
      });

      return hash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Bilinmeyen hata";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address, walletClient]);

  // Konuşma beğenisini kaldır
  const unlikeConversation = useCallback(async (conversationId: number) => {
    if (!address || !walletClient) {
      setError("Wallet bağlı değil");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = encodeFunctionData({
        abi: CONTRACT_ABI,
        functionName: 'unlikeConversation',
        args: [BigInt(conversationId)]
      });

      const hash = await walletClient.sendTransaction({
        to: CONTRACT_ADDRESS as `0x${string}`,
        data,
        account: address,
      });

      return hash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Bilinmeyen hata";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address, walletClient]);

  // Read functions (view functions)
  const getPost = useCallback(async (postId: number) => {
    if (!publicClient) return null;

    try {
      const data = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'getPost',
        args: [BigInt(postId)]
      });

      return data;
    } catch (err) {
      console.error("Post get failed:", err);
      return null;
    }
  }, [publicClient]);

  const getConversation = useCallback(async (conversationId: number) => {
    if (!publicClient) return null;

    try {
      const data = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'getConversation',
        args: [BigInt(conversationId)]
      });

      return data;
    } catch (err) {
      console.error("Conversation get failed:", err);
      return null;
    }
  }, [publicClient]);

  const getUserPosts = useCallback(async (userAddress: string) => {
    if (!publicClient) return [];

    try {
      const data = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'getUserPosts',
        args: [userAddress as `0x${string}`]
      });

      return data;
    } catch (err) {
      console.error("User posts get failed:", err);
      return [];
    }
  }, [publicClient]);

  const getUserConversations = useCallback(async (userAddress: string) => {
    if (!publicClient) return [];

    try {
      const data = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'getUserConversations',
        args: [userAddress as `0x${string}`]
      });

      return data;
    } catch (err) {
      console.error("User conversations get failed:", err);
      return [];
    }
  }, [publicClient]);

  const getTopPosts = useCallback(async (count: number) => {
    if (!publicClient) return [];

    try {
      const data = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'getTopPosts',
        args: [BigInt(count)]
      });

      return data;
    } catch (err) {
      console.error("Top posts get failed:", err);
      return [];
    }
  }, [publicClient]);

  const getTotalPosts = useCallback(async () => {
    if (!publicClient) return 0;

    try {
      const data = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'getTotalPosts',
      });

      return Number(data);
    } catch (err) {
      console.error("Total posts get failed:", err);
      return 0;
    }
  }, [publicClient]);

  const getTotalConversations = useCallback(async () => {
    if (!publicClient) return 0;

    try {
      const data = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'getTotalConversations',
      });

      return Number(data);
    } catch (err) {
      console.error("Total conversations get failed:", err);
      return 0;
    }
  }, [publicClient]);

  const isPostLiked = useCallback(async (postId: number, userAddress: string) => {
    if (!publicClient) return false;

    try {
      const data = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'isPostLiked',
        args: [BigInt(postId), userAddress as `0x${string}`]
      });

      return data;
    } catch (err) {
      console.error("Post like check failed:", err);
      return false;
    }
  }, [publicClient]);

  const isConversationLiked = useCallback(async (conversationId: number, userAddress: string) => {
    if (!publicClient) return false;

    try {
      const data = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'isConversationLiked',
        args: [BigInt(conversationId), userAddress as `0x${string}`]
      });

      return data;
    } catch (err) {
      console.error("Conversation like check failed:", err);
      return false;
    }
  }, [publicClient]);

  const getNextNFTDistribution = useCallback(async () => {
    if (!publicClient) return 0;

    try {
      const data = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'getNextNFTDistribution',
      });

      return Number(data);
    } catch (err) {
      console.error("Next NFT distribution get failed:", err);
      return 0;
    }
  }, [publicClient]);

  return {
    // State
    isLoading,
    error,
    
    // Write functions
    logAIConversation,
    createPost,
    shareConversation,
    likePost,
    unlikePost,
    likeConversation,
    unlikeConversation,
    
    // Read functions
    getPost,
    getConversation,
    getUserPosts,
    getUserConversations,
    getTopPosts,
    getTotalPosts,
    getTotalConversations,
    isPostLiked,
    isConversationLiked,
    getNextNFTDistribution,
    
    // Contract info
    contractAddress: CONTRACT_ADDRESS,
    isConnected: !!address,
  };
}
