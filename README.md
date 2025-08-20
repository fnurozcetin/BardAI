# 🍵 BardAI / ÇayChain

Geleneksel çay kültürünü blockchain teknolojisi ile birleştiren yenilikçi mini uygulama. Çay seanslarınızı kaydedin, AI asistan ile öğrenin ve tüm deneyimlerinizi Base blockchain'e yazın.

## ✨ Özellikler

### 🍵 Çay Kültürü
- **4 Farklı Çay Türü**: Yeşil, Siyah, Oolong ve Beyaz çay hakkında detaylı bilgi
- **Çay Seansı Takibi**: Her çay seansınızı notlarla ve değerlendirmelerle kaydedin
- **Demleme Rehberi**: Her çay türü için optimal demleme süresi ve sıcaklık önerileri
- **5 Yıldızlı Değerlendirme**: Çay deneyimlerinizi puanlayın

### 🤖 AI Asistan
- **Akıllı Yanıtlar**: Çay kültürü hakkında her sorunuzu yanıtlayan AI
- **Hızlı Soru-Cevap**: Sık sorulan sorular için hızlı erişim butonları
- **Kişiselleştirilmiş Öneriler**: Durumunuza göre çay tavsiyeleri
- **Gerçek Zamanlı Sohbet**: Doğal dil ile AI ile konuşun

### ⛓️ Blockchain Entegrasyonu
- **Base Network**: Coinbase'in Base blockchain'i üzerinde çalışır
- **Onchain Logging**: Tüm aktiviteleriniz blockchain'e kaydedilir
- **BaseScan Explorer**: İşlemlerinizi BaseScan'de takip edin
- **Gerçek Zamanlı Takip**: Blockchain işlemlerinizi anlık olarak izleyin

## 🚀 Teknolojiler

- **Frontend**: React 18 + Next.js 15 + TypeScript
- **Blockchain**: Base Network (Coinbase L2)
- **Wallet**: OnchainKit MiniKit
- **Styling**: Tailwind CSS
- **Blockchain Client**: Viem + Wagmi
- **Notifications**: Farcaster Frame SDK

## 🛠️ Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn
- Base network cüzdanı (Coinbase Wallet, MetaMask)

### Adımlar

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/yourusername/bardai-caychain.git
cd bardai-caychain
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
# veya
yarn install
```

3. **Environment değişkenlerini ayarlayın**
```bash
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin:
```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=BardAI ÇayChain
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_APP_HERO_IMAGE=https://your-domain.com/hero.png
NEXT_PUBLIC_SPLASH_IMAGE=https://your-domain.com/splash.png
NEXT_PUBLIC_ICON_URL=https://your-domain.com/icon.png
NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR=#1a1a1a
```

4. **Uygulamayı başlatın**
```bash
npm run dev
# veya
yarn dev
```

5. **Tarayıcıda açın**
```
http://localhost:3000
```

## 📱 Kullanım

### 🍵 Çay Seansı Başlatma
1. Ana sayfada "🍵 Çay Kültürü" sekmesine tıklayın
2. İstediğiniz çay türünü seçin
3. Demleme süresi ve sıcaklık bilgilerini takip edin
4. Seans sırasında notlar alın
5. Seansı tamamladıktan sonra 5 yıldızlı değerlendirme yapın
6. Seans otomatik olarak Base blockchain'e kaydedilir

### 🤖 AI Asistan ile Sohbet
1. "🤖 AI Asistan" sekmesine tıklayın
2. Çay kültürü hakkında sorularınızı yazın
3. Hızlı soru butonlarını kullanarak yaygın soruları sorun
4. AI'dan kişiselleştirilmiş çay önerileri alın
5. Tüm konuşmalar blockchain'e kaydedilir

### ⛓️ Blockchain Log Takibi
1. "⛓️ Blockchain Log" sekmesine tıklayın
2. Tüm blockchain işlemlerinizi görüntüleyin
3. İşlem türlerine göre filtreleme yapın
4. BaseScan explorer'da işlem detaylarını görün
5. İstatistiklerinizi takip edin

## 🔧 API Endpoints

### POST /api/tea-session
Çay seansı verilerini blockchain'e kaydeder.

**Request Body:**
```json
{
  "session": {
    "teaType": "Yeşil Çay",
    "rating": 5,
    "notes": "Harika bir deneyimdi",
    "timestamp": 1234567890
  },
  "address": "0x..."
}
```

### POST /api/ai-conversation
AI konuşma verilerini blockchain'e kaydeder.

**Request Body:**
```json
{
  "userMessage": "Hangi çay türü en sağlıklı?",
  "aiResponse": "Yeşil çay antioksidan açısından en zengin olanıdır.",
  "address": "0x...",
  "timestamp": 1234567890
}
```

### GET /api/blockchain-logs?address=0x...
Kullanıcının blockchain log kayıtlarını getirir.

## 🌐 Base Network

Bu uygulama Coinbase'in Base network'ü üzerinde çalışır:

- **Network**: Base Mainnet
- **Chain ID**: 8453
- **RPC URL**: https://mainnet.base.org
- **Explorer**: https://basescan.org
- **Currency**: ETH

## 🔐 Güvenlik

- Tüm blockchain işlemleri kullanıcının cüzdanı ile imzalanır
- API endpoint'leri rate limiting ile korunur
- Hassas veriler client-side'da saklanmaz
- Blockchain işlemleri immutable ve şeffaftır

## 🚧 Geliştirme

### Yeni Çay Türü Ekleme
`app/components/TeaCulture.tsx` dosyasındaki `teaTypes` array'ine yeni çay türü ekleyin:

```typescript
{
  id: 5,
  name: "Yeni Çay Türü",
  origin: "Ülke",
  description: "Açıklama",
  brewingTime: "X dakika",
  temperature: "X°C",
  benefits: ["Fayda1", "Fayda2"],
  image: "🍃"
}
```

### Yeni AI Yanıtı Ekleme
`app/components/AIAssistant.tsx` dosyasındaki `generateAIResponse` fonksiyonuna yeni yanıt mantığı ekleyin.

### Blockchain Contract Entegrasyonu
Gerçek blockchain kontratı entegrasyonu için:
1. Smart contract'ı Base network'e deploy edin
2. `CONTRACT_ADDRESS` ve `CONTRACT_ABI` değişkenlerini güncelleyin
3. Mock transaction'ları gerçek kontrat çağrıları ile değiştirin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

- **Proje**: [GitHub Issues](https://github.com/yourusername/bardai-caychain/issues)
- **Geliştirici**: [@yourusername](https://github.com/yourusername)

## 🙏 Teşekkürler

- [Coinbase](https://coinbase.com) - Base Network
- [OnchainKit](https://onchainkit.xyz) - MiniKit
- [Farcaster](https://farcaster.xyz) - Frame SDK
- [Viem](https://viem.sh) - Blockchain Client
- [Wagmi](https://wagmi.sh) - React Hooks

---

**🍵 Çay kültürünü blockchain ile yaşayın! ⛓️**
