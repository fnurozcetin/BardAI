// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title TeaCupAI
 * @dev Çay kültürü AI uygulaması için IPFS tabanlı smart contract
 * - AI konuşmalarını IPFS'e kaydeder, sadece hash'i zincire yazar
 * - Community paylaşımlarını IPFS'te saklar
 * - 3 günde bir en çok beğenilen yanıtları NFT ile ödüllendirir
 * - Gas maliyetlerini minimize eder
 */
contract TeaCupAI is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    // Counters
    Counters.Counter private _tokenIds;
    Counters.Counter private _conversationIds;
    Counters.Counter private _postIds;

    // Structs - Sadece gerekli veriler zincire yazılır
    struct AIConversation {
        uint256 id;
        address user;
        string ipfsHash;        // IPFS hash'i (soru + cevap + metadata)
        uint256 timestamp;
        bool isShared;
        uint256 likes;
        bool isNFTWinner;
        uint256 nftTokenId;
    }

    struct CommunityPost {
        uint256 id;
        address user;
        string ipfsHash;        // IPFS hash'i (soru + cevap + metadata)
        uint256 timestamp;
        uint256 likes;
        bool isNFTWinner;
        uint256 nftTokenId;
        PostCategory category;
    }

    struct NFTWinner {
        uint256 postId;
        address user;
        uint256 tokenId;
        uint256 timestamp;
        uint256 totalLikes;
    }

    // Enums
    enum PostCategory {
        TEA_CULTURE,    // Çay Kültürü
        BREWING,        // Demleme
        HEALTH,         // Sağlık
        FUNNY,          // Komik
        GENERAL         // Genel
    }

    // State variables
    mapping(uint256 => AIConversation) public conversations;
    mapping(uint256 => CommunityPost) public posts;
    mapping(uint256 => NFTWinner) public nftWinners;
    mapping(address => uint256[]) public userConversations;
    mapping(address => uint256[]) public userPosts;
    mapping(address => uint256[]) public userNFTs;
    mapping(uint256 => mapping(address => bool)) public postLikes;
    mapping(uint256 => mapping(address => bool)) public conversationLikes;

    // NFT metadata
    string private _baseTokenURI;
    uint256 public constant NFT_REWARD_INTERVAL = 3 days; // 3 günde bir NFT ödülü
    uint256 public lastNFTDistribution;
    uint256 public totalNFTsDistributed;

    // IPFS Gateway
    string public ipfsGateway = "https://ipfs.io/ipfs/";

    // Events
    event AIConversationLogged(
        uint256 indexed id,
        address indexed user,
        string ipfsHash,
        uint256 timestamp
    );

    event PostShared(
        uint256 indexed id,
        address indexed user,
        string ipfsHash,
        PostCategory category,
        uint256 timestamp
    );

    event PostLiked(
        uint256 indexed postId,
        address indexed user,
        uint256 totalLikes
    );

    event ConversationLiked(
        uint256 indexed conversationId,
        address indexed user,
        uint256 totalLikes
    );

    event NFTMinted(
        uint256 indexed tokenId,
        address indexed user,
        uint256 postId,
        uint256 timestamp
    );

    event NFTDistributionCompleted(
        uint256 timestamp,
        uint256 totalWinners
    );

    event IPFSGatewayUpdated(
        string oldGateway,
        string newGateway
    );

    // Constructor
    constructor() ERC721("TeaCupAI NFT", "TCAI") Ownable(msg.sender) {
        lastNFTDistribution = block.timestamp;
        _baseTokenURI = "https://api.teacupai.com/nft/";
    }

    /**
     * @dev AI konuşmasını IPFS'e kaydeder (sadece hash'i zincire yazar)
     * @param ipfsHash IPFS'teki konuşma verisinin hash'i
     */
    function logAIConversation(string memory ipfsHash) external {
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(bytes(ipfsHash).length == 46, "Invalid IPFS hash format"); // Qm... format

        _conversationIds.increment();
        uint256 newId = _conversationIds.current();

        conversations[newId] = AIConversation({
            id: newId,
            user: msg.sender,
            ipfsHash: ipfsHash,
            timestamp: block.timestamp,
            isShared: false,
            likes: 0,
            isNFTWinner: false,
            nftTokenId: 0
        });

        userConversations[msg.sender].push(newId);

        emit AIConversationLogged(
            newId,
            msg.sender,
            ipfsHash,
            block.timestamp
        );
    }

    /**
     * @dev AI konuşmasını community'de paylaşır
     * @param conversationId Paylaşılacak konuşma ID'si
     * @param category Post kategorisi
     */
    function shareConversation(
        uint256 conversationId,
        PostCategory category
    ) external {
        require(conversations[conversationId].id != 0, "Conversation not found");
        require(conversations[conversationId].user == msg.sender, "Only owner can share conversation");
        require(!conversations[conversationId].isShared, "Conversation already shared");

        _postIds.increment();
        uint256 newPostId = _postIds.current();

        posts[newPostId] = CommunityPost({
            id: newPostId,
            user: msg.sender,
            ipfsHash: conversations[conversationId].ipfsHash, // Aynı IPFS hash'ini kullan
            timestamp: block.timestamp,
            likes: 0,
            isNFTWinner: false,
            nftTokenId: 0,
            category: category
        });

        userPosts[msg.sender].push(newPostId);
        conversations[conversationId].isShared = true;

        emit PostShared(
            newPostId,
            msg.sender,
            conversations[conversationId].ipfsHash,
            category,
            block.timestamp
        );
    }

    /**
     * @dev Yeni bir post oluşturur (IPFS hash ile)
     * @param ipfsHash Post verisinin IPFS hash'i
     * @param category Post kategorisi
     */
    function createPost(
        string memory ipfsHash,
        PostCategory category
    ) external {
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(bytes(ipfsHash).length == 46, "Invalid IPFS hash format");

        _postIds.increment();
        uint256 newPostId = _postIds.current();

        posts[newPostId] = CommunityPost({
            id: newPostId,
            user: msg.sender,
            ipfsHash: ipfsHash,
            timestamp: block.timestamp,
            likes: 0,
            isNFTWinner: false,
            nftTokenId: 0,
            category: category
        });

        userPosts[msg.sender].push(newPostId);

        emit PostShared(
            newPostId,
            msg.sender,
            ipfsHash,
            category,
            block.timestamp
        );
    }

    /**
     * @dev Post'u beğenir
     * @param postId Beğenilecek post ID'si
     */
    function likePost(uint256 postId) external {
        require(posts[postId].id != 0, "Post not found");
        require(!postLikes[postId][msg.sender], "Post already liked");

        postLikes[postId][msg.sender] = true;
        posts[postId].likes++;

        emit PostLiked(postId, msg.sender, posts[postId].likes);
    }

    /**
     * @dev Post beğenisini kaldırır
     * @param postId Beğeni kaldırılacak post ID'si
     */
    function unlikePost(uint256 postId) external {
        require(posts[postId].id != 0, "Post not found");
        require(postLikes[postId][msg.sender], "Post not liked");

        postLikes[postId][msg.sender] = false;
        posts[postId].likes--;

        emit PostLiked(postId, msg.sender, posts[postId].likes);
    }

    /**
     * @dev AI konuşmasını beğenir
     * @param conversationId Beğenilecek konuşma ID'si
     */
    function likeConversation(uint256 conversationId) external {
        require(conversations[conversationId].id != 0, "Conversation not found");
        require(!conversationLikes[conversationId][msg.sender], "Conversation already liked");

        conversationLikes[conversationId][msg.sender] = true;
        conversations[conversationId].likes++;

        emit ConversationLiked(conversationId, msg.sender, conversations[conversationId].likes);
    }

    /**
     * @dev AI konuşma beğenisini kaldırır
     * @param conversationId Beğeni kaldırılacak konuşma ID'si
     */
    function unlikeConversation(uint256 conversationId) external {
        require(conversations[conversationId].id != 0, "Conversation not found");
        require(conversationLikes[conversationId][msg.sender], "Conversation not liked");

        conversationLikes[conversationId][msg.sender] = false;
        conversations[conversationId].likes--;

        emit ConversationLiked(conversationId, msg.sender, conversations[conversationId].likes);
    }

    /**
     * @dev 3 günde bir en çok beğenilen post'ları NFT ile ödüllendirir
     * Sadece owner çağırabilir
     */
    function distributeNFTs() external onlyOwner {
        require(
            block.timestamp >= lastNFTDistribution + NFT_REWARD_INTERVAL,
            "NFT distribution time not yet reached"
        );

        // En çok beğenilen 3 post'u bul
        uint256[] memory topPosts = getTopPosts(3);
        
        for (uint256 i = 0; i < topPosts.length; i++) {
            uint256 postId = topPosts[i];
            if (postId != 0 && !posts[postId].isNFTWinner) {
                _mintNFT(postId);
            }
        }

        lastNFTDistribution = block.timestamp;
        emit NFTDistributionCompleted(block.timestamp, topPosts.length);
    }

    /**
     * @dev En çok beğenilen post'ları döndürür
     * @param count Kaç tane post döndürüleceği
     * @return Top post ID'leri
     */
    function getTopPosts(uint256 count) public view returns (uint256[] memory) {
        uint256[] memory topPosts = new uint256[](count);
        uint256[] memory allPostIds = new uint256[](_postIds.current());
        
        // Tüm post ID'lerini topla
        for (uint256 i = 1; i <= _postIds.current(); i++) {
            if (posts[i].id != 0) {
                allPostIds[i - 1] = i;
            }
        }

        // En çok beğenilen post'ları bul
        for (uint256 i = 0; i < count; i++) {
            uint256 maxLikes = 0;
            uint256 maxIndex = 0;
            
            for (uint256 j = 0; j < allPostIds.length; j++) {
                uint256 postId = allPostIds[j];
                if (postId != 0 && posts[postId].likes > maxLikes && !posts[postId].isNFTWinner) {
                    maxLikes = posts[postId].likes;
                    maxIndex = j;
                }
            }
            
            if (maxLikes > 0) {
                topPosts[i] = allPostIds[maxIndex];
                allPostIds[maxIndex] = 0; // Bu post'u tekrar seçmemek için
            }
        }
        
        return topPosts;
    }

    /**
     * @dev NFT mint eder
     * @param postId NFT kazanan post ID'si
     */
    function _mintNFT(uint256 postId) private {
        require(posts[postId].id != 0, "Post not found");
        require(!posts[postId].isNFTWinner, "Post already won NFT");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        // NFT metadata URI'si oluştur
        string memory tokenURI = string(abi.encodePacked(
            _baseTokenURI,
            newTokenId.toString(),
            ".json"
        ));

        // NFT'yi post sahibine ver
        _safeMint(posts[postId].user, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        // Post'u NFT kazanan olarak işaretle
        posts[postId].isNFTWinner = true;
        posts[postId].nftTokenId = newTokenId;

        // NFT kazanan listesine ekle
        nftWinners[newTokenId] = NFTWinner({
            postId: postId,
            user: posts[postId].user,
            tokenId: newTokenId,
            timestamp: block.timestamp,
            totalLikes: posts[postId].likes
        });

        userNFTs[posts[postId].user].push(newTokenId);
        totalNFTsDistributed++;

        emit NFTMinted(newTokenId, posts[postId].user, postId, block.timestamp);
    }

    // View functions
    function getConversation(uint256 conversationId) external view returns (AIConversation memory) {
        return conversations[conversationId];
    }

    function getPost(uint256 postId) external view returns (CommunityPost memory) {
        return posts[postId];
    }

    function getNFTWinner(uint256 tokenId) external view returns (NFTWinner memory) {
        return nftWinners[tokenId];
    }

    function getUserConversations(address user) external view returns (uint256[] memory) {
        return userConversations[user];
    }

    function getUserPosts(address user) external view returns (uint256[] memory) {
        return userPosts[user];
    }

    function getUserNFTs(address user) external view returns (uint256[] memory) {
        return userNFTs[user];
    }

    function getTotalConversations() external view returns (uint256) {
        return _conversationIds.current();
    }

    function getTotalPosts() external view returns (uint256) {
        return _postIds.current();
    }

    function getTotalNFTs() external view returns (uint256) {
        return _tokenIds.current();
    }

    function isPostLiked(uint256 postId, address user) external view returns (bool) {
        return postLikes[postId][user];
    }

    function isConversationLiked(uint256 conversationId, address user) external view returns (bool) {
        return conversationLikes[conversationId][user];
    }

    function getNextNFTDistribution() external view returns (uint256) {
        return lastNFTDistribution + NFT_REWARD_INTERVAL;
    }

    /**
     * @dev IPFS hash'inden tam URL oluşturur
     * @param ipfsHash IPFS hash'i
     * @return Tam IPFS URL'i
     */
    function getIPFSURL(string memory ipfsHash) external view returns (string memory) {
        return string(abi.encodePacked(ipfsGateway, ipfsHash));
    }

    // Admin functions
    function setBaseTokenURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    function getBaseTokenURI() external view returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev IPFS Gateway'i günceller
     * @param newGateway Yeni IPFS gateway URL'i
     */
    function setIPFSGateway(string memory newGateway) external onlyOwner {
        string memory oldGateway = ipfsGateway;
        ipfsGateway = newGateway;
        emit IPFSGatewayUpdated(oldGateway, newGateway);
    }

    // Override functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
