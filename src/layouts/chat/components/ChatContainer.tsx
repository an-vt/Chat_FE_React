import chatApi from "api/chatAPI";
import { useAuth } from "context/AuthProvider";
import { useChat } from "context/ChatProvider";
import { Message } from "models";
import styled from "styled-components";
import ChatInput from "./ChatInput";

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;

export default function ChatContainer() {
  // const scrollRef = useRef();
  // const [arrivalMessage, setArrivalMessage] = useState(null);
  const { selectedRoom, messages } = useChat();
  const { userInfo } = useAuth();

  // useEffect(async () => {
  //   const data = await JSON.parse(
  //     localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY),
  //   );
  //   const response = await axios.post(recieveMessageRoute, {
  //     from: data._id,
  //     to: selectedRoom._id,
  //   });
  //   setMessages(response.data);
  // }, [selectedRoom]);

  // useEffect(() => {
  //   const getCurrentChat = async () => {
  //     if (selectedRoom) {
  //       await JSON.parse(
  //         localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY),
  //       )._id;
  //     }
  //   };
  //   getCurrentChat();
  // }, [selectedRoom]);

  const handleSendMsg = async (msg: string) => {
    if (selectedRoom?.type === "SELF") {
      const data: Message = {
        content: msg.trim(),
        receivers: selectedRoom.members.map((member) => member._id),
        roomId: selectedRoom._id,
        senderName: userInfo.name,
        senderUId: userInfo._id,
        type: "TEXT",
        sendingTimestamp: new Date().toISOString(),
      };

      try {
        await chatApi.sendMessage(data);
      } catch (error: any) {
        console.log(error.message);
      }
    }
  };

  // useEffect(() => {
  //   if (socket.current) {
  //     socket.current.on("msg-recieve", (msg) => {
  //       setArrivalMessage({ fromSelf: false, message: msg });
  //     });
  //   }
  // }, []);

  // useEffect(() => {
  //   arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  // }, [arrivalMessage]);

  // useEffect(() => {
  //   scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img src={selectedRoom?.avatarUrl} alt="avatar" />
          </div>
          <div className="username">
            <h3>{selectedRoom?.name}</h3>
          </div>
        </div>
        {/* <Logout /> */}
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            // <div ref={scrollRef} key={uuidv4()}>
            <div key={message._id}>
              <div
                className={`message ${
                  message.senderUId === userInfo._id ? "sended" : "recieved"
                }`}
              >
                <div className="content ">
                  <p>{message.content}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput onSendMessage={handleSendMsg} />
    </Container>
  );
}
