import TwilioRepository from "./WhatsappStrategy";

class SendWhatsapp {
  formatMessage(dataMessage, templateMessage) {
    const message = templateMessage.replace(
      /{(\w+)}/g,
      (match, key) => dataMessage[key] ? dataMessage[key] : match
    );
    return message;
  }

  async exec(dataMessage, templateMessage, phone) {
    const twilioRepo = new TwilioRepository();
    const message = this.formatMessage(dataMessage, templateMessage);
    const messageToSend = { message, phone: phone };
    console.log(messageToSend);
    const response = await twilioRepo.sendMessage(messageToSend);
    return response;
  }
}

export default SendWhatsapp;
