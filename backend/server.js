import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

// Configure CORS
const allowedOrigins = [
  "https://reliable-madeleine-2ab4b0.netlify.app",
  "http://localhost:5173" // optional for local dev
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow non-browser requests like Postman
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());
app.use("/api", paymentRoutes);

// Handle OPTIONS preflight for all routes
app.options("*", cors());

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
