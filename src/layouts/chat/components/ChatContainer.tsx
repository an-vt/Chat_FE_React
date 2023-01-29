import chatApi from "api/chatAPI";
import { useAuth } from "context/AuthProvider";
import { useChat } from "context/ChatProvider";
import { Message } from "models";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";

const Container = styled.div`
  gap: 0.1rem;
  overflow: hidden;
  /* display: grid;
  grid-template-rows: 90% 10%;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 85% 15%;
  } */
  .chat-messages {
    height: 100%;
    max-height: calc(100% - 70px);
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
  const scrollRef = useRef<any>();
  // const [arrivalMessage, setArrivalMessage] = useState(null);
  const { selectedRoom, messages, socket } = useChat();
  const { userInfo } = useAuth();

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

        // send to socket
        socket.current.emit("send-msg", data);

        setTimeout(
          () => scrollRef.current?.scrollIntoView({ behavior: "smooth" }),
          100,
        );
      } catch (error: any) {
        console.log(error.message);
      }
    }
  };

  // useEffect(() => {
  //   if (socket.current) {
  //     socket.current.on("msg-receive", (msg) => {
  //       setArrivalMessage({ fromSelf: false, message: msg });
  //     });
  //   }
  // }, []);

  // useEffect(() => {
  //   arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  // }, [arrivalMessage]);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView();
    }, 50);
  }, [selectedRoom?._id]);

  return (
    <Container>
      <div className="chat-messages">
        {messages.map((message, index) => {
          return (
            <div
              ref={index + 1 === messages?.length ? scrollRef : null}
              key={message._id}
            >
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
