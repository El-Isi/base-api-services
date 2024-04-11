import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import DataResponse from '../../../utils/responses/DataResponse';
import ErrorResponse from '../../../utils/errors/ErrorResponse';
import SendWhatsapp from '../../whatsappDeliver/SendWhatsapp';
import OpenAIChat from '../../textGenerator/OpenAIChat';

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
  async openAi(req: Request, res: Response, next: NextFunction) {
    try {
      const { message } = req.body as any;
      const openAIChat = new OpenAIChat();
      const chat = await openAIChat.exec(message);
      const returnValue = new DataResponse({ chat });
      return res.status(StatusCodes.CREATED).json(returnValue);
    }
    catch (e) {
      const returnValue = new ErrorResponse({ message: e.message, error: e });
      return res.status(StatusCodes.UNAUTHORIZED).json(returnValue);
    }
  }
}
