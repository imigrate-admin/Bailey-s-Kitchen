import { Request, Response, NextFunction } from 'express';
import { validate as classValidate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const validate = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObj = plainToClass(dtoClass, req.body);
    const errors = await classValidate(dtoObj);

    if (errors.length > 0) {
      const errorMessages = errors.map(error => ({
        property: error.property,
        constraints: error.constraints
      }));

      return res.status(400).json({
        error: 'Validation Error',
        statusCode: 400,
        details: errorMessages
      });
    }

    req.body = dtoObj;
    next();
  };
};

