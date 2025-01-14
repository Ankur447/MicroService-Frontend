// pages/api/example.js
import cors, { runMiddleware } from '../../lib/cors';

export default async function handler(req, res) {
  // Run the middleware
  await runMiddleware(req, res, cors);

  // Rest of your API logic
  res.status(200).json({ message: 'CORS-enabled API route' });
}
