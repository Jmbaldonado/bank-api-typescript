import express from "express";
import { Request, Response } from "express-serve-static-core";
import {CustomerController} from "../controllers/customer.controller";

const router = express.Router()
const customerController = new CustomerController();

router.post('/customer', (req: Request, res: Response) => customerController.createCustomer(req, res))
router.get(`/customer/:id/balance`, (req: Request, res: Response) => customerController.getBalance(req, res))
router.patch(`/customer/:id/deposit`, (req: Request, res: Response) => customerController.deposit(req, res))
router.patch(`/customer/:id/withdraw`, (req: Request, res: Response) => customerController.withdraw(req, res))
router.post(`/customer/:senderId/transfer/:receiverId`, (req: Request, res: Response) => customerController.transfer(req, res))

export default router;