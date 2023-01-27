import styled from "styled-components";
import { useChat } from "../../context/ChatProvider";
import ChatContainer from "./components/ChatContainer";
import Contacts from "./components/Contacts";
import Welcome from "./components/Welcome";

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default function ChatLayout() {
  const { selectedRoom } = useChat();
  return (
    <Container>
      <div className="container">
        <Contacts />
        {selectedRoom ? <ChatContainer /> : <Welcome />}
      </div>
    </Container>
  );
}
