import express from "express";
import { Request, Response } from "express-serve-static-core";
import {BankManagerController} from "../controllers/bank-manager.controller";

const router = express.Router()
const bankManagerController = new BankManagerController();


router.get('/total-balance', (req: Request, res: Response) => bankManagerController.getTotalBalance(req, res))
router.get('/customers', (req: Request, res: Response) => bankManagerController.getCustomers(req, res))
router.get(`/customer/:id`, (req: Request, res: Response) => bankManagerController.getCustomerById(req, res))



export default router;