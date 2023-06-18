import express, { Application, Request, Response } from "express";
import indexRouter from "./routes/index";
import env from "./config/env";
import { connect } from "mongoose";


connect(env.databaseUrl).then((connection) => {
  console.log(`MongoDB Connected: ${connection.connection.host}`);
}).catch((error) => {
  console.error(`Error occured: ${error.message}`);
  process.exit(1);
});
 
const app: Application = express();
// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);

//@ts-ignore
app.use((err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    // we had a joi error, let's return a custom 400 json response
    res.status(400).json({
      type: err.type, // will be "query" here, but could be "headers", "body", or "params"
      error: err.error.toString()
    });
  } else {
    // pass on to another error handler
    next(err);
  }
});

export default app;
