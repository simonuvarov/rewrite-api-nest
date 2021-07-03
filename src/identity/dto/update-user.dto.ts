import { PartialType } from '@nestjs/mapped-types';
import { StudentCredentialsDto } from './student-credentials';

export class UpdateStudentDto extends PartialType(StudentCredentialsDto) {}
