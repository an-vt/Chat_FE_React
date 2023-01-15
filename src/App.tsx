import { Navigate, Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./context/AuthProvider";
import "./index.css";
import { Login, Register } from "./layouts/auth";
import ChatLayout from "./layouts/chat";
import SetAvatar from "./layouts/chat/components/SetAvatar";

function App() {
  const { tokenAuthenticated } = useAuth();
  return (
    <div>
      {!tokenAuthenticated ? (
        <Routes>
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/chat" element={<ChatLayout />} />
          <Route path="/setAvatar" element={<SetAvatar />} />
        </Routes>
      )}
      <ToastContainer
        position={toast.POSITION.BOTTOM_RIGHT}
        autoClose={8000}
        draggable
        pauseOnHover
        style={{ fontSize: "14px" }}
        theme="dark"
      />
    </div>
  );
}

export default App;
