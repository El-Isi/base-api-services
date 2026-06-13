import IRoute from "../../baseInterfaces/IRoute";
import UtilsController from "../controller/utilsController";

const URL_BASE = "/utils";
const utilsController = new UtilsController();

const routes: IRoute[] = [
  // --- Messaging ---
  {
    path: URL_BASE + "/sendWhatsapp",
    method: "post",
    handler: [utilsController.sendWhatsapp],
  },
  {
    path: URL_BASE + "/sendEmail",
    method: "post",
    handler: [utilsController.sendEmail],
  },

  // --- AI ---
  {
    path: URL_BASE + "/openAI",
    method: "post",
    handler: [utilsController.openAi],
  },

  // --- Document Generation ---
  {
    path: URL_BASE + "/fillPdf",
    method: "post",
    handler: [utilsController.fillPdf],
  },
  {
    path: URL_BASE + "/generateQR",
    method: "post",
    handler: [utilsController.generateQR],
  },
  {
    path: URL_BASE + "/generatePass",
    method: "post",
    handler: [utilsController.generatePass],
  },

  // --- Crypto ---
  {
    path: URL_BASE + "/encrypt",
    method: "post",
    handler: [utilsController.encrypt],
  },
  {
    path: URL_BASE + "/decrypt",
    method: "post",
    handler: [utilsController.decrypt],
  },
];

export default routes;