import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: '',
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: '프롬프트가 필요합니다.' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "당신은 Flutter 코드 생성 전문가입니다. 사용자의 자연어 설명을 바탕으로 정확하고 실행 가능한 Flutter 코드를 생성해주세요. 코드만 반환하고 설명은 하지 마세요."
        },
        {
          role: "user",
          content: `다음 설명에 맞는 Flutter 코드를 생성해주세요: ${prompt}`
        }
      ],
    });

    const generatedCode = completion.choices[0].message.content;
    
    // 코드 블록만 추출하는 로직
    let code = generatedCode || '';
    if (code.includes('```dart')) {
      code = code.split('```dart')[1].split('```')[0].trim();
    } else if (code.includes('```')) {
      code = code.split('```')[1].split('```')[0].trim();
    }

    return NextResponse.json({ code });
  } catch (error) {
    console.error('API 오류:', error);
    return NextResponse.json(
      { error: '코드 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 