import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DeviceInfoMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Lấy deviceId từ header hoặc query
    req['deviceId'] = req.headers['x-device-id'] || req.query.deviceId || null;
    // Lấy IP client
    req['clientIp'] = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    next();
  }
}