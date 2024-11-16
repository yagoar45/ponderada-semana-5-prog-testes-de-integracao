import express, { Request, Response } from 'express';
import http from 'http';


const app = express();
const port = process.env.PORT || 3000;

function FahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * 5 / 9;
}

// Middleware para interpretar JSON
app.use(express.json());

// Rota principal
app.get('/', (req: Request, res: Response): void => {
  res.send('Hello, Express with TypeScript!');
});

// Rota para conversão de temperatura
app.get('/temperature-converter', (req: Request, res: Response): void => {
    const fahrenheit = parseFloat(req.query.fahrenheit as string);
    

    const celsius = FahrenheitToCelsius(fahrenheit);
  
    res.json({ fahrenheit, celsius });
  });
  

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });

export {app, server}
