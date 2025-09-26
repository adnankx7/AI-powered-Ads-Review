const express = require('express');
const fs = require('fs');
const path = require('path');
const { getAdReviewChain } = require('./reviewAgent');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = 'data.json';

// Middleware
app.use(express.json());
app.use(express.static('static'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

app.post('/submit', async (req, res) => {
  const newData = req.body;

  // Review the ad using AI
  const chain = getAdReviewChain();
  let reviewResult;
  try {
    reviewResult = await chain.invoke(newData);
  } catch (error) {
    const errorMessage = error.message;
    if (errorMessage.includes('ConnectError') || errorMessage.toLowerCase().includes('connection refused')) {
      return res.status(503).json({ message: 'Error: Cannot connect to Ollama local model server. Please ensure it is running.' });
    }
    return res.status(500).json({ message: `Error during AI review: ${errorMessage}` });
  }

  // Load existing data
  let data = [];
  if (fs.existsSync(DATA_FILE)) {
    try {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
      data = JSON.parse(fileContent);
    } catch (err) {
      data = [];
    }
  }

  // Append new entry with review status
  const newDataWithStatus = { ...newData };
  newDataWithStatus.status = reviewResult.decision.toLowerCase(); // 'approve' or 'reject'
  newDataWithStatus.review_reason = reviewResult.reason;

  data.push(newDataWithStatus);

  // Save back to JSON file
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  if (reviewResult.decision === 'Reject') {
    return res.status(400).json({ message: `Ad rejected: ${reviewResult.reason}` });
  }

  res.json({ message: 'Car details saved successfully!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
