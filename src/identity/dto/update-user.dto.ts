import { PartialType } from '@nestjs/mapped-types';
import { UserCredentialsDto } from './user-credentials';

export class UpdateUserDto extends PartialType(UserCredentialsDto) {}
