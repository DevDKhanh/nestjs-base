import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RefeshToken } from './entities/refeshToken.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as md5 from 'md5';

@Injectable()
export class RefeshTokenService {
  private logger = new Logger(RefeshTokenService.name);

  constructor(
    @InjectRepository(RefeshToken)
    private readonly refeshTokenRepository: Repository<RefeshToken>,
  ) {}

  async saveRefeshToken(
    userId: string,
    refeshToken: string,
    deviceId?: string,
  ) {
    try {
      const existingToken = await this.refeshTokenRepository.findOne({
        where: {
          account: {
            id: userId,
          },
        },
      });
      this.logger.debug(`RefeshToken token: ${refeshToken}`);
      const hash = await bcrypt.hash(md5(refeshToken), 5);

      this.logger.debug(`RefeshToken hash: ${hash}`);

      if (existingToken) {
        existingToken.token = hash;
        this.logger.debug(`Updating existing refresh token for user ${userId}`);
        return await this.refeshTokenRepository.save(existingToken);
      }

      const newRefeshToken = this.refeshTokenRepository.create({
        account: {
          id: userId,
        },
        token: hash,
        deviceId,
      });

      this.logger.debug(`Creating new refresh token for user ${userId}`);
      return await this.refeshTokenRepository.save(newRefeshToken);
    } catch (error) {
      this.logger.error('Error saving refresh token', error);
    }
  }

  async validateRefeshToken(id: string, refeshToken: string) {
    try {
      const existingToken = await this.refeshTokenRepository.findOne({
        where: { account: { id } },
      });

      if (!existingToken) {
        this.logger.debug(`No refresh token found for user ${id}`);
        return false;
      }

      const isValid = await bcrypt.compare(
        md5(refeshToken),
        existingToken.token,
      );

      this.logger.debug(
        `Refresh token validation for user ${id} on refeshToken ${refeshToken}: ${isValid}`,
      );

      return isValid;
    } catch (error) {
      this.logger.error('Error validating refresh token', error);
    }
  }
}
