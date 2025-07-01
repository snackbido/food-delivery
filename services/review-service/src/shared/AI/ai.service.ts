import { Injectable, OnModuleInit } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs';

interface SentimentAnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  confidence: number;
  keywords: string[];
  emotions: { [key: string]: number };
  categories: string[];
}

@Injectable()
export class AiService implements OnModuleInit {
  private model: tf.LayersModel;
  private tokenizer: any;
  private readonly positiveWords: string[] = [
    'tuyệt vời',
    'ngon',
    'tốt',
    'xuất sắc',
    'hoàn hảo',
    'thích',
    'yêu',
    'nhanh',
    'sạch sẽ',
    'thân thiện',
    'chất lượng',
    'tươi ngon',
    'ấm áp',
    'tiện lợi',
    'phục vụ tốt',
    'giá hợp lý',
    'đẹp',
    'sang trọng',
  ];

  private readonly negativeWords: string[] = [
    'tệ',
    'dở',
    'kém',
    'chậm',
    'bẩn',
    'thô lỗ',
    'đắt',
    'nhạt nhẽo',
    'cũ',
    'hỏng',
    'lạnh',
    'không ngon',
    'khó ăn',
    'tệ hại',
    'thất vọng',
    'không hài lòng',
    'phục vụ kém',
    'chờ lâu',
    'bực mình',
  ];

  async onModuleInit() {
    await this.initializeModel();
  }

  private async initializeModel() {
    try {
      // Tạo model đơn giản cho demo
      this.model = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [100], units: 64, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.5 }),
          tf.layers.dense({ units: 32, activation: 'relu' }),
          tf.layers.dense({ units: 3, activation: 'softmax' }), // positive, negative, neutral
        ],
      });

      this.model.compile({
        optimizer: 'adam',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
      });

      console.log('AI Model initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AI model:', error);
    }
  }

  async analyzeSentiment(text: string): Promise<SentimentAnalysisResult> {
    try {
      const normalizedText = this.normalizeText(text);
      const keywords = this.extractKeywords(normalizedText);
      const emotions = this.analyzeEmotions(normalizedText);
      const categories = this.categorizeReview(normalizedText);

      // Phân tích sentiment dựa trên từ khóa
      const sentimentScore = this.calculateSentimentScore(normalizedText);
      const sentiment = this.determineSentiment(sentimentScore);
      const confidence = Math.abs(sentimentScore);

      return {
        sentiment,
        score: sentimentScore,
        confidence,
        keywords,
        emotions,
        categories,
      };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return {
        sentiment: 'neutral',
        score: 0,
        confidence: 0,
        keywords: [],
        emotions: {},
        categories: [],
      };
    }
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(
        /[^\w\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹ]/g,
        '',
      )
      .trim();
  }

  private extractKeywords(text: string): string[] {
    // const words = text.split(/\s+/);
    const keywords = [];

    // Tìm từ khóa tích cực
    this.positiveWords.forEach((word) => {
      if (text.includes(word)) {
        keywords.push(word);
      }
    });

    // Tìm từ khóa tiêu cực
    this.negativeWords.forEach((word) => {
      if (text.includes(word)) {
        keywords.push(word);
      }
    });

    return [...new Set(keywords)];
  }

  private analyzeEmotions(text: string): { [key: string]: number } {
    const emotions = {
      joy: 0,
      anger: 0,
      sadness: 0,
      surprise: 0,
      fear: 0,
      disgust: 0,
    };

    // Phân tích cảm xúc dựa trên từ khóa
    if (this.positiveWords.some((word) => text.includes(word))) {
      emotions.joy += 0.8;
    }

    if (this.negativeWords.some((word) => text.includes(word))) {
      emotions.anger += 0.6;
      emotions.disgust += 0.4;
    }

    return emotions;
  }

  private categorizeReview(text: string): string[] {
    const categories = [];

    if (
      text.includes('thức ăn') ||
      text.includes('món') ||
      text.includes('ngon')
    ) {
      categories.push('thức ăn');
    }
    if (text.includes('phục vụ') || text.includes('nhân viên')) {
      categories.push('phục vụ');
    }
    if (text.includes('không gian') || text.includes('quán')) {
      categories.push('không gian');
    }
    if (text.includes('giá') || text.includes('tiền')) {
      categories.push('giá cả');
    }
    if (
      text.includes('giao hàng') ||
      text.includes('chậm') ||
      text.includes('nhanh')
    ) {
      categories.push('giao hàng');
    }

    return categories;
  }

  private calculateSentimentScore(text: string): number {
    let score = 0;
    // const words = text.split(/\s+/);

    // Tính điểm dựa trên từ khóa
    this.positiveWords.forEach((word) => {
      if (text.includes(word)) {
        score += 0.1;
      }
    });

    this.negativeWords.forEach((word) => {
      if (text.includes(word)) {
        score -= 0.1;
      }
    });

    // Chuẩn hóa điểm từ -1 đến 1
    return Math.max(-1, Math.min(1, score));
  }

  private determineSentiment(
    score: number,
  ): 'positive' | 'negative' | 'neutral' {
    if (score > 0.1) return 'positive';
    if (score < -0.1) return 'negative';
    return 'neutral';
  }

  async detectSpam(
    text: string,
  ): Promise<{ isSpam: boolean; confidence: number; reason?: string }> {
    const suspiciousPatterns = [
      /(.)\1{5,}/, // Lặp ký tự
      /[A-Z]{10,}/, // Toàn chữ hoa
      /(http|www)/i, // Link
      /\d{10,}/, // Số điện thoại
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(text)) {
        return {
          isSpam: true,
          confidence: 0.8,
          reason: 'Phát hiện pattern đáng ngờ trong nội dung',
        };
      }
    }

    // Kiểm tra độ dài
    if (text.length < 10) {
      return {
        isSpam: true,
        confidence: 0.6,
        reason: 'Nội dung quá ngắn',
      };
    }

    return { isSpam: false, confidence: 0 };
  }
}
