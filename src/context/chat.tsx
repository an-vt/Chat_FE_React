import { useAppSelector } from "app/hooks";
import { StorageKeys } from "common/constants";
import { selectorOfficeSelected } from "components/Navbars/DashboardNavbar/dashboardNavbarSlice";
import { ParentInuse } from "models/Parent";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChatApiService } from "services/chat.service";
import { ParentsApiService } from "services/parents.service";
import { BaseResponse } from "types/base-response";
import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
} from "utils/storage";
import useFirestore from "../hooks/useFirestore";
import { AttendeeRoom, ChatParent, RoomMessage } from "../models/Chat";

interface ChatContextType {
  rooms: AttendeeRoom[];
  selectedRoom: AttendeeRoom | null;
  messages: RoomMessage[];
  setSelectedRoom: any;
  setSearch: any;
  loadingMessages: boolean;
  hasMoreMessages: boolean;
  setPageNumberMessages: any;
  setPageNumberRooms: any;
  hasMoreRooms: boolean;
  loadingRooms: boolean;
  parentUnChats: ChatParent[];
  firstMessageRef: any;
  handleScrollNewestMessage: () => void;
  isParentExpiredContract: boolean;
  handleGoToNewestMessage: () => void;
  loadingContentChat: boolean;
  setLoadingContentChat: (state: boolean) => void;
}

const ChatContext = createContext<ChatContextType>({} as ChatContextType);

export default function ChatProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [selectedRoom, setSelectedRoom] = useState<AttendeeRoom>(null);
  const officeSelected = useAppSelector(selectorOfficeSelected);
  const [search, setSearch] = useState<string>("");
  const [pageNumberMessages, setPageNumberMessages] = useState<number>(1);
  const [pageNumberRooms, setPageNumberRooms] = useState<number>(1);
  const [parentUnChats, setParentUnChats] = useState<ChatParent[]>([]);
  const firstMessageRef = useRef(null);
  const [isParentExpiredContract, setIsParentExpiredContract] =
    useState<boolean>(false);
  const [loadingContentChat, setLoadingContentChat] = useState<boolean>(false);

  const handleScrollNewestMessage = () => {
    setTimeout(() => {
      firstMessageRef?.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 300);
  };

  const handleGoToNewestMessage = () => {
    firstMessageRef?.current?.scrollIntoView();
  };

  useEffect(() => {
    // remove room selected when go out screen chat
    return () => {
      removeFromStorage(StorageKeys.ROOM_ID);
    };
  }, []);

  const {
    collections: rooms,
    isLoading: loadingRooms,
    hasMore: hasMoreRooms,
  } = useFirestore(
    `attendees/${officeSelected?.uid}/rooms`,
    {
      field: "last_updated_timestamp",
      type: "desc",
    },
    pageNumberRooms,
  );
  const {
    collections: messages,
    isLoading: loadingMessages,
    hasMore: hasMoreMessages,
  } = useFirestore(
    `rooms/${selectedRoom?.roomId}/messages`,
    {
      field: "sending_timestamp",
      type: "desc",
    },
    pageNumberMessages,
  );

  useMemo(() => {
    if (selectedRoom?.roomId) {
      const room: AttendeeRoom = rooms.find(
        (item: AttendeeRoom) => item.roomId === selectedRoom?.roomId,
      );
      if (room?.unread_count > 0) {
        (async () => {
          try {
            await ChatApiService.updateDocument(
              `attendees/${officeSelected?.uid}/rooms`,
              selectedRoom?.roomId,
              {
                unread_count: 0,
              },
            );
          } catch (error) {
            console.log(error);
          }
        })();
      }
    }
  }, [rooms, selectedRoom?.roomId]);

  // set selected room
  useEffect(() => {
    const roomId = getFromStorage(StorageKeys.ROOM_ID);
    if (rooms?.length > 0 && officeSelected?.id) {
      if (roomId) {
        const isRoomBelongOffice = roomId?.includes(
          officeSelected?.id?.toString(),
        );
        if (!isRoomBelongOffice) {
          setSelectedRoom(rooms[0]);
          saveToStorage(StorageKeys.ROOM_ID, rooms[0]?.roomId);
        } else {
          setSelectedRoom(
            rooms.find((room: AttendeeRoom) => room.roomId === roomId),
          );
          saveToStorage(StorageKeys.ROOM_ID, roomId);
        }
      } else {
        setSelectedRoom(rooms[0]);
        saveToStorage(StorageKeys.ROOM_ID, rooms[0]?.roomId);
      }
    } else {
      setSelectedRoom(null);
    }
  }, [rooms, officeSelected?.id]);

  // check parent expired contract
  useEffect(() => {
    const fetchParentInuse = async () => {
      try {
        const parentInuses: ParentInuse[] =
          await ParentsApiService.getAllParentInuse(officeSelected.id);
        const parentNumber = selectedRoom.roomId.replace(
          officeSelected.id.toString(),
          "",
        );
        setIsParentExpiredContract(
          !parentInuses.find((item) => item.number === parentNumber),
        );
      } catch (error: any) {
        console.log("Fetch parent inuse error", error);
      }
    };

    if (officeSelected?.id && selectedRoom?.roomId) fetchParentInuse();
  }, [officeSelected?.id, selectedRoom?.roomId]);

  const getAllParentUnChat = () => {
    ChatApiService.getAllChatParentUnAdded(officeSelected?.id)
      .then((data: BaseResponse<ChatParent[]>) => {
        setParentUnChats(data.data);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (officeSelected?.id) getAllParentUnChat();
  }, [rooms, officeSelected?.id]);

  const getRooms = (): AttendeeRoom[] => {
    if (search.trim()) {
      return rooms.filter((item: AttendeeRoom) =>
        item.partner_name
          .toLocaleLowerCase()
          .includes(search.trim().toLocaleLowerCase()),
      );
    }
    return rooms;
  };

  const memoedValue = useMemo(
    () => ({
      rooms: getRooms(),
      messages: messages,
      selectedRoom,
      setSelectedRoom,
      setSearch,
      loadingMessages,
      hasMoreMessages,
      setPageNumberMessages,
      setPageNumberRooms,
      hasMoreRooms,
      loadingRooms,
      parentUnChats,
      firstMessageRef,
      handleScrollNewestMessage,
      isParentExpiredContract,
      handleGoToNewestMessage,
      loadingContentChat,
      setLoadingContentChat,
    }),
    [
      rooms,
      selectedRoom,
      messages,
      search,
      loadingMessages,
      hasMoreMessages,
      pageNumberMessages,
      pageNumberRooms,
      hasMoreRooms,
      loadingRooms,
      parentUnChats,
      firstMessageRef?.current,
      isParentExpiredContract,
      loadingContentChat,
    ],
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
