require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

main().catch((err) => console.log(err));

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI); // Use MONGODB_URI from .env
    console.log('db connected to MongoDB Atlas');
  } catch (error) {
    console.error('MongoDB Atlas connection error:', error);
  }
}

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

const server = express();
const port = process.env.PORT ||4000;

// Configure CORS to allow requests from your React frontend's origin
server.use(cors({
  origin: 'http://localhost:3000', // Or the port your React app is running on
  credentials: true, // If you need to send cookies
}));

server.use(bodyParser.json());

// CRUD-operation
server.post('/demo', async (req, res) => {
  let user = new User();
  user.username = req.body.username;
  user.password = req.body.password;
  const doc = await user.save();
  console.log(doc);
  res.json(doc);
});

server.get('/demo', async (req, res) => {
  const docs = await User.find({});
  res.json(docs);
});

// DELETE operation
server.delete('/demo/:id', async (req, res) => {
  const { id } = req.params; // Get the id from the URL parameters
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

server.listen(port, '0.0.0.0', () => { //use port variable and listen on all interfaces.
  console.log(`Server started on port ${port}`);
});
