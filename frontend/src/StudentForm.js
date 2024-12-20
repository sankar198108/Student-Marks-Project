import React, { useState } from 'react';
import axios from 'axios';

const StudentForm = () => {
  const [regNo, setRegNo] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [marksData, setMarksData] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setRegNo(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await axios.get(`http://localhost:5000/api/students/${regNo}`);
      if (response.data) {
        setStudentData(response.data.student);
        setMarksData(response.data.marks);
      }
    } catch (err) {
      setError('Student not found or error occurred.');
      setStudentData(null);
      setMarksData(null);
    }
  };

  const handlePrint = () => {
    if (studentData && marksData) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write('<pre>');
      printWindow.document.write('Student Details:\n');
      printWindow.document.write(`Hall Ticket Number: ${studentData[0].reg_no}\n`);
      printWindow.document.write(`Name: ${studentData[0].name}\n`);
      printWindow.document.write(`Course: ${studentData[0].course}\n`);
      printWindow.document.write(`College Code: ${studentData[0].college_code}\n`);
      printWindow.document.write(`College Name: ${studentData[0].college_name}\n`);
      printWindow.document.write('\nMarks Details:\n');
      marksData.forEach((mark, index) => {
        printWindow.document.write(
          `${index + 1}. ${mark.subject_code} - ${mark.subject_name} | External Marks: ${mark.external_marks} (${mark.external_flag}), Internal Marks: ${mark.internal_marks} (${mark.internal_flag}), Result: ${mark.result}\n`
        );
      });
      printWindow.document.write('</pre>');
      printWindow.document.close();
    }
  };

  return (
    <div className="form-container">
      <form className="student-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={regNo}
          onChange={handleInputChange}
          placeholder="Enter Hall Ticket Number"
          className="input-field"
        />
        <button type="submit" className="submit-button">Submit</button>
        <button type="button" className="print-button" onClick={handlePrint}>Print</button>
      </form>
      {error && <p className="error">{error}</p>}
      {studentData && marksData && (
        <div className="result">
          <h3>Student Details</h3>
          <table>
            <thead>
              <tr>
                <th>Hall Ticket Number</th>
                <th>Name</th>
                <th>Course</th>
                <th>College Code</th>
                <th>College Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{studentData[0].reg_no}</td>
                <td>{studentData[0].name}</td>
                <td>{studentData[0].course}</td>
                <td>{studentData[0].college_code}</td>
                <td>{studentData[0].college_name}</td>
              </tr>
            </tbody>
          </table>

          <h3>Marks Details</h3>
          <div className="scroll-container">
            <table>
              <thead>
                <tr>
                  <th>Subject Code</th>
                  <th>Subject Name</th>
                  <th>External Marks</th>
                  <th>External Flag</th>
                  <th>Internal Marks</th>
                  <th>Internal Flag</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {marksData.map((mark, index) => (
                  <tr key={index}>
                    <td>{mark.subject_code}</td>
                    <td>{mark.subject_name}</td>
                    <td>{mark.external_marks}</td>
                    <td>{mark.external_flag}</td>
                    <td>{mark.internal_marks}</td>
                    <td>{mark.internal_flag}</td>
                    <td>{mark.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentForm;
