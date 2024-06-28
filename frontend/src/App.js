import AppLayout from "./components/AppLayout";
import { Routes, Route } from "react-router-dom";
import Task from "./components/Task";
import { Toaster } from "react-hot-toast";
import Login from "./components/login";
import Subapp from "./subapp";
import Logout from "./components/logout";
function App() {
  console.log('render app..')
  return (
    <div>
      <Routes>
        <Route path="/" element={<Subapp/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/:projectId" element={<Task />} />
        <Route path="/logout" element={<Logout/>}/>
      </Routes>
    </div>
  );
}

export default App;
