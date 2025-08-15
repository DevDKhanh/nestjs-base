import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as chalk from 'chalk';
import * as signale from 'signale';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    const requestStart = Date.now();
    res.on('finish', () => {
      const { method, url, body, params, query } = req;
      const { statusCode } = res;
      let log = `${chalk.yellow(method)} ${chalk.blueBright(JSON.stringify(body))} ${chalk.greenBright(url)} ${chalk.yellow(statusCode)} - ${chalk.red(Date.now() - requestStart)} ms - ${chalk.yellowBright(req.headers['user-agent'])}`;
      this.logger.info(log);
      if (statusCode >= 200 && statusCode <= 400) {
        signale.success(log);
      } else {
        signale.debug(log);
      }
    });
    res.on('error', (err: Error) => {
      signale.fatal(err);
    });
    next();
  }
}
