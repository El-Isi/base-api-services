import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import DataResponse from '../../../utils/responses/DataResponse';
import ErrorResponse from '../../../utils/errors/ErrorResponse';
import SendWhatsapp from '../../whatsappDeliver/SendWhatsapp';

export default class UtilsController {
  async sendWhatsapp(req: Request, res: Response, next: NextFunction) {
    try {
      const item = req.body as any;
      const sendWhatsapp = new SendWhatsapp();
      const { dataMessage, templateMessage, phone } = item;
      const user = await sendWhatsapp.exec(dataMessage, templateMessage, phone);
      const returnValue = new DataResponse({user});
      return res.status(StatusCodes.CREATED).json(returnValue);
    }
    catch (e) {
      const returnValue = new ErrorResponse({ message: e.message, error: e });
      return res.status(StatusCodes.UNAUTHORIZED).json(returnValue);
    }
  }
}
