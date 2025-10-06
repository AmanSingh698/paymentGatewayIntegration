import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "https://sandboxtest.space";

export const createTransaction = async (req, res) => {
  try {
    // Receive product, quantity, and totalPrice from frontend
    const { product, quantity, totalPrice } = req.body;

    if (!product?.name || !product?.price || !quantity || !totalPrice) {
      return res.status(400).json({ status: false, error_message: "Invalid product data" });
    }

    // Calculate unit price
    const unitPrice = product.price;

    const body = {
      merchant_key: process.env.MERCHANT_KEY_CREATE,
      invoice: {
        items: [
          {
            name: product.name,
            price: unitPrice,   
            description: product.description || "No description",
            qty: quantity
          }
        ],
        invoice_id: Date.now().toString(),
        invoice_description: "Deposit",
        total: unitPrice * quantity
      },
      currency_code: "INR",
      ip: "192.168.1.1",
      domain: "sandboxtest.space",
      user_id: "demoUser"
    };

    const response = await axios.post(
      `${BASE_URL}/en/purchase/create-transaction`,
      body,
      { headers: { "Content-Type": "application/json" } }
    );

    const data = Array.isArray(response.data) ? response.data[0] : response.data;

    return res.json(data);
  } catch (err) {
    console.error("Error in createTransaction:", err.response?.data || err.message);
    return res.status(500).json({
      status: false,
      error_message: "Unable to create transaction",
    });
  }
};

export const getDepositDetails = async (req, res) => {
  try {
    const { token } = req.body;
    const response = await axios.post(`${BASE_URL}/en/purchase/get-deposit-details`, {
      merchant_key: process.env.MERCHANT_KEY_CREATE,
      token,
      type: "upi"
    }, {
      headers: { "Content-Type": "application/json" }
    });

    return res.json(response.data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, error_message: "Unable to fetch deposit details" });
  }
};

export const validateTransaction = async (req, res) => {
  try {
    const { token } = req.body;
    const response = await axios.post(`${BASE_URL}/api/v1/validate-transaction`, {
      token,
      merchant_key: process.env.MERCHANT_KEY_CREATE
    }, {
      headers: { "Content-Type": "application/json" }
    });

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, error_message: "Unable to validate transaction" });
  }
};
