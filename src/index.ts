import express from "express";
import bodyParser from "body-parser";
import compression from "compression";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import router from "./db/router";

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("Server  is running on http://localhost:8080/");
});

const mongoUrl =
  "mongodb+srv://muhammadslh:Nodejs123@cluster0.ahsxhma.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.Promise = Promise;
mongoose.connect(mongoUrl);
mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/", router());