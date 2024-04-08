import IRoute from "../../baseInterfaces/IRoute";
import UtilsController from "../controller/utilsController";

const URL_BASE = "/utils";
const userController = new UtilsController();

const routes: IRoute[] = [
  {
    path: URL_BASE + "/sendWhatsapp",
    method: "post",
    handler: [
      userController.sendWhatsapp
    ],
  },
];

export default routes;