import { expect } from "chai";
import { ethers } from "hardhat";
import { TeaCupAI } from "../typechain-types";
import { SignerWithAddress } from "@ethersproject/contracts/node_modules/@ethersproject/abstract-signer";
import { ContractTransaction } from "ethers";

describe("TeaCupAI", function () {
  let teaCupAI: TeaCupAI;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  const mockIPFSHash = "QmExampleHash1234567890123456789012345678901234567890";
  const mockIPFSHash2 = "QmExampleHash2345678901234567890123456789012345678901";

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();
    
    const TeaCupAI = await ethers.getContractFactory("TeaCupAI");
    teaCupAI = await TeaCupAI.deploy();
    await teaCupAI.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await teaCupAI.owner()).to.equal(owner.address);
    });

    it("Should set correct NFT name and symbol", async function () {
      expect(await teaCupAI.name()).to.equal("TeaCupAI NFT");
      expect(await teaCupAI.symbol()).to.equal("TCAI");
    });

    it("Should set correct IPFS gateway", async function () {
      expect(await teaCupAI.ipfsGateway()).to.equal("https://ipfs.io/ipfs/");
    });

    it("Should set correct NFT reward interval", async function () {
      expect(await teaCupAI.NFT_REWARD_INTERVAL()).to.equal(3 * 24 * 60 * 60); // 3 days
    });
  });

  describe("AI Conversation Logging", function () {
    it("Should log AI conversation with valid IPFS hash", async function () {
      await expect(teaCupAI.connect(user1).logAIConversation(mockIPFSHash))
        .to.emit(teaCupAI, "AIConversationLogged")
        .withArgs(1, user1.address, mockIPFSHash, await getCurrentTimestamp());

      const conversation = await teaCupAI.getConversation(1);
      expect(conversation.user).to.equal(user1.address);
      expect(conversation.ipfsHash).to.equal(mockIPFSHash);
      expect(conversation.isShared).to.be.false;
      expect(conversation.likes).to.equal(0);
    });

    it("Should reject empty IPFS hash", async function () {
      await expect(teaCupAI.connect(user1).logAIConversation(""))
        .to.be.revertedWith("IPFS hash boş olamaz");
    });

    it("Should reject invalid IPFS hash length", async function () {
      await expect(teaCupAI.connect(user1).logAIConversation("invalid"))
        .to.be.revertedWith("Geçersiz IPFS hash formatı");
    });

    it("Should track user conversations correctly", async function () {
      await teaCupAI.connect(user1).logAIConversation(mockIPFSHash);
      await teaCupAI.connect(user1).logAIConversation(mockIPFSHash2);

      const userConversations = await teaCupAI.getUserConversations(user1.address);
      expect(userConversations.length).to.equal(2);
      expect(userConversations[0]).to.equal(1);
      expect(userConversations[1]).to.equal(2);
    });
  });

  describe("Community Post Creation", function () {
    beforeEach(async function () {
      await teaCupAI.connect(user1).logAIConversation(mockIPFSHash);
    });

    it("Should create post with valid data", async function () {
      await expect(teaCupAI.connect(user1).createPost(mockIPFSHash2, 0)) // TEA_CULTURE
        .to.emit(teaCupAI, "PostShared")
        .withArgs(1, user1.address, mockIPFSHash2, 0, await getCurrentTimestamp());

      const post = await teaCupAI.getPost(1);
      expect(post.user).to.equal(user1.address);
      expect(post.ipfsHash).to.equal(mockIPFSHash2);
      expect(post.category).to.equal(0);
      expect(post.likes).to.equal(0);
    });

    it("Should reject post creation with empty IPFS hash", async function () {
      await expect(teaCupAI.connect(user1).createPost("", 0))
        .to.be.revertedWith("IPFS hash boş olamaz");
    });

    it("Should reject post creation with invalid category", async function () {
      await expect(teaCupAI.connect(user1).createPost(mockIPFSHash2, 10))
        .to.be.revertedWith("Invalid category");
    });
  });

  describe("Conversation Sharing", function () {
    beforeEach(async function () {
      await teaCupAI.connect(user1).logAIConversation(mockIPFSHash);
    });

    it("Should share conversation to community", async function () {
      await expect(teaCupAI.connect(user1).shareConversation(1, 1)) // BREWING
        .to.emit(teaCupAI, "PostShared")
        .withArgs(1, user1.address, mockIPFSHash, 1, await getCurrentTimestamp());

      const post = await teaCupAI.getPost(1);
      expect(post.user).to.equal(user1.address);
      expect(post.ipfsHash).to.equal(mockIPFSHash);
      expect(post.category).to.equal(1);

      const conversation = await teaCupAI.getConversation(1);
      expect(conversation.isShared).to.be.true;
    });

    it("Should reject sharing non-existent conversation", async function () {
      await expect(teaCupAI.connect(user1).shareConversation(999, 0))
        .to.be.revertedWith("Konuşma bulunamadı");
    });

    it("Should reject sharing conversation by non-owner", async function () {
      await expect(teaCupAI.connect(user2).shareConversation(1, 0))
        .to.be.revertedWith("Sadece kendi konuşmanı paylaşabilirsin");
    });

    it("Should reject sharing already shared conversation", async function () {
      await teaCupAI.connect(user1).shareConversation(1, 0);
      
      await expect(teaCupAI.connect(user1).shareConversation(1, 1))
        .to.be.revertedWith("Konuşma zaten paylaşılmış");
    });
  });

  describe("Post Liking", function () {
    beforeEach(async function () {
      await teaCupAI.connect(user1).createPost(mockIPFSHash, 0);
    });

    it("Should like post correctly", async function () {
      await expect(teaCupAI.connect(user2).likePost(1))
        .to.emit(teaCupAI, "PostLiked")
        .withArgs(1, user2.address, 1);

      const post = await teaCupAI.getPost(1);
      expect(post.likes).to.equal(1);
      expect(await teaCupAI.isPostLiked(1, user2.address)).to.be.true;
    });

    it("Should reject liking same post twice", async function () {
      await teaCupAI.connect(user2).likePost(1);
      
      await expect(teaCupAI.connect(user2).likePost(1))
        .to.be.revertedWith("Post zaten beğenilmiş");
    });

    it("Should unlike post correctly", async function () {
      await teaCupAI.connect(user2).likePost(1);
      await teaCupAI.connect(user2).unlikePost(1);

      const post = await teaCupAI.getPost(1);
      expect(post.likes).to.equal(0);
      expect(await teaCupAI.isPostLiked(1, user2.address)).to.be.false;
    });

    it("Should reject unliking non-liked post", async function () {
      await expect(teaCupAI.connect(user2).unlikePost(1))
        .to.be.revertedWith("Post beğenilmemiş");
    });
  });

  describe("Conversation Liking", function () {
    beforeEach(async function () {
      await teaCupAI.connect(user1).logAIConversation(mockIPFSHash);
    });

    it("Should like conversation correctly", async function () {
      await expect(teaCupAI.connect(user2).likeConversation(1))
        .to.emit(teaCupAI, "ConversationLiked")
        .withArgs(1, user2.address, 1);

      const conversation = await teaCupAI.getConversation(1);
      expect(conversation.likes).to.equal(1);
      expect(await teaCupAI.isConversationLiked(1, user2.address)).to.be.true;
    });

    it("Should unlike conversation correctly", async function () {
      await teaCupAI.connect(user2).likeConversation(1);
      await teaCupAI.connect(user2).unlikeConversation(1);

      const conversation = await teaCupAI.getConversation(1);
      expect(conversation.likes).to.equal(0);
      expect(await teaCupAI.isConversationLiked(1, user2.address)).to.be.false;
    });
  });

  describe("NFT Distribution", function () {
    beforeEach(async function () {
      // Create multiple posts with different like counts
      await teaCupAI.connect(user1).createPost(mockIPFSHash, 0);
      await teaCupAI.connect(user2).createPost(mockIPFSHash2, 1);
      
      // Add likes to posts
      await teaCupAI.connect(user3).likePost(1); // Post 1: 1 like
      await teaCupAI.connect(user1).likePost(2); // Post 2: 1 like
      await teaCupAI.connect(user2).likePost(2); // Post 2: 2 likes
    });

    it("Should distribute NFTs to top posts", async function () {
      // Fast forward time to allow NFT distribution
      await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60 + 1]); // 3 days + 1 second
      await ethers.provider.send("evm_mine", []);

      await expect(teaCupAI.connect(owner).distributeNFTs())
        .to.emit(teaCupAI, "NFTDistributionCompleted")
        .withArgs(await getCurrentTimestamp(), 2);

      // Check that NFTs were minted
      const post1 = await teaCupAI.getPost(1);
      const post2 = await teaCupAI.getPost(2);
      
      expect(post1.isNFTWinner).to.be.true;
      expect(post2.isNFTWinner).to.be.true;
      expect(post1.nftTokenId).to.be.gt(0);
      expect(post2.nftTokenId).to.be.gt(0);
    });

    it("Should reject NFT distribution before interval", async function () {
      await expect(teaCupAI.connect(owner).distributeNFTs())
        .to.be.revertedWith("Henüz NFT dağıtım zamanı gelmedi");
    });

    it("Should reject NFT distribution by non-owner", async function () {
      await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60 + 1]);
      await ethers.provider.send("evm_mine", []);

      await expect(teaCupAI.connect(user1).distributeNFTs())
        .to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Top Posts", function () {
    beforeEach(async function () {
      // Create posts with different like counts
      await teaCupAI.connect(user1).createPost(mockIPFSHash, 0);
      await teaCupAI.connect(user2).createPost(mockIPFSHash2, 1);
      
      // Post 1: 2 likes, Post 2: 1 like
      await teaCupAI.connect(user2).likePost(1);
      await teaCupAI.connect(user3).likePost(1);
      await teaCupAI.connect(user1).likePost(2);
    });

    it("Should return top posts by likes", async function () {
      const topPosts = await teaCupAI.getTopPosts(2);
      expect(topPosts[0]).to.equal(1); // Post 1 has more likes
      expect(topPosts[1]).to.equal(2); // Post 2 has fewer likes
    });

    it("Should return correct number of top posts", async function () {
      const topPosts = await teaCupAI.getTopPosts(1);
      expect(topPosts.length).to.equal(1);
      expect(topPosts[0]).to.equal(1);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to set base token URI", async function () {
      const newURI = "https://new-api.teacupai.com/nft/";
      await teaCupAI.connect(owner).setBaseTokenURI(newURI);
      expect(await teaCupAI.getBaseTokenURI()).to.equal(newURI);
    });

    it("Should reject setting base token URI by non-owner", async function () {
      const newURI = "https://new-api.teacupai.com/nft/";
      await expect(teaCupAI.connect(user1).setBaseTokenURI(newURI))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow owner to set IPFS gateway", async function () {
      const newGateway = "https://new-gateway.ipfs.io/ipfs/";
      await expect(teaCupAI.connect(owner).setIPFSGateway(newGateway))
        .to.emit(teaCupAI, "IPFSGatewayUpdated")
        .withArgs("https://ipfs.io/ipfs/", newGateway);

      expect(await teaCupAI.ipfsGateway()).to.equal(newGateway);
    });

    it("Should reject setting IPFS gateway by non-owner", async function () {
      const newGateway = "https://new-gateway.ipfs.io/ipfs/";
      await expect(teaCupAI.connect(user1).setIPFSGateway(newGateway))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await teaCupAI.connect(user1).logAIConversation(mockIPFSHash);
      await teaCupAI.connect(user1).createPost(mockIPFSHash, 0);
    });

    it("Should return correct total counts", async function () {
      expect(await teaCupAI.getTotalConversations()).to.equal(1);
      expect(await teaCupAI.getTotalPosts()).to.equal(1);
      expect(await teaCupAI.getTotalNFTs()).to.equal(0);
    });

    it("Should return user posts correctly", async function () {
      const userPosts = await teaCupAI.getUserPosts(user1.address);
      expect(userPosts.length).to.equal(1);
      expect(userPosts[0]).to.equal(1);
    });

    it("Should return next NFT distribution time", async function () {
      const nextDistribution = await teaCupAI.getNextNFTDistribution();
      expect(nextDistribution).to.be.gt(await getCurrentTimestamp());
    });

    it("Should generate correct IPFS URL", async function () {
      const url = await teaCupAI.getIPFSURL(mockIPFSHash);
      expect(url).to.equal(`https://ipfs.io/ipfs/${mockIPFSHash}`);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle multiple users correctly", async function () {
      // User 1 creates conversation
      await teaCupAI.connect(user1).logAIConversation(mockIPFSHash);
      
      // User 2 creates post
      await teaCupAI.connect(user2).createPost(mockIPFSHash2, 0);
      
      // User 3 likes both
      await teaCupAI.connect(user3).likeConversation(1);
      await teaCupAI.connect(user3).likePost(1);
      
      // Check counts
      expect(await teaCupAI.getTotalConversations()).to.equal(1);
      expect(await teaCupAI.getTotalPosts()).to.equal(1);
      
      const conversation = await teaCupAI.getConversation(1);
      const post = await teaCupAI.getPost(1);
      
      expect(conversation.likes).to.equal(1);
      expect(post.likes).to.equal(1);
    });

    it("Should handle empty user data correctly", async function () {
      const userPosts = await teaCupAI.getUserPosts(user1.address);
      const userConversations = await teaCupAI.getUserConversations(user1.address);
      
      expect(userPosts.length).to.equal(0);
      expect(userConversations.length).to.equal(0);
    });
  });
});

// Helper function to get current timestamp
async function getCurrentTimestamp(): Promise<number> {
  const blockNum = await ethers.provider.getBlockNumber();
  const block = await ethers.provider.getBlock(blockNum);
  return block!.timestamp;
}
