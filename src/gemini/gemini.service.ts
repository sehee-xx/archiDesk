import { Injectable } from '@nestjs/common';
import { DeskService } from 'src/desk/desk.service';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class GeminiService {
  constructor(private readonly deskService: DeskService) {}

  async getRecommendationsByJob(job: string, page: string): Promise<any> {
    const apiKey = process.env.GENERATIVE_AI_API_KEY;
    const model = 'models/gemini-1.5-pro-latest';
    const version = 'v1beta';
    const url = `https://generativelanguage.googleapis.com/${version}/${model}:generateContent?key=${apiKey}`;

    let prompt: string;

    switch (page) {
      case 'desk':
        prompt = `{recommendations:[ { “name": "Dual Motor Standing Desk L", "pros": ["Large work surface", "Wide height adjustability", "Ample storage space", "Convenient features"], "cons": ["Expensive"] }, { “name": "Smart Standing Desk Standy", "pros": ["Reasonable price", "Wide height adjustability", "Ample storage space"], "cons": ["Slower speed than dual motor models", "No keyboard tray"] }, { “name": "Computer Desk L Oak", "pros": ["Budget-friendly", "Simple design"], "cons": ["Non-adjustable height", "Limited storage space"] }, { “name": "Gaming Desk Elite", "pros": ["Large work surface", "Dedicated storage for gaming accessories"], "cons": ["Non-adjustable height"] }, { “name": "Standing Desk Pro", "pros": ["Reasonable price", "Simple design", "Adjustable height"], "cons": ["Limited storage space"] } ]}  자 너의 직업은 책상 판매원이야 이제 ${job}에게 추천해주고 싶은 책상 8가지를 위의 형식이랑 완전 똑같이 작성해서 보여줘, recommendations 안에 name, pros, cons를 넣어주면 돼`;
        break;
      case 'monitor':
        prompt = `{recommendations:[ { “name": "Dual Motor Standing Desk L", "pros": ["Large work surface", "Wide height adjustability", "Ample storage space", "Convenient features"], "cons": ["Expensive"] }, { “name": "Smart Standing Desk Standy", "pros": ["Reasonable price", "Wide height adjustability", "Ample storage space"], "cons": ["Slower speed than dual motor models", "No keyboard tray"] }, { “name": "Computer Desk L Oak", "pros": ["Budget-friendly", "Simple design"], "cons": ["Non-adjustable height", "Limited storage space"] }, { “name": "Gaming Desk Elite", "pros": ["Large work surface", "Dedicated storage for gaming accessories"], "cons": ["Non-adjustable height"] }, { “name": "Standing Desk Pro", "pros": ["Reasonable price", "Simple design", "Adjustable height"], "cons": ["Limited storage space"] } ]}  자 너의 직업은 모니터 판매원이야 이제 ${job}에게 추천해주고 싶은 모니터 8가지를 위의 형식이랑 완전 똑같이 작성해서 보여줘, recommendations 안에 name, pros, cons를 넣어주면 돼`;
        break;
      case 'keyboard':
        prompt = `{recommendations:[ { “name": "Dual Motor Standing Desk L", "pros": ["Large work surface", "Wide height adjustability", "Ample storage space", "Convenient features"], "cons": ["Expensive"] }, { “name": "Smart Standing Desk Standy", "pros": ["Reasonable price", "Wide height adjustability", "Ample storage space"], "cons": ["Slower speed than dual motor models", "No keyboard tray"] }, { “name": "Computer Desk L Oak", "pros": ["Budget-friendly", "Simple design"], "cons": ["Non-adjustable height", "Limited storage space"] }, { “name": "Gaming Desk Elite", "pros": ["Large work surface", "Dedicated storage for gaming accessories"], "cons": ["Non-adjustable height"] }, { “name": "Standing Desk Pro", "pros": ["Reasonable price", "Simple design", "Adjustable height"], "cons": ["Limited storage space"] } ]}  자 너의 직업은 키보드 판매원이야 이제 ${job}에게 추천해주고 싶은 키보드 8가지를 위의 형식이랑 완전 똑같이 작성해서 보여줘, recommendations 안에 name, pros, cons를 넣어주면 돼`;
        break;
      case 'mouse':
        prompt = `{recommendations:[ { “name": "Dual Motor Standing Desk L", "pros": ["Large work surface", "Wide height adjustability", "Ample storage space", "Convenient features"], "cons": ["Expensive"] }, { “name": "Smart Standing Desk Standy", "pros": ["Reasonable price", "Wide height adjustability", "Ample storage space"], "cons": ["Slower speed than dual motor models", "No keyboard tray"] }, { “name": "Computer Desk L Oak", "pros": ["Budget-friendly", "Simple design"], "cons": ["Non-adjustable height", "Limited storage space"] }, { “name": "Gaming Desk Elite", "pros": ["Large work surface", "Dedicated storage for gaming accessories"], "cons": ["Non-adjustable height"] }, { “name": "Standing Desk Pro", "pros": ["Reasonable price", "Simple design", "Adjustable height"], "cons": ["Limited storage space"] } ]}  자 너의 직업은 마우스 판매원이야 이제 ${job}에게 추천해주고 싶은 마우스 8가지를 위의 형식이랑 완전 똑같이 작성해서 보여줘, recommendations 안에 name, pros, cons를 넣어주면 돼`;
        break;
      default:
        throw new Error('Invalid page type');
    }

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { response_mime_type: 'application/json' },
    };

    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // 전체 응답 객체를 출력하여 구조를 확인
      console.log('Full response:', JSON.stringify(response.data, null, 2));

      // 응답에서 필요한 데이터를 추출
      if (response.data.candidates && response.data.candidates.length > 0) {
        const candidate = response.data.candidates[0];
        if (
          candidate.content &&
          candidate.content.parts &&
          candidate.content.parts.length > 0
        ) {
          const recommendations = candidate.content.parts[0].text;
          return JSON.parse(recommendations);
        } else {
          throw new Error('No valid content found in response candidates');
        }
      } else {
        throw new Error('No valid candidates found in response');
      }
    } catch (error) {
      console.error('Error generating or parsing response:', error);
      if (error.response) {
        console.log(
          'Response object:',
          JSON.stringify(error.response.data, null, 2),
        );
      }
      throw new Error('Failed to generate or parse recommendations response');
    }
  }
}
