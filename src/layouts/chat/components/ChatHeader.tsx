import { UilPower } from "@iconscout/react-unicons";
import { useAuth } from "context/AuthProvider";
import { useChat } from "context/ChatProvider";
import styled from "styled-components";

const Header = styled.div`
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

  .btn__logout {
    background-color: #9a86f3;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 45px;
    height: 45px;
    border-radius: 10px;
    margin-left: auto;
  }
`;

export default function ChatHeader() {
  const { logout } = useAuth();
  const { selectedRoom } = useChat();
  return (
    <Header>
      {selectedRoom && (
        <div className="user-details">
          <div className="avatar">
            <img src={selectedRoom.avatarUrl} alt="avatar" />
          </div>
          <div className="username">
            <h3>{selectedRoom.name}</h3>
          </div>
        </div>
      )}
      <button type="button" className="btn__logout" onClick={logout}>
        <UilPower
          style={{
            backgroundColor: "#9a86f3",
            color: "#ebe7ff",
          }}
          size={30}
        />
      </button>
    </Header>
  );
}
