import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { generateCodeResponse } from "../controllers/website.controller.js";

const websiteRouter = express.Router();

websiteRouter.post("/gensite",isAuthenticated,generateCodeResponse);


export default websiteRouter;