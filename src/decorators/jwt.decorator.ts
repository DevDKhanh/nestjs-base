import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ClsServiceManager } from 'nestjs-cls';
import { Socket } from 'socket.io';
import { JwtData } from 'src/common';

// Decorator to get JWT data from context
export const Jwt = createParamDecorator(
  /**
   * Extracts JWT data from the execution context.
   * Supports HTTP, RPC, and WebSocket contexts.
   *
   * @param _data Unused parameter, can be used for additional data in the future.
   * @param _ctx ExecutionContext to determine the context type and retrieve JWT data accordingly.
   * @returns JwtData or undefined if not available.
   */
  (_data: any, _ctx: ExecutionContext): JwtData | undefined => {
    const contextType = _ctx.getType();

    switch (contextType) {
      case 'http':
      case 'rpc':
        // For HTTP and RPC contexts, retrieve JWT data from the CLS service
        return ClsServiceManager.getClsService().get<JwtData>('jwt');
      case 'ws':
        // For WebSocket context, retrieve JWT data from the client
        const client = _ctx.switchToWs().getClient() as Socket & {
          jwtData?: JwtData;
        };
        return client.jwtData;
      default:
        return undefined;
    }
  },
);
