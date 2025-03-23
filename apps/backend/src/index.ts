import express from 'express';
import { Request, Response } from 'express';

const app = express();
const port = 3001;

// Middleware to parse JSON
app.use(express.json());

// Example route
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the backend API!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});