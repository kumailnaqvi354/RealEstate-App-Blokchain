import { MongoClient } from "mongodb";

const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
const options = {};

if (!uri) {
  console.error("Please define the MONGODB_URI environment variable inside .env.local");
}

// Add type for global object to avoid TypeScript error
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Only try to connect if URI exists
if (uri) {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} else {
  // fallback in case uri is missing (clientPromise would be undefined)
  clientPromise = Promise.reject("MONGODB_URI not defined");
}

export default clientPromise;
