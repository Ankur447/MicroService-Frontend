// lib/cors.js
import Cors from 'cors';

// Initialize the cors middleware
const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  origin: '*', // Replace '*' with your allowed domain(s) for security
  credentials: true, // Enable cookies or authorization headers
});

// Helper method to wait for middleware to execute before continuing
export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });   
}

export default cors;
