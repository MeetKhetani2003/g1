// src/lib/mongodb.js
// MongoDB connection & GridFS bucket helper for file and photo uploads
import { MongoClient, GridFSBucket, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/g1_healthcare";
const dbName = process.env.MONGODB_DB || "g1_healthcare";

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });
  clientPromise = client.connect();
}

export async function getMongoDb() {
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}

export async function getGridFSBucket(bucketName = "photos") {
  const db = await getMongoDb();
  return new GridFSBucket(db, { bucketName });
}

export { ObjectId };
