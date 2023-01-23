import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import chatApi from "../api/chatAPI";
import { Room } from "../models";
import { useAuth } from "./AuthProvider";

interface ChatContextType {
  rooms: Room[];
}

const initChatContext: ChatContextType = {
  rooms: [],
};

const ChatContext = createContext<ChatContextType>(initChatContext);

export default function ChatProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const { userInfo } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  useEffect(() => {
    async function fetchListRoom() {
      try {
        const data: Room[] | undefined = await chatApi.getListRoom(
          userInfo?._id,
        );
        if (data) setRooms(data);
      } catch (error: any) {
        console.log(error.message);
      }
    }

    fetchListRoom();
  }, [userInfo?._id]);
  const memoedValue = useMemo(
    () => ({
      rooms,
    }),
    [rooms],
  );

  return (
    <ChatContext.Provider value={memoedValue}>{children}</ChatContext.Provider>
  );
}

function useChat() {
  const context = useContext(ChatContext);
  if (typeof context === "undefined")
    throw new Error("useChat must be used within ChatProvider");
  return context;
}

export { useChat };
