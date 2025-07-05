import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({ title: 'Tên tài khoản', example: 'admin' })
  @IsString({ message: 'Tên tài khoản phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên tài khoản không được để trống' })
  @Matches(/^[a-zA-Z0-9_.]+$/, {
    message: 'Tên tài khoản không được chứa dấu cách hoặc ký tự đặc biệt',
  })
  @Transform(({ value }) => value?.toLowerCase())
  username: string;

  @ApiProperty({ title: 'Họ tên', example: 'Nguyễn Văn A' })
  @IsString({ message: 'Họ tên phải là chuỗi' })
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  fullName: string;

  @ApiProperty({ title: 'Mật khẩu', example: '123456' })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @Length(6, 20, {
    message: 'Mật khẩu phải từ 6 đến 20 ký tự',
  })
  password: string;

  @ApiProperty({ title: 'Email', example: 'abcdef@email.com', required: false })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsOptional()
  email: string;

  @ApiProperty({
    title: 'Sô điện thoại',
    example: '0987654321',
    required: false,
  })
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  @IsOptional()
  phone: string;
}
