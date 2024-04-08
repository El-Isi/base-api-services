/* eslint-disable no-unused-vars */
import { IMessage } from './IMessage';

export interface INotification {
  sendMessage(message: IMessage): Promise<void>
}
