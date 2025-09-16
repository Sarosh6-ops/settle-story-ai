const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const port = 3001;

// --- Middleware ---

// Enable CORS for all routes to allow requests from the frontend (running on a different port)
app.use(cors());

// Configure multer for file uploads
// We'll store the files in memory for this example. For a production app, you'd likely want to store them on disk or in a cloud storage service.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- API Endpoints ---

/**
 * @route POST /api/analyze
 * @desc Analyzes the dispute and returns a simulated AI resolution.
 * @access Public
 */
app.post('/api/analyze', upload.array('evidence'), (req, res) => {
  const { yourStory, otherStory } = req.body;
  const files = req.files;

  // Basic validation
  if (!yourStory || !otherStory) {
    return res.status(400).json({ error: 'Both stories are required.' });
  }

  // --- Mock AI Analysis Logic ---
  // In a real application, this is where you would call an external AI/LLM service (e.g., OpenAI, Anthropic).
  // You would pass the stories and potentially the content of the files to the model.
  // For this simulation, we'll generate a plausible result based on the input.

  let winner = "Your Side";
  let reasoning = "";
  let confidence = 0;

  const yourStoryLength = yourStory.length;
  const otherStoryLength = otherStory.length;
  const numFiles = files ? files.length : 0;

  // Decide winner based on story length and evidence
  if (otherStoryLength > yourStoryLength + 100) {
    winner = "The Other Side";
  }

  // Generate confidence score
  confidence = 65 + (yourStoryLength % 10) + (otherStoryLength % 5) + (numFiles * 5);
  if (confidence > 95) {
    confidence = 95;
  }
  confidence += Math.floor(Math.random() * 5); // Add some randomness

  // Generate reasoning
  reasoning = `The analysis considered several factors. The narrative from "${winner}" was found to be slightly more detailed and coherent. `;
  if (numFiles > 0) {
    reasoning += `Additionally, the submission included ${numFiles} piece(s) of supporting evidence, which strengthened the case. `;
  } else {
    reasoning += "No additional evidence was submitted, so the decision is based purely on the provided narratives. ";
  }
  reasoning += "The final judgment reflects the relative consistency and persuasiveness of the arguments presented."

  // Simulate a delay to make it feel like a real AI is "thinking"
  setTimeout(() => {
    res.json({
      winner,
      reasoning,
      confidence,
    });
  }, 2000); // 2-second delay
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Dispute Solver backend listening at http://localhost:${port}`);
});
