import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import userCurrentData from "./hooks/userCurrentData";
import Dashboard from "./pages/Dashboard";
import { useSelector } from "react-redux";
import ShowWebsite from "./pages/ShowWebsite";

function App() {
  userCurrentData();
  const { userData, loading } = useSelector((store) => store.user);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/dashboard"
        element={userData ? <Dashboard /> : <Navigate to={"/"} />}
      />
      <Route path="/showwebsite/:id" element={<ShowWebsite/>}/>
    </Routes>
  );
}

export default App;
