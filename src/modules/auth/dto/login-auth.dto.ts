import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    title: 'Tên đăng nhập',
    example: 'admin',
  })
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  username: string;

  @ApiProperty({
    title: 'Mật khẩu',
    example: '123456',
  })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
}
