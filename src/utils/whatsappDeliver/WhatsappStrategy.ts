import dotenv from 'dotenv';
import { Twilio } from 'twilio';
import { IMessage, INotification } from './interfaces';

dotenv.config();

const {
  TWILIO_NUMBER_PRODUCTION,
  TWILIO_ACCOUNT_SID,
  TWILIO_ACCOUNT_AUTH_TOKEN,
} = process.env;

class TwilioRepository implements INotification {
  private client;

  constructor() {
    this.client = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_ACCOUNT_AUTH_TOKEN);
  }

  async sendMessage(messageProp: IMessage) {
    const { message, phone } = messageProp;
    return this.client.messages.create({
      from: `whatsapp:${TWILIO_NUMBER_PRODUCTION}`,
      to: `whatsapp:${phone}`,
      body: message,
    });
  }
}

export default TwilioRepository;
