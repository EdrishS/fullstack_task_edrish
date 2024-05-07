import { WebSocketServer } from "ws";
import { WebSocket } from "ws";
import { createClient } from 'redis';
import { readFileSync } from 'fs';
import { MongoClient } from 'mongodb';


const port = 1234;
const wss = new WebSocketServer({ port });

// Initialize an empty array to store items in memory
let itemList: string[] = [];

const client = createClient();

// Redis configuration
const redisListName = "FULLSTACK_TASK_EDRISH";
const redisClient = createClient({
    socket: {
        host: "redis-12675.c212.ap-south-1-1.ec2.cloud.redislabs.com",
        port: 12675,
        tls: false,
        // key: readFileSync("./redis_user_private.key"), // Read private key
        // cert: readFileSync("./redis_user.crt"), // Read client certificate
        // ca: [readFileSync("./redis_ca.pem")] // Read CA certificate
    },
    password: "dssYpBnYQrl01GbCGVhVq2e4dYvUrKJB"
});

redisClient.connect()

const mongoDBURL = "mongodb+srv://assignment_user:HCgEj5zv8Hxwa4xO@test-cluster.6f94f5o.mongodb.net/";
const dbName = "assignment";
const collectionName = "assignment_edrish";

const mongoClient = new MongoClient(mongoDBURL);

async function moveItemsToMongoDB() {
    try {
        await mongoClient.connect();
        const db = mongoClient.db(dbName);
        const collection = db.collection(collectionName);
        const itemsToMove = itemList.splice(0, 5); // Remove the first 50 items from itemList

        if (itemsToMove.length > 0) {
            await collection.insertMany(itemsToMove.map(item => ({ item })));
            console.log(`Moved ${itemsToMove.length} items to MongoDB collection.`);
        }
    } catch (error) {
        console.error("Error moving items to MongoDB:", error);
    }
}

// Function to stringify and store itemList in Redis
const storeItemListInRedis = (): void => {
    const itemListJson = JSON.stringify(itemList);
    redisClient.set(redisListName, itemListJson);
    if (itemList.length > 5) {
        moveItemsToMongoDB(); // Call the function to move items when itemList exceeds 50
    }
    // redisClient.set(redisListName, itemListJson, (error: Error | null, reply: string) => {
    //     if (error) {
    //         console.error("Error storing itemList in Redis:", error.message, error.stack);
    //     } else {
    //         console.log("Item list stored in Redis:", itemList);
    //     }
    // });
}


// Store itemList in Redis when the server starts
storeItemListInRedis();

wss.on("connection", (ws) => {
    console.log("Client connected.");

    ws.on("message", (data) => {
        console.log(`Received message from client: ${data}`);

        const message = data.toString();

        // Check if the received message is "Add event"

        // Add a new item to the itemList
        const newItem = message; // Replace "New item" with the actual item sent from the client
        itemList.push(newItem);

            // Store itemList in Redis after adding a new item
    storeItemListInRedis();

        console.log(`Added item to the list: ${newItem}`);

                // Broadcast updated itemList to all connected clients
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(itemList));
                    }
                });
  
    });

    // Send a response message to the client
    // ws.send("Connected to the server.");
});

console.log(`Listening to port ${port}...`);