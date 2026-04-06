import { ApiProperty } from '@nestjs/swagger'

export class CreateUserSwaggerDto {
  constructor(
    name: string,
    email: string,
    password: string,
    role: 'ADMIN' | 'CLIENT',
  ) {
    this.name = name
    this.email = email
    this.password = password
    this.role = role
  }

  @ApiProperty({ example: 'Felipe Yui' })
  name: string

  @ApiProperty({ example: 'felipe@example.com' })
  email: string

  @ApiProperty({ example: '123456' })
  password: string

  @ApiProperty({ enum: ['ADMIN', 'CLIENT'] })
  role: 'ADMIN' | 'CLIENT'
}
