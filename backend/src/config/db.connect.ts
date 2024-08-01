import mongoose from "mongoose";

mongoose.set("strictQuery", true);

interface Config {
  mongo: {
    uri: string;
  };
}

const connectDB = async (config: any): Promise<void> => {
  try {
    
    const { uri } = config.mongo;
    await mongoose.connect(uri);
    console.log("Connected to the MongoDB database");
  } catch (error) {
    console.error("Error connecting to the MongoDB database:", error);
    process.exit(1);
  }
};

export default connectDB;
