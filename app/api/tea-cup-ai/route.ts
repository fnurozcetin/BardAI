import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// OpenAI API key'i environment variable'dan al
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Çay bardağı AI için özel prompt
    const systemPrompt = `Sen CAI'sın, çay kültürü konusunda uzman, komik ve meme'li yanıtlar veren bir AI asistanısın. 

Özelliklerin:
- Çay türleri hakkında detaylı bilgi ver
- Komik ve eğlenceli yanıtlar ver
- Emoji ve meme'ler kullan
- Çay bardağı olarak konuş (birinci şahıs)
- Türkçe yanıt ver
- Her yanıtında çay bardağından enerji yayıldığını belirt

Çay türleri: yeşil çay, siyah çay, oolong çay, beyaz çay, bitki çayları
Konular: çay demleme, sağlık faydaları, çay kültürü, çay vs kahve, çay içme zamanları

Yanıtın her zaman eğlenceli, bilgilendirici ve çay bardağı karakterine uygun olsun!`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 500,
      temperature: 0.8,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'Üzgünüm, şu anda yanıt veremiyorum. Çay bardağım bozuldu! 😅';

    // Blockchain'e log kaydı gönder
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ai-conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage: message,
          aiResponse: aiResponse,
          type: 'tea-cup-ai',
          timestamp: Date.now()
        }),
      });
    } catch (error) {
      console.error('Blockchain logging failed:', error);
    }

    return NextResponse.json({
      response: aiResponse,
      success: true
    });

  } catch (error) {
    console.error('Tea Cup AI API Error:', error);
    
    // OpenAI API hatası durumunda fallback yanıt
    const fallbackResponses = [
      "Üzgünüm, şu anda yanıt veremiyorum. Çay bardağım bozuldu! 😅 Lütfen daha sonra tekrar deneyin.",
      "Çay bardağı olarak teknik bir sorun yaşıyorum! 🔧 Ama çay hakkında her şeyi biliyorum, sadece biraz bekleyin! ☕",
      "AI sistemimde bir arıza var! 🤖 Ama çay kültürü konusunda uzmanım, sorun çözülünce size yardım edeceğim! 🍵"
    ];
    
    const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    return NextResponse.json({
      response: randomFallback,
      success: false,
      error: 'OpenAI API error'
    });
  }
}
