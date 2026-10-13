import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../core/errors/AppError';
import { logger } from '../core/logger/logger';
import { config } from '../config';
import { CorrelatedRequest } from './requestId';

export function errorHandler(
  err: any,
  req: CorrelatedRequest,
  res: Response,
  next: NextFunction
): void {
  const requestId = req.id;

  // 1. Known Operational AppErrors
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(`[AppError ${err.statusCode}] ${err.message}`, { details: err.details, stack: err.stack }, requestId);
    } else {
      logger.warn(`[ClientError ${err.statusCode}] ${err.message}`, { details: err.details }, requestId);
    }

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
      requestId,
    });
    return;
  }

  // 2. Zod Validation Errors
  if (err instanceof z.ZodError) {
    const primaryMsg = err.errors[0]?.message || 'Invalid input data';
    logger.warn(`[ValidationError] ${primaryMsg}`, { errors: err.errors }, requestId);

    res.status(400).json({
      success: false,
      message: primaryMsg,
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
      requestId,
    });
    return;
  }

  // 3. Prisma Known Request Errors
  if (err.code && typeof err.code === 'string' && err.code.startsWith('P')) {
    logger.error(`[PrismaError ${err.code}] Database error`, { meta: err.meta }, requestId);

    if (err.code === 'P2002') {
      const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field';
      res.status(409).json({
        success: false,
        message: `A record with this ${target} already exists.`,
        requestId,
      });
      return;
    }

    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'The requested resource does not exist or has been removed.',
        requestId,
      });
      return;
    }

    if (err.code === 'P2003') {
      res.status(400).json({
        success: false,
        message: 'Invalid foreign key reference provided.',
        requestId,
      });
      return;
    }
  }

  // 4. Unexpected / Unhandled Internal Errors
  logger.error(`[UnhandledError] ${err.message || 'Unknown error'}`, { stack: err.stack }, requestId);

  const isDev = config.nodeEnv === 'development';
  res.status(500).json({
    success: false,
    message: isDev ? err.message || 'Internal Server Error' : 'Internal Server Error. Please contact support.',
    ...(isDev ? { stack: err.stack } : {}),
    requestId,
  });
}
