

































const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { db } = require('./firebase');
const { collection, addDoc, updateDoc, doc, serverTimestamp } = require('firebase/firestore');
const app = express();
const corsOptions = {
    origin: ['https://client-kashmir.gofastapi.com', 'https://scanme-kashmir.gofastapi.com'], // Replace with actual frontends
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};


app.use(cors(corsOptions));
app.use(bodyParser.json());



// Endpoint to send the order
app.post("/sendOrder", async (req, res) => {

    const { tableNumber, dishes, tokenId } = req.body; // Receive tokenId from the request body
    const newOrder = {
        tableNumber,
        dishes,
        createdAt: serverTimestamp(),
        isDelivered: false,
        tokenId // Store the received tokenId in the new order
    };

    try {
        // Add the order to the database
        const docRef = await addDoc(collection(db, 'orders'), newOrder);

        // Send a JSON response indicating success
        console.log("Sending response:", { message: "Order received successfully", tokenId });
        res.status(200).json({ message: "Order received successfully", tokenId });
    } catch (error) {
        console.error("Error storing order:", error);
        res.status(500).json({ error: "Error: " + error.message });
    }
});

// Endpoint to mark an order as delivered
app.post("/markAsDelivered", async (req, res) => {
    const { orderId } = req.body;

    try {
        const orderDoc = doc(db, 'orders', orderId);
        await updateDoc(orderDoc, { isDelivered: true });
        res.status(200).json({ message: "Order marked as delivered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error: " + error.message });
    }
});

app.post("/reserveTable", async (req, res) => {
    const { name, phone, date, time, persons } = req.body;
  
    const reservation = {
      name,
      phone,
      date,
      time,
      persons
    };
  
    try {
      // Save reservation to the Firebase database (assuming 'reservations' collection exists)
      const docRef = await addDoc(collection(db, 'reservations'), reservation);
      console.log(reservation);
      res.status(200).json({ message: "Reservation saved successfully", id: docRef.id });
        
      
    } catch (error) {
      console.error("Error saving reservation:", error);
      res.status(500).json({ error: "Error: " + error.message });
    }
  });


// const PORT = 5000;
// app.listen(PORT, function() { 
//     console.log(`Server is running on port ${PORT}`);
// });


module.exports = app;