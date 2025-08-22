import { create } from 'ipfs-http-client';

// IPFS client configuration
const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(
      process.env.INFURA_IPFS_PROJECT_ID + ':' + process.env.INFURA_IPFS_PROJECT_SECRET
    ).toString('base64')}`
  }
});

// Alternative: Pinata IPFS (if you prefer)
// const pinata = new PinataSDK({
//   pinataApiKey: process.env.PINATA_API_KEY,
//   pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY
// });

export interface ConversationData {
  question: string;
  answer: string;
  timestamp: number;
  userAddress: string;
  category?: 'tea-culture' | 'brewing' | 'health' | 'funny' | 'general';
  metadata?: {
    language: string;
    region: string;
    trendingTopics?: string[];
    aiModel?: string;
  };
}

export interface PostData {
  question: string;
  answer: string;
  timestamp: number;
  userAddress: string;
  category: 'tea-culture' | 'brewing' | 'health' | 'funny' | 'general';
  likes: number;
  metadata?: {
    language: string;
    region: string;
    trendingTopics?: string[];
    tags?: string[];
  };
}

/**
 * AI konuşmasını IPFS'e yükler
 * @param conversationData Konuşma verisi
 * @returns IPFS hash'i
 */
export async function uploadConversationToIPFS(
  conversationData: ConversationData
): Promise<string> {
  try {
    // Türkiye sosyal medya trendlerini ekle
    const enrichedData = {
      ...conversationData,
      metadata: {
        ...conversationData.metadata,
        language: 'tr',
        region: 'TR',
        trendingTopics: await getTurkeyTrendingTopics(),
        aiModel: 'TeaCupAI-v1.0',
        timestamp: Date.now()
      }
    };

    // JSON'u IPFS'e yükle
    const result = await ipfs.add(JSON.stringify(enrichedData));
    return result.path;
  } catch (error) {
    console.error('IPFS upload failed:', error);
    throw new Error('Konuşma IPFS\'e yüklenemedi');
  }
}

/**
 * Community post'unu IPFS'e yükler
 * @param postData Post verisi
 * @returns IPFS hash'i
 */
export async function uploadPostToIPFS(
  postData: PostData
): Promise<string> {
  try {
    // Türkiye trendlerini ve etiketleri ekle
    const enrichedData = {
      ...postData,
      metadata: {
        ...postData.metadata,
        language: 'tr',
        region: 'TR',
        trendingTopics: await getTurkeyTrendingTopics(),
        tags: generateTeaTags(postData.question, postData.answer),
        timestamp: Date.now()
      }
    };

    // JSON'u IPFS'e yükle
    const result = await ipfs.add(JSON.stringify(enrichedData));
    return result.path;
  } catch (error) {
    console.error('IPFS upload failed:', error);
    throw new Error('Post IPFS\'e yüklenemedi');
  }
}

/**
 * IPFS'ten veri çeker
 * @param ipfsHash IPFS hash'i
 * @returns Çekilen veri
 */
export async function getDataFromIPFS<T>(ipfsHash: string): Promise<T> {
  try {
    const chunks = [];
    for await (const chunk of ipfs.cat(ipfsHash)) {
      chunks.push(chunk);
    }
    
    const data = Buffer.concat(chunks).toString();
    return JSON.parse(data);
  } catch (error) {
    console.error('IPFS data fetch failed:', error);
    throw new Error('IPFS\'ten veri çekilemedi');
  }
}

/**
 * Türkiye sosyal medya trendlerini getirir (mock)
 * Gerçek uygulamada Twitter/X API veya başka trend servisi kullanılır
 */
async function getTurkeyTrendingTopics(): Promise<string[]> {
  // Mock trend verileri - gerçek uygulamada API'den çekilir
  const mockTrends = [
    'çay kültürü',
    'yeşil çay faydaları',
    'çay demleme teknikleri',
    'türk çayı',
    'bitki çayları',
    'çay vs kahve',
    'çay saati',
    'çay bahçeleri',
    'çay çeşitleri',
    'çay tarihi'
  ];

  // Rastgele 3-5 trend seç
  const shuffled = mockTrends.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 3) + 3);
}

/**
 * Soru ve cevaba göre çay etiketleri oluşturur
 */
function generateTeaTags(question: string, answer: string): string[] {
  const text = (question + ' ' + answer).toLowerCase();
  const tags: string[] = [];

  // Çay türleri
  if (text.includes('yeşil')) tags.push('yeşil-çay');
  if (text.includes('siyah')) tags.push('siyah-çay');
  if (text.includes('oolong')) tags.push('oolong');
  if (text.includes('beyaz')) tags.push('beyaz-çay');
  if (text.includes('bitki')) tags.push('bitki-çayı');

  // Konular
  if (text.includes('sağlık') || text.includes('fayda')) tags.push('sağlık');
  if (text.includes('demleme') || text.includes('nasıl')) tags.push('demleme');
  if (text.includes('kültür') || text.includes('tarih')) tags.push('kültür');
  if (text.includes('komik') || text.includes('meme')) tags.push('komik');
  if (text.includes('zaman') || text.includes('ne zaman')) tags.push('zaman');

  // Genel etiketler
  tags.push('çay', 'türkiye', 'ai');

  return [...new Set(tags)]; // Duplicate'ları kaldır
}

/**
 * IPFS gateway URL'i oluşturur
 */
export function getIPFSGatewayURL(ipfsHash: string, gateway: string = 'https://ipfs.io/ipfs/'): string {
  return `${gateway}${ipfsHash}`;
}

/**
 * IPFS hash'inin geçerli olup olmadığını kontrol eder
 */
export function isValidIPFSHash(hash: string): boolean {
  // CID v0 formatı: Qm... (46 karakter)
  // CID v1 formatı: bafy... (59 karakter)
  return hash.length === 46 || hash.length === 59;
}

/**
 * Birden fazla veriyi IPFS'e toplu yükler
 */
export async function uploadMultipleToIPFS<T>(
  dataArray: T[],
  uploadFunction: (data: T) => Promise<string>
): Promise<string[]> {
  const promises = dataArray.map(data => uploadFunction(data));
  return Promise.all(promises);
}

/**
 * IPFS pin durumunu kontrol eder
 */
export async function checkIPFSPinStatus(ipfsHash: string): Promise<boolean> {
  try {
    const result = await ipfs.pin.ls(ipfsHash);
    return result.length > 0;
  } catch (error) {
    return false;
  }
}

/**
 * IPFS'teki veriyi pinler
 */
export async function pinIPFSData(ipfsHash: string): Promise<void> {
  try {
    await ipfs.pin.add(ipfsHash);
  } catch (error) {
    console.error('IPFS pin failed:', error);
  }
}
