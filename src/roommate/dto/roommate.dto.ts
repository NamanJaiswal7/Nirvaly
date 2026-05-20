import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferences?: string[];
}

export class AddMemberDto {
  @IsString()
  userId: string;
}

export class CreatePollDto {
  @IsString()
  propertyId: string;
}

export class VotePropertyDto {
  @IsString()
  decision: 'LIKE' | 'PASS';
}
