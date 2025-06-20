//import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home/home';
import Bottan from './bottan/bottan';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={<Home/>} /> {/* 初期表示で画面 */}
        <Route path="/bottan" element={<Bottan/>} /> {/* URLが/bottanの時に表示*/}
        </Routes>
      </div>
    </Router>
  );
}



export default App;
