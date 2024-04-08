
import IUser from '../../model/interfaces/IUser';
import UserRepository from '../../repository/UserRepository';

import * as bcrypt from '../../../utils/bcrypt';

class CreateUserUseCase {
  private async hashPassword (password: string): Promise<string> {
    const hash = await bcrypt.encrypt(password);
    return hash;
  }

  private async findUser(email: string) {
    const userRepository = new UserRepository();
    const _email = email.toLowerCase() ;
    const user = await userRepository.findOne({ email: _email });
    return !user;
  }

  async exec(user: IUser) {

    const existUser = await this.findUser(user.email);
    if (!existUser) {
      throw new Error('El usuario ya existe');
    }
    const email = user.email.toLowerCase();
    const password = await this.hashPassword(user.password);
    const firstName = user.firstName;
    const lastName = user.lastName;
    const phone = user.phone;
    const client = user.client;
    const userRepository = new UserRepository();

    const _user = {
      email,
      password,
      firstName,
      lastName,
      phone,
      client,
    } as IUser;

    const userCreated = await userRepository.create(_user);
    userCreated.password = '';
    return userCreated;
  }
}

export default CreateUserUseCase;
