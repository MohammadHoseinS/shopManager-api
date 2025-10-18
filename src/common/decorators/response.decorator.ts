import { SetMetadata } from '@nestjs/common';

/**
 * Response decorator key
 */
export const ResponseMessageKey = 'ResponseMessageKey';

/**
 * Global response message decorator,
 * decorate each controller endpoint for response messaging,
 * the message will be automaticlly translated by interceptor service
 */
export const ResponseMessage = (message: string) => SetMetadata(ResponseMessageKey, message);
