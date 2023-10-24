import { app, logger } from './src/app';


app.listen(process.env.PORT || 3000, () => {
   logger.info(`Server started at port ${process.env.PORT || 3000}`);
})
