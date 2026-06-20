import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import userCurrentData from "./hooks/userCurrentData";

function App() {
  userCurrentData();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
