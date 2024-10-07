const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));
  
app.get('/', (req, res) => {
  res.send('Issues Tracker API');
});


//Apply Routes
app.use('/api/issues', issuesRouter);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
