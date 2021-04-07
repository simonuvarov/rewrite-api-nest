import { CreatePaperDto } from './create-paper.dto';

export class UpdatePaperDto extends CreatePaperDto {
  question: string;
  body: string;
}
