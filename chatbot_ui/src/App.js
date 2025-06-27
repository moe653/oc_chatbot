import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Brownchat from './brownchat/brownchat';
import Home from './home/home';
//import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/brownchat" element={<Brownchat/>}></Route>  {/*URLが/chatの時に表示*/}
          <Route path="/" element={<Home/>}></Route>  {/*初期画面で表示*/}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
