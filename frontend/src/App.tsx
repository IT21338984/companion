import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Name from "./Name";
import Scan from "./Scan";
import Confirm from "./Confirm";
import ChangeAvatar from './ChangeAvatar';
import CharacterScene from "./components/characterScene";

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<CharacterScene />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/name" element={<Name />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/changeAvatar" element={<ChangeAvatar />} />
      </Routes>
    </Router>
  );
}

export default App;
