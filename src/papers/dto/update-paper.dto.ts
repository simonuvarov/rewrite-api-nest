import { IsDefined } from 'class-validator';
import { CreatePaperDto } from './create-paper.dto';

export class UpdatePaperDto extends CreatePaperDto {
  @IsDefined()
  question: string;
  @IsDefined()
  body: string;
}
