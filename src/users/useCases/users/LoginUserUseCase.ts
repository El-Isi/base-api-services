import normalizeEmail from 'normalize-email';

import IUserModel from '../../model/IUserModel';
import UserRepository from '../../repository/UserRepository';
import InvalidCredentials from '../errors/InvalidCredentials';

import * as bcrypt from '../../../utils/bcrypt';
import UserNotFoundError from '../errors/UserNotFoundError';

export default class LoginUserUseCase {
  private async isPasswordValid(password: string, user: IUserModel): Promise<boolean> {
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new InvalidCredentials();
    return isValid;
  }

  async exec(email: string, password: string): Promise<Object> {
    const userRepository = new UserRepository();
    const newEmail = normalizeEmail(email);
    const foundUser = await userRepository.findOne({email: newEmail});

    if (!foundUser) throw new UserNotFoundError();
    await this.isPasswordValid(password, foundUser);

    return foundUser;
  }
}