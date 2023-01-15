import { useAuth } from "../../context/AuthProvider";
import ChatPage from "./ChatPage";

export default function ChatLayout() {
  const { userInfo } = useAuth();
  console.log("🚀 ~ file: index.tsx:6 ~ ChatLayout ~ userInfo", userInfo);
  return <ChatPage />;
}
