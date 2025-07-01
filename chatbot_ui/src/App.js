import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home/home';
import Chat from './chat/chat';
import Chatselect from './chatselect/chatselect';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home/>}></Route>  {/*初期画面で表示*/}
          <Route path="/select" element={<Chatselect/>}></Route>  {/* チャットの色を選択 */}
          <Route path="/select/orange" element={<Chat theme="orange" />} />
          <Route path="/select/blue" element={<Chat theme="blue" />} />
          <Route path="/select/green" element={<Chat theme="green" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
