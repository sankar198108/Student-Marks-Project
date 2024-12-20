const express = require('express');
const router = express.Router();
const xlsx = require('xlsx');

router.get('/:reg_no', (req, res) => {
  const reg_no = req.params.reg_no;

  // Ensure studentData and marksData are available
  if (!global.studentData || !global.marksData) {
    return res.status(400).json({ message: 'No data available. Please upload the file first.' });
  }

  // Find student details using reg_no
  const student = global.studentData.find((s) => s.reg_no === reg_no);
  
  // Find marks details using reg_no
  const marks = global.marksData.filter((m) => m.reg_no === reg_no);

  if (!student) {
    return res.status(404).json({ message: 'Student not found!' });
  }

  res.status(200).json({
    student: [student], // Ensure it's in an array to match the frontend structure
    marks,
  });
});

module.exports = router;
