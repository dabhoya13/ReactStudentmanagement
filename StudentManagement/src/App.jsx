import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from "./Sidebar";
import Students from "./Pages/Hod/Students";
import Professors from "./Pages/Hod/Professors";
import Dashboard from "./Pages/Hod/Home";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/professors" element={<Professors />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
