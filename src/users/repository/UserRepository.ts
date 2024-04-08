import IUser from '../model/interfaces/IUser';
import IUserModel from '../model/IUserModel';
import UserSchema from '../dataAccess/UserSchema';

export default class UserRepository {
  create(user: IUser): Promise<IUserModel> {
    const newUser = new UserSchema(user);
    return newUser.save();
  }

  find(query: object = {}): Promise<IUserModel[]> {
    return UserSchema.find(query).exec();
  }

  findOne(query: object = {}): Promise<IUserModel | null> {
    return UserSchema.findOne(query).exec();
  }

  findById(id: string): Promise<IUserModel | null> {
    return UserSchema.findById(id).exec();
  }

  update(id: string, item: IUser): Promise<IUserModel | null> {
    return UserSchema.findByIdAndUpdate(id, item, { new: true }).exec();
  }

  delete(id: string): Promise<IUserModel | null> {
    return UserSchema.findByIdAndDelete(id).exec();
  }
}