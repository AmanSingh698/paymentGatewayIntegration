import express from "express";
import { createTransaction, getDepositDetails, validateTransaction } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create", createTransaction);
router.post("/deposit", getDepositDetails);
router.post("/status", validateTransaction);

export default router;
