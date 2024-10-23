import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

export class JwtSign {
  constructor(private jwtService: JwtService) {}
  public async getJwtToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
