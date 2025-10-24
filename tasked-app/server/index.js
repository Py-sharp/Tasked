const express = require('express');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');

const app = express();
const PORT = 3001;

// 1. Middleware Setup
app.use(cors()); // Allow requests from your React frontend (localhost:3000)
app.use(express.json()); // Allows parsing of JSON request bodies

// 2. API Routes
// All routes defined in projectRoutes will be prefixed with /api
app.use('/api', projectRoutes);

// 3. Simple root path check
app.get('/', (req, res) => {
    res.send('Tasked Backend API is running.');
});

// 4. Start Server
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
    console.log('Ensure your frontend (React) is also running on localhost:3000.');
});
