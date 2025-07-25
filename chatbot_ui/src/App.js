import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home/home';
import Chat from './chat/chat';
import Chatselect from './chatselect/chatselect';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* <Route path="/" element={<Home/>}></Route>   */}
          <Route path="/" element={<Chatselect/>}></Route>  {/* チャットの色を選択 */}
          <Route path="/orange" element={<Chat theme="orange" />} />
          <Route path="/blue" element={<Chat theme="blue" />} />
          <Route path="/green" element={<Chat theme="green" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
