import express, {Application} from 'express';
import errorHandler from './middleware/errorHandler.middleware';
import cors from 'cors';
import colors from 'colors';
import dotenv from 'dotenv';
import connectDB from './config/db.config';
import authRoutes from './routes/auth.routes'

dotenv.config();

// calling express
const app: Application = express();
const PORT = process.env.PORT;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));  // CORS: is a security feature implemented in web browsers that allows or restricts resources requested from another domain outside the domain from which the first resource was served. 
app.use(errorHandler);

// Routes
app.use('/api/auth', authRoutes);

// connect to server
const server = app.listen(PORT, () => {
    console.log(
        colors.yellow.bold(`Server listening on port ${PORT}`)
    );
})

//  catch unhandled promise rejections
process.on("unhandledRejection", (err: any, promise) => {
    console.error(colors.red(`Error: ${err.message}`));
    server.close(() => process.exit());
  });
  