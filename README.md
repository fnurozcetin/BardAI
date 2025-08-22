# ☕ TeaCupAI - Çay Kültürü AI Uygulaması

TeaCupAI, çay kültürü hakkında AI destekli sohbetler yapmanızı ve bu sohbetleri community'de paylaşmanızı sağlayan Web3 uygulamasıdır. En çok beğenilen yanıtlar NFT ile ödüllendirilir.

## 🚀 Özellikler

- **AI Destekli Çay Sohbetleri**: OpenAI entegrasyonu ile çay hakkında sorular sorun
- **Türkiye Trendleri**: AI yanıtları Türkiye sosyal medya trendlerine göre verilir
- **IPFS Depolama**: Tüm konuşma verileri IPFS'te güvenli şekilde saklanır
- **Blockchain Entegrasyonu**: Smart contract ile zincir üzerinde yönetim
- **NFT Ödül Sistemi**: 3 günde bir en çok beğenilen yanıtlar NFT kazanır
- **Community Platform**: Yanıtları community'de paylaşın ve beğenin

## 🏗️ Mimari

### Frontend (Next.js + React)
- **TeaCupAI**: AI sohbet arayüzü
- **Community**: Paylaşım ve beğeni sistemi
- **Wagmi + Viem**: Web3 entegrasyonu

### Backend (Smart Contract + IPFS)
- **TeaCupAI.sol**: Ana smart contract (ERC721 + IPFS)
- **IPFS Client**: Veri yükleme ve çekme
- **API Routes**: Frontend-backend köprüsü

### Blockchain
- **Base Network**: Ana ağ (L2 Ethereum)
- **NFT Standard**: ERC721
- **Gas Optimization**: IPFS ile verimli depolama

## 📁 Proje Yapısı

```
CAI/
├── app/                    # Next.js frontend
│   ├── components/        # React bileşenleri
│   ├── api/              # API routes
│   └── ...
├── contracts/             # Smart contracts
│   └── TeaCupAI.sol      # Ana contract
├── lib/                   # Utility fonksiyonları
│   ├── ipfs-client.ts    # IPFS entegrasyonu
│   └── use-teacup-contract.ts # Contract hook
├── scripts/               # Deployment scripts
│   └── deploy.ts         # Contract deployment
└── hardhat.config.ts      # Hardhat konfigürasyonu
```

## 🛠️ Kurulum

### 1. Gereksinimler
- Node.js 18+
- npm veya yarn
- MetaMask veya başka Web3 wallet
- IPFS node (Infura, Pinata, vb.)

### 2. Projeyi Klonlayın
```bash
git clone <repository-url>
cd CAI
```

### 3. Bağımlılıkları Yükleyin
```bash
npm install
```

### 4. Environment Variables
`.env.local` dosyası oluşturun:

```env
# Smart Contract
NEXT_PUBLIC_TEACUP_AI_CONTRACT_ADDRESS=0x...
TEACUP_AI_CONTRACT_ADDRESS=0x...

# IPFS (Infura)
INFURA_IPFS_PROJECT_ID=your_project_id
INFURA_IPFS_PROJECT_SECRET=your_project_secret

# OpenAI
OPENAI_API_KEY=your_openai_key

# Blockchain (opsiyonel)
PRIVATE_KEY=your_private_key
INFURA_API_KEY=your_infura_key
ETHERSCAN_API_KEY=your_etherscan_key
```

### 5. Smart Contract'ı Deploy Edin

#### Local Development
```bash
npm run compile
npm run deploy:local
```

#### Testnet (Base Sepolia)
```bash
npm run deploy:baseSepolia
```

#### Mainnet (Base)
```bash
npm run deploy:base
```

### 6. Uygulamayı Başlatın
```bash
npm run dev
```

## 🔧 Smart Contract Özellikleri

### Ana Fonksiyonlar
- `logAIConversation(ipfsHash)`: AI konuşmasını IPFS hash ile kaydet
- `createPost(ipfsHash, category)`: Community post'u oluştur
- `shareConversation(conversationId, category)`: Konuşmayı paylaş
- `likePost(postId)`: Post'u beğen
- `distributeNFTs()`: En çok beğenilen yanıtları NFT ile ödüllendir

### NFT Sistemi
- **ERC721 Standard**: Her NFT benzersiz
- **Otomatik Dağıtım**: 3 günde bir en çok beğenilen yanıtlar
- **Metadata**: IPFS'te saklanan detaylı bilgiler

### Gas Optimizasyonu
- **IPFS Hash**: Sadece hash'ler zincire yazılır
- **Batch Operations**: Toplu işlemler için hazır
- **Efficient Storage**: Minimal on-chain veri

## 🌐 IPFS Entegrasyonu

### Veri Yapısı
```typescript
interface ConversationData {
  question: string;
  answer: string;
  timestamp: number;
  userAddress: string;
  category?: string;
  metadata: {
    language: string;
    region: string;
    trendingTopics: string[];
    aiModel: string;
  };
}
```

### Özellikler
- **Türkiye Trendleri**: Otomatik trend tespiti
- **Çay Etiketleri**: Akıllı etiket oluşturma
- **Metadata Enrichment**: Zenginleştirilmiş veri
- **Pin Management**: Veri kalıcılığı

## 🎯 Kullanım Senaryoları

### 1. AI Sohbeti
1. TeaCupAI sekmesine gidin
2. Çay hakkında soru sorun
3. AI Türkiye trendlerine göre yanıt verir
4. Yanıt otomatik olarak IPFS'e yüklenir

### 2. Community Paylaşımı
1. Beğendiğiniz yanıtı community'de paylaşın
2. Kategori seçin (Çay Kültürü, Demleme, vb.)
3. Diğer kullanıcılar beğensin
4. En çok beğenilen yanıtlar NFT kazanır

### 3. NFT Kazanma
1. Kaliteli sorular sorun ve yanıtlar verin
2. Community'de aktif olun
3. Diğer yanıtları beğenin
4. 3 günde bir NFT dağıtımında şansınızı deneyin

## 🔒 Güvenlik

- **Access Control**: Sadece owner NFT dağıtabilir
- **Input Validation**: Tüm girişler doğrulanır
- **Reentrancy Protection**: OpenZeppelin güvenlik standartları
- **IPFS Verification**: Hash doğrulama

## 📊 Test

```bash
# Unit testleri çalıştır
npm run test

# Gas raporu
REPORT_GAS=true npm run test

# Coverage
npm run coverage
```

## 🚀 Deployment

### Testnet
```bash
# Base Sepolia
npm run deploy:baseSepolia

# Sepolia
npm run deploy:sepolia

# Mumbai
npm run deploy:mumbai
```

### Mainnet
```bash
# Base
npm run deploy:base

# Ethereum
npm run deploy:mainnet

# Polygon
npm run deploy:polygon
```

### Contract Verification
```bash
# Base
npm run verify:base

# Base Sepolia
npm run verify:baseSepolia
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 🆘 Destek

- **Issues**: GitHub Issues kullanın
- **Discussions**: GitHub Discussions'da soru sorun
- **Documentation**: Wiki sayfalarını inceleyin

## 🙏 Teşekkürler

- **OpenAI**: AI entegrasyonu için
- **IPFS**: Merkezi olmayan depolama için
- **OpenZeppelin**: Güvenli smart contract kütüphaneleri için
- **Base Network**: Hızlı ve ucuz L2 çözümü için

---

**☕ Çay kültürünü blockchain ile buluşturuyoruz! 🚀**
