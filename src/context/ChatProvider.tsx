import userApi from "api/userAPI";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import chatApi from "../api/chatAPI";
import { Member, Message, Room, UserInfo } from "../models";
import { useAuth } from "./AuthProvider";

interface ChatContextType {
  rooms: Room[];
  members: UserInfo[];
  memberUnAdds: Member[];
  selectedRoom: Room | null;
  fetchDataRoom?: () => void;
  setSelectedRoom?: any;
  messages: Message[];
}

const initChatContext: ChatContextType = {
  rooms: [],
  members: [],
  memberUnAdds: [],
  selectedRoom: null,
  messages: [],
};

const ChatContext = createContext<ChatContextType>(initChatContext);

export default function ChatProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const { userInfo } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [members, setMembers] = useState<UserInfo[]>([]);
  const [memberUnAdds, setMemberUnAdds] = useState<Member[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchDataRoom = useCallback(async () => {
    try {
      const [membersUnAdds, users] = await Promise.all([
        chatApi.getAllMemberUnAdd(),
        userApi.getAllUser(),
      ]);
      const userMaps =
        users?.reduce(
          (userMap: { [key: string]: UserInfo }, user: UserInfo) => {
            const newUserMap = { ...userMap };
            newUserMap[user._id] = user;
            return newUserMap;
          },
          {},
        ) ?? {};

      const memberUnAddList =
        membersUnAdds?.map((member: Member) => ({
          ...member,
          user: userMaps[member.userId],
        })) ?? [];
      if (users) setMembers(users);
      setMemberUnAdds(memberUnAddList);
    } catch (error: any) {
      console.log(error.message);
    }
  }, []);

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
      fetchDataRoom,
      selectedRoom,
      setSelectedRoom,
      messages,
    }),
    [rooms, members, memberUnAdds, fetchDataRoom, selectedRoom, messages],
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
