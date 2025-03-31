const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/demo');
  console.log('db connected');
}

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

const server = express();
const port = process.env.PORT ||4000;

server.use(cors());
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

server.listen(8080, () => {
  console.log('server started');
});