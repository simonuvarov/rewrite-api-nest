import { PartialType } from '@nestjs/mapped-types';
import { UserCrednetialsDto } from './user-credentials.dto';

export class UpdateUserDto extends PartialType(UserCrednetialsDto) {}
