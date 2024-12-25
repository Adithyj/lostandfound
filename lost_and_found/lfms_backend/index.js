const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');


const db = require('./config/db');


const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); 
const searchRoutes = require('./routes/searchRoutes');

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;


app.use(bodyParser.json());  
app.use(cors());  



app.use('/api/admin', adminRoutes);  // Admin routes
app.use('/api/users', userRoutes);   // User routes
app.use('/api/items', itemRoutes);   // Item routes
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Lost and Found API!');
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
