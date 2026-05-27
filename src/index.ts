import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

const port = Number(process.env.PORT) || 3030;

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

export default app;
