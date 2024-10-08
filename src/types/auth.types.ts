import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../auth/user.model';

@ObjectType()
export class ErrorType {
  @Field()
  message: string;

  @Field({ nullable: true })
  code?: string;
}

@ObjectType()
export class RegisterResponse {
  @Field(() => User, { nullable: true })
  user?: User | any;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
@ObjectType()
export class SetBiometricResponse {
  @Field()
  message?: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class LoginResponse {
  @Field(() => User)
  user?: User | any;

  @Field()
  accessToken?: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
