import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createURL,
  generateCodeResponse,
  getAllWebsites,
  getWebBySlug,
  getWebsitesById,
  updateWebsite,
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
/**
 * @route GET api/web/site/:slug
 * @desc Get website by id
 */
websiteRouter.get("/site/:slug", getWebBySlug);

/**
 * @route GET api/web/site/:id
 * @desc Generate Public URL
 */
websiteRouter.post("/site/:id", isAuthenticated, createURL);

/**
 * @route PUT api/web/update/:id
 * @desc Update the code
 */
websiteRouter.put("/update/:id", isAuthenticated, updateWebsite);

export default websiteRouter;
