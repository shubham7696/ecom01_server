
import dotenv from "dotenv";
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import multer from "multer"
import connectDb from "../config/db";
import V1Routes from "../v1/routes/allV1Routes"


//dotenv config
dotenv.config({ path: "./.env" });

// rest objects
const app = express();

// multer upload
const upload = multer({dest: "uploads/"});

//middlewares
const corsOptions = {
  origin: "*", //process.env.ORIGIN,
  credentials: true
};

app.use(cors(corsOptions));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
// app.use(morgan("dev"));

//routes
V1Routes.forEach(
  ({path, route}) => {
    app.use(path, route)
  }
);

// PORT
const port = process.env.PORT || 8080;

const server = http.createServer(app);

//Listen PORT
server.listen(port, async () => {
  try {
    // mongoDb Connection
    await connectDb();
    console.log(`Server Running in Mode = ${process.env.NODE_MODE} on ${port}`);
  } catch (error) {
    console.log(error)
  }
});
