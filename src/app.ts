import express from "express";
import bodyParser from "body-parser";
import customerRouter from "./routes/customer.routes";
import bankManagerRouter from "./routes/bank-manager.routes";
import winston from "winston";

 const app = express();

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    defaultMeta: {},
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'combined.log'})
    ]
})

app.use(bodyParser.json())
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    logger.info(`Request Body: ${JSON.stringify(req.body, null, 2)}`);
    next();
});

app.use('/api', customerRouter)
app.use('/api/admin', bankManagerRouter)


export  {app, logger};