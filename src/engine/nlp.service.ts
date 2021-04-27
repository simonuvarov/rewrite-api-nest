import { Injectable } from '@nestjs/common';
import nlp from 'compromise';
import path from 'path';
import Piscina from 'piscina';

export type ParsedText = nlp.Document;

@Injectable()
export class NlpService {
  private pool = new Piscina({
    filename: path.resolve(__dirname, 'nlp.worker.js'),
    maxThreads: 10,
  });

  async parse(text: string): Promise<ParsedText> {
    const result = await this.pool.runTask(text);

    return nlp.fromJSON(result);
  }
}
