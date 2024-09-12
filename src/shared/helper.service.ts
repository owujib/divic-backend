import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class HelperService {
  comparePasswords(plainPassword: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }

  hashPassword(plainPassword: string): string {
    return bcrypt.hashSync(plainPassword, 10);
  }

  hashBiometricKey(biometricKey: string): string {
    return crypto.createHash('sha256').update(biometricKey).digest('hex');
  }
}
