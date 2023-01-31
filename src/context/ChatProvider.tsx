import userApi from "api/userAPI";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "types/socket-io";
import chatApi from "../api/chatAPI";
import { Attendee, Message, Room, UserInfo } from "../models";
import { useAuth } from "./AuthProvider";

interface ChatContextType {
  rooms: Room[];
  members: UserInfo[];
  memberUnAdds: UserInfo[];
  selectedRoom: Room | null;
  setSelectedRoom?: any;
  messages: Message[];
  socket: any;
}

const initChatContext: ChatContextType = {
  rooms: [],
  members: [],
  memberUnAdds: [],
  selectedRoom: null,
  messages: [],
  socket: null,
};

const ChatContext = createContext<ChatContextType>(
  initChatContext as ChatContextType,
);

export default function ChatProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const { userInfo } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [members, setMembers] = useState<UserInfo[]>([]);
  const [memberUnAdds, setMemberUnAdds] = useState<UserInfo[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const socket = useRef<Socket<ServerToClientEvents, ClientToServerEvents>>();

  useEffect(() => {
    if (userInfo?._id) {
      socket.current = io(
        process.env.REACT_APP_API_URI ?? "http://127.0.0.1:1337",
      );

      socket.current.emit("connected-user", userInfo._id);
    }
  }, [userInfo?._id]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", (data: Message[]) => {
        setMessages(data);
      });
      socket.current.on("list-member-unadd-receive", (data: UserInfo[]) => {
        setMemberUnAdds(data);
      });
      socket.current.on("list-room-receive", (data: Attendee) => {
        setRooms(data.rooms);
      });
    }
  }, [socket.current]);

  useEffect(() => {
    async function fetchDataRoom() {
      try {
        const [membersUnAdds, users] = await Promise.all([
          chatApi.getAllMemberUnAdd(),
          userApi.getAllUser(),
        ]);

        if (membersUnAdds) setMemberUnAdds(membersUnAdds);
        if (users) {
          setMembers(users.filter((user) => user._id !== userInfo._id));
        }
      } catch (error: any) {
        console.log(error.message);
      }
    }

    if (userInfo?._id) fetchDataRoom();
  }, [userInfo?._id]);

  useEffect(() => {
    async function fetchListRoom() {
      try {
        const response = await chatApi.getListRoom(userInfo?._id);
        if (response) setRooms(response.rooms);
      } catch (error: any) {
        console.log(error.message);
      }
    }

    if (userInfo?._id) fetchListRoom();
  }, [userInfo?._id]);

  useEffect(() => {
    async function fetchMessage(roomId: string) {
      try {
        const data = await chatApi.getListMessage(roomId);
        if (data) setMessages(data);
      } catch (error: any) {
        console.log(error.message);
      }
    }
    if (selectedRoom?._id) fetchMessage(selectedRoom?._id);
  }, [selectedRoom?._id]);

  const memoedValue = useMemo(
    () => ({
      rooms,
      members,
      memberUnAdds,
      selectedRoom,
      setSelectedRoom,
      messages,
      socket,
    }),
    [rooms, members, memberUnAdds, selectedRoom, messages],
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
