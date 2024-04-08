interface IUserLogged {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  client: string;
  bearer: any;
}

export default IUserLogged;