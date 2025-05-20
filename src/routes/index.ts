//src/routes/index.ts
import express from 'express';
import v1Router from './v1/index';

const apiRouter = express.Router();

apiRouter.use('/v1', v1Router);
apiRouter.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});



export default apiRouter;
