const express = require('express');
const fileUpload = require('express-fileupload');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs'); // Required for file system operations
const cors = require('cors'); // Import cors to enable cross-origin requests

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins
app.use(cors());

// Middleware to handle file uploads
app.use(fileUpload());

// Middleware to parse JSON request bodies
app.use(express.json());

// Global data storage for student and marks
global.studentData = [];
global.marksData = [];

// Create upload folder if it doesn't exist
const uploadFolder = path.join(__dirname, 'upload');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Endpoint to upload Excel file
app.post('/upload', (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send('No file uploaded.');
  }

  const excelFile = req.files.file;

  // Save the file to the "upload" folder
  const uploadPath = path.join(uploadFolder, excelFile.name);
  excelFile.mv(uploadPath, (err) => {
    if (err) {
      console.error('File saving error:', err);
      return res.status(500).send('Failed to save the file.');
    }

    // Process the file after saving
    const workbook = xlsx.readFile(uploadPath); // Read the saved file
    const studentSheet = workbook.Sheets['Students'];
    const marksSheet = workbook.Sheets['Marks'];

    global.studentData = xlsx.utils.sheet_to_json(studentSheet);
    global.marksData = xlsx.utils.sheet_to_json(marksSheet);

    console.log('Parsed Students Data:', global.studentData);
    console.log('Parsed Marks Data:', global.marksData);

    res.status(200).send({
      message: 'File uploaded and processed successfully',
      studentData: global.studentData,
      marksData: global.marksData,
    });
  });
});

// Endpoint to get student details by reg_no
app.get('/api/students/:reg_no', (req, res) => {
  const reg_no = req.params.reg_no;

  // Check if data is available
  if (!global.studentData || !global.marksData) {
    return res.status(400).json({ message: 'No data available. Please upload the file first.' });
  }

  // Find student details by reg_no
  const student = global.studentData.find((s) => s.reg_no === reg_no);
  const marks = global.marksData.filter((m) => m.reg_no === reg_no);

  if (!student) {
    return res.status(404).json({ message: 'Student not found!' });
  }

  res.status(200).json({
    student: [student], // Return student data as an array
    marks,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
