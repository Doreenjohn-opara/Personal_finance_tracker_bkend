import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';

dotenv.config();

const options: ConnectOptions = {
    autoIndex: true,
    maxPoolSize: 1000,
    wtimeoutMS: 6000,
    connectTimeoutMS: 6000,
    socketTimeoutMS: 6000,
    serverSelectionTimeoutMS: 6000,
    family: 4,
}

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI || "", options);
      console.log(colors.green.bold.underline(`MongoDB connected successfully: ${mongoose.connection.host}`));
    } catch (error) {
      console.log(colors.red.bold.underline(`MongoDB connection failed: , ${error}`));
      process.exit(1);
    }
  };

export default connectDB;