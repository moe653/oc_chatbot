import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home/home';
import Chat from './chat/chat';
import Chatselect from './chatselect/chatselect';
import Poster from './poster/poster';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* <Route path="/" element={<Home/>}></Route>   */}
          <Route path="/" element={<Chatselect/>}></Route>  {/* チャットの色を選択 */}
          <Route path="/communication" element={<Chat theme="orange" />} />
          <Route path="/medical" element={<Chat theme="blue" />} />
          <Route path="/security" element={<Chat theme="green" />} />
          <Route path="/communication/poster" element={<Poster theme="orange" />} />
          <Route path="/medical/poster" element={<Poster theme="blue" />} />
          <Route path="/security/poster" element={<Poster theme="green" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
