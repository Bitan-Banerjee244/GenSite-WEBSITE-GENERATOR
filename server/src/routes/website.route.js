import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  generateCodeResponse,
  getAllWebsites,
  getWebsitesById,
} from "../controllers/website.controller.js";

const websiteRouter = express.Router();

/**
 * @route POST /api/web/gensite
 * @desc Generate Website
 */
websiteRouter.post("/gensite", isAuthenticated, generateCodeResponse);
/**
 * @route GET /api/web/getsite
 * @desc Get all websites of an user
 */
websiteRouter.get("/getsite", isAuthenticated, getAllWebsites);
/**
 * @route GET /api/web/getsitebyid/:id
 * @desc Get website by id
 */
websiteRouter.get("/getsitebyid/:id", isAuthenticated, getWebsitesById);

export default websiteRouter;
