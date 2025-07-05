import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefeshTokenDto {
  @ApiProperty({
    title: 'Refesh Token',
    example: 'token JWT',
  })
  @IsNotEmpty({ message: 'Refesh token không được để trống' })
  refeshToken: string;
}
