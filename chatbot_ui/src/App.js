import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home/home';
import Chatselect from './chatselect/chatselect';
import Brownchat from './brownchat/brownchat';
import Orangechat from './orangechat/orangechat';
import Bluechat from './bluechat/bluechat';
//import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home/>}></Route>  {/*初期画面で表示*/}
          <Route path="/select" element={<Chatselect/>}></Route>  {/* チャットの色を選択 */}
          <Route path="/select/brownchat" element={<Brownchat/>}></Route>  {/*URLが/chatの時に表示*/}
          <Route path="/select/orangechat" element={<Orangechat/>}></Route>
          <Route path="/select/bluechat" element={<Bluechat/>}></Route>
          </Routes>
      </div>
    </Router>
  );
}

export default App;
