import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType('loginInput', { isAbstract: true })
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  password: string;
}

@InputType('biometricInput', { isAbstract: true })
export class BiometricLoginInput {
  @Field()
  @IsString()
  biometricKey: string;
}
