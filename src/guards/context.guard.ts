import {
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  Optional,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { ClsGuard, ClsGuardOptions, ClsServiceManager } from 'nestjs-cls';
import { env } from 'process';
import { Socket } from 'socket.io';
import { JwtData } from 'src/common';

/**
 * Manually initialize request context for different transports (http, rpc, ws) using nestjs-cls (AsyncLocalStorage)
 * which is more flexible than the standard NestJS Context object and add some auth/tracing data to it.
 */
@Injectable()
export class ContextGuard extends ClsGuard {
  readonly logger = new Logger(ContextGuard.name);

  constructor(
    @Inject(ClsGuardOptions.name)
    options: Omit<ClsGuardOptions, 'mount'>,
    @Optional() private readonly jwtService: JwtService,
  ) {
    super(options);
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const requestId = await this.getOrCreateRequestId(context);
    const jwtData = await this.extractUserFromJwt(context);

    const cls = ClsServiceManager.getClsService();
    cls.set('requestId', requestId);
    cls.set('jwt', jwtData);

    return true;
  }

  /**
   * Generate a unique id for the request context, useful to trace calls between microservices with different
   * transports.
   *
   * @param context
   * @returns request id
   */
  private getOrCreateRequestId(context: ExecutionContext): string {
    const contextType = context.getType();

    switch (contextType) {
      case 'http':
        const request = context.switchToHttp().getRequest();
        return request.headers?.['X-Request-Id'] || randomUUID();

      // case 'rpc':
      //   const metadata: Metadata = context.switchToRpc().getContext();
      //   return (metadata.get('requestId')[0] as string) ?? randomUUID();

      case 'ws':
        return randomUUID();
      default:
        return randomUUID();
    }
  }

  /**
   * Extract jwt data depending on context type:
   * - http: from cookie, decoding and verifying the jwt
   * - rpc: from metadata, assuming jwt is already decoded and verified at http level
   * - ws: from Socket.IO socket object, stored there from the cookie exchanged during connection handshake
   *
   * @param context
   * @returns verified and decoded jwt or undefined if not found or malformed
   */
  private async extractUserFromJwt(
    context: ExecutionContext,
  ): Promise<JwtData | undefined> {
    const contextType = context.getType();

    switch (contextType) {
      case 'http':
        const request = context.switchToHttp().getRequest();
        const jwtHeader = request.headers?.authorization?.split(' ')[1];
        const jwtCookie = request?.cookies?.[env['JWT_NAME'] as string];
        const jwt = jwtCookie || jwtHeader;
        if (!jwt) {
          return undefined;
        }
        try {
          const jwtData = await this.jwtService.verifyAsync<JwtData>(jwt);
          return jwtData;
        } catch (_err: unknown) {
          return undefined;
        }

      // case 'rpc':
      //   const metadata: Metadata = context.switchToRpc().getContext();
      //   const grpcJwt: string = metadata.get(
      //     env['JWT_NAME'] as string,
      //   )[0] as string;
      //   if (!grpcJwt || grpcJwt === 'undefined') {
      //     return undefined;
      //   }
      //   const jwtData = JSON.parse(grpcJwt) as JwtData;
      //   return jwtData;

      case 'ws':
        const client = context.switchToWs().getClient() as Socket & {
          jwtData?: JwtData;
        };
        return client.jwtData;
    }
  }
}
