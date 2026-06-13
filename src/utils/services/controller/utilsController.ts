import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import DataResponse from '../../../utils/responses/DataResponse';
import ErrorResponse from '../../../utils/errors/ErrorResponse';
import SendWhatsapp from '../../whatsappDeliver/SendWhatsapp';
import OpenAIChat from '../../textGenerator/OpenAIChat';
import SendEmail from '../../emailDeliver/SendEmail';
import FillPdfUseCase from '../../pdfGenerator/FillPdfUseCase';
import { generateQrCode } from '../../pdfGenerator/GenerateQR';
import IOSPassGenerator from '../../ticketGenerator/IOS/IOSPassGenerator';
import { encryptData, decryptData, encryptKeys, decryptKeys } from '../../../config/cripto';

export default class UtilsController {
  async sendWhatsapp(req: Request, res: Response, next: NextFunction) {
    try {
      const item = req.body as any;
      const sendWhatsapp = new SendWhatsapp();
      const { dataMessage, templateMessage, phone } = item;
      const result = await sendWhatsapp.exec(dataMessage, templateMessage, phone);
      const returnValue = new DataResponse({ result });
      return res.status(StatusCodes.CREATED).json(returnValue);
    } catch (e) {
      const returnValue = new ErrorResponse({ message: e.message, error: e });
      return res.status(StatusCodes.BAD_REQUEST).json(returnValue);
    }
  }

  async openAi(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, model, temperature, maxTokens, systemPrompt } = req.body as any;
      const openAIChat = new OpenAIChat();
      const chat = await openAIChat.exec(message, { model, temperature, maxTokens, systemPrompt });
      const returnValue = new DataResponse({ chat });
      return res.status(StatusCodes.OK).json(returnValue);
    } catch (e) {
      const returnValue = new ErrorResponse({ message: e.message, error: e });
      return res.status(StatusCodes.BAD_REQUEST).json(returnValue);
    }
  }

  async sendEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const emailParams = req.body as any;
      const sendEmail = new SendEmail();
      const result = await sendEmail.exec(emailParams);
      const returnValue = new DataResponse({ statusCode: 202, message: 'Email enviado correctamente' });
      return res.status(StatusCodes.OK).json(returnValue);
    } catch (e) {
      const returnValue = new ErrorResponse({ message: e.message, error: e });
      return res.status(StatusCodes.BAD_REQUEST).json(returnValue);
    }
  }

  async fillPdf(req: Request, res: Response, next: NextFunction) {
    try {
      const values = req.body as any;
      const fillPdfUseCase = new FillPdfUseCase();
      const pdfBuffer = await fillPdfUseCase.exec(values);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="generated.pdf"',
        'Content-Length': pdfBuffer.length,
      });
      return res.status(StatusCodes.OK).send(pdfBuffer);
    } catch (e) {
      const returnValue = new ErrorResponse({ message: e.message, error: e });
      return res.status(StatusCodes.BAD_REQUEST).json(returnValue);
    }
  }

  async generateQR(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, options = {} } = req.body as any;
      const qrBuffer = await generateQrCode({ qrData: data, ...options });
      res.set({
        'Content-Type': 'image/png',
        'Content-Disposition': 'inline; filename="qrcode.png"',
        'Content-Length': qrBuffer.length,
      });
      return res.status(StatusCodes.OK).send(qrBuffer);
    } catch (e) {
      const returnValue = new ErrorResponse({ message: e.message, error: e });
      return res.status(StatusCodes.BAD_REQUEST).json(returnValue);
    }
  }

  async generatePass(req: Request, res: Response, next: NextFunction) {
    try {
      const passData = req.body as any;
      const iosPassGenerator = new IOSPassGenerator();
      const passBuffer = await iosPassGenerator.generatePass(passData);
      res.set({
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': 'attachment; filename="pass.pkpass"',
        'Content-Length': passBuffer.length,
      });
      return res.status(StatusCodes.OK).send(passBuffer);
    } catch (e) {
      const returnValue = new ErrorResponse({ message: e.message, error: e });
      return res.status(StatusCodes.BAD_REQUEST).json(returnValue);
    }
  }

  async encrypt(req: Request, res: Response, next: NextFunction) {
    try {
      const { text, type = 'data' } = req.body as any;
      if (!text) throw new Error('El campo "text" es requerido');
      const encrypted = type === 'keys' ? encryptKeys(text) : encryptData(text);
      const returnValue = new DataResponse({ encrypted });
      return res.status(StatusCodes.OK).json(returnValue);
    } catch (e) {
      const returnValue = new ErrorResponse({ message: e.message, error: e });
      return res.status(StatusCodes.BAD_REQUEST).json(returnValue);
    }
  }

  async decrypt(req: Request, res: Response, next: NextFunction) {
    try {
      const { text, type = 'data' } = req.body as any;
      if (!text) throw new Error('El campo "text" es requerido');
      const decrypted = type === 'keys' ? decryptKeys(text) : decryptData(text);
      const returnValue = new DataResponse({ decrypted });
      return res.status(StatusCodes.OK).json(returnValue);
    } catch (e) {
      const returnValue = new ErrorResponse({ message: e.message, error: e });
      return res.status(StatusCodes.BAD_REQUEST).json(returnValue);
    }
  }
}
