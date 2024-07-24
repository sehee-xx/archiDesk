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
        prompt = `Recommend a desk that fits ${job} and explain the pros and cons of each product`;
        break;
      case 'monitor':
        prompt = `Recommend a monitor that fits ${job} and explain the pros and cons of each product`;
        break;
      case 'keyboard':
        prompt = `Recommend a keyboard that fits ${job} and explain the pros and cons of each product`;
        break;
      case 'mouse':
        prompt = `Recommend a mouse that fits ${job} and explain the pros and cons of each product`;
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
