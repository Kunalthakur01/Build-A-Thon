require('dotenv').config();

const helmet = require('helmet');
const cors = require('cors');
const rateLimiter = require('express-rate-limit');
const connectDB = require('./database/database');
const login = require('./routes/login');

const express = require('express');
const app = express();

app.set('trust proxy', 1);
app.use(cors());
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
}));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"]
    }
  })
);

app.use(express.json());

app.use('/api/v1', login);


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening to port ${port}...`)
    });
  } catch (error) {
    console.error(error);
  }
}

start();