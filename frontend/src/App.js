import React from 'react';
import './App.css';
import StudentForm from './StudentForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Krishnaveni Degree College (Autonomous)</h1>
        <p>Semester Results</p>
        <img src="/logo.png" alt="College Logo" className="college-logo" />
      </header>
      <main>
        <StudentForm />
      </main>
      <footer>
        © {new Date().getFullYear()} Krishnaveni Degree College (Autonomous). All rights reserved.
      </footer>
    </div>
  );
}

export default App;
