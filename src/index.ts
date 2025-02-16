import express from 'express';
import cors from 'cors';
import dotenv from "dotenv-safe";
import cartRoutes from './ports/rest/routes/cart';
import { ConnectToDb } from './infrastructure/mongodb/connection';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

dotenv.config({
  allowEmptyValues: true,
  path: `.env.${process.env.NODE_ENV || 'local'}`,
  example: '.env.example'
});

const port = process.env.PORT || 3001;
ConnectToDb();
app.use("/healthcheck", (req, res) => {
  res.status(200).send("The Cart Service is ALIVE!");
});

app.use("/cart", cartRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});