import express, { Request, Response } from 'express';
import path from 'path';
import todoRoutes from './routes/todoRoutes';

const app = express();
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '..', 'dist', 'web')));
app.use(todoRoutes);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '..', 'dist', 'web', 'index.html'));
});

const port = Number(process.env.PORT) || 3030;

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

export default app;
