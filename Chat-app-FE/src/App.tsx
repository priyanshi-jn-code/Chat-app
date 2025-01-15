import CreateRoom from "./component/CreateRoom";
import JoinRoom from "./component/JoinRoom";
import Room from "./component/Room";
import Start from "./component/Start"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


function App() {
  return (
    
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Start />} />
      <Route path="/createRoom" element={<CreateRoom />} />
      <Route path="/joinRoom" element={<JoinRoom />} />
      <Route path="/room/:roomId" element={<Room />} />  
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
