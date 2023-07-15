// import { Controller, SuccessResponse } from 'tsoa';

import { NextFunction, Request, Response } from 'express';

export abstract class BaseController {
  protected abstract executeImpl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  public async execute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await this.executeImpl(req, res, next);
    } catch (err) {
      console.log(`[BaseController]: Uncaught controller error`);
      console.log(err);
      // this.fail(res, 'An unexpected error ocurred');
    }
  }
  public static jsonResponse(
    res: Response,
    body: { status: number, code: string, message: string }
  ) {
    res.status(body.status).json({ code: body.code, message: body.message });
  }

  public ok<T>(
    res: Response,
    body: {status: number, 
    code: string, 
    message: string},
    dto?: T 
  ) {
    if (!!dto) {
      res.type('application/json');
      return res.status(body.status).json({ code: body.code, message: body.message, data: dto });
    } else {
      return BaseController.jsonResponse(res, body)
    }
  }

  public created(res: Response) {
    res.sendStatus(201);
  }

  public clientError(res: Response, body: {status: number, code: string, message: string}) {
    return BaseController.jsonResponse(res, body);
  }

  public unauthorized(res: Response, body: {status: number, code: string, message: string}) {
    return BaseController.jsonResponse(res, body);
  }

  public forbidden(res: Response, body: {status: number, code: string, message: string}) {
    return BaseController.jsonResponse(res, body);
  }

  public notFound(res: Response, body: {status: number, code: string, message: string}) {
    return BaseController.jsonResponse(res, body);
  }

  public fail(res: Response, error: Error | string) {
    console.log(error);
    return res.status(500).json({
      code: 'internal_server_error',
      message: error.toString()
    });
  }
}
