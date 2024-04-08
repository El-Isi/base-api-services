import UserController from "../controllers/UserController";
import IRoute from "../../../utils/baseInterfaces/IRoute";
import * as authMiddleware from "../../../config/middleware/auth";

const URL_BASE = "/user";
const userController = new UserController();

const routes: IRoute[] = [
  {
    path: URL_BASE,
    method: "post",
    handler: [
      authMiddleware.auth.required,
      userController.store
    ],
  },

  {
    path: URL_BASE + "/:email",
    method: "get",
    handler: [
      authMiddleware.auth.required,
      userController.getUserByEmail
    ],
  },
];

export default routes;