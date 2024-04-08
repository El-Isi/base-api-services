interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  client: string;
  phone: string;
  password: string;
  socketId?: string;
}

export default IUser;