import { UilSearch, UilPlusCircle } from "@iconscout/react-unicons";
import { useState } from "react";
import styled from "styled-components";
import Logo from "../../../assets/logo.svg";
import Modal from "../../../components/Modal";
import { useAuth } from "../../../context/AuthProvider";
import { useChat } from "../../../context/ChatProvider";

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 5% 70% 15%;
  overflow: hidden;
  background-color: #080420;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4px;
    .brand {
      display: flex;
      align-items: center;
      gap: 6px;
      img {
        height: 2rem;
      }
      h3 {
        color: white;
        text-transform: uppercase;
      }
    }
    .menu {
      color: white;
      &__icon {
        cursor: pointer;
      }
    }
  }

  .search {
    display: flex;
    align-items: stretch;
    gap: 4px;
    background-color: #31285e;
    margin: 0 6px;
    border-radius: 25px;
    padding: 0 10px;

    .search__icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .search__input,
    .search__input::placeholder {
      flex: 1;
      outline: none;
      background-color: inherit;
      border: none;
      font-size: 14px;
      color: white;
      border-radius: inherit;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .room {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
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
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;

const ModalContent = styled.div`
  .content {
    &__input {
      width: 100%;
      padding: 8px;
      font-size: 16px;
      outline: none;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
  }
`;

export default function Contacts() {
  const [show, setShow] = useState<boolean>(true);
  const { rooms } = useChat();
  const { userInfo } = useAuth();
  // const [currentUserName, setCurrentUserName] = useState(undefined);
  // const [currentUserImage, setCurrentUserImage] = useState(undefined);
  // const [currentSelected, setCurrentSelected] = useState(undefined);
  // useEffect(async () => {
  //   const data = await JSON.parse(
  //     localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY),
  //   );
  //   setCurrentUserName(data.username);
  //   setCurrentUserImage(data.avatarImage);
  // }, []);
  const changeCurrentChat = () => {
    console.log("bbbb");

    // setCurrentSelected(index);
    // changeChat(contact);
  };

  const handleKeyDown = () => {
    console.log("aaa");
  };

  return (
    <>
      <Modal visible={show} onClose={() => setShow(false)}>
        <ModalContent className="content">
          <input
            type="text"
            className="content__input"
            placeholder="Enter your name friend"
          />
          <h2>acdasdfasdf</h2>
        </ModalContent>
      </Modal>
      <Container>
        <div className="header">
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>snappy</h3>
          </div>
          <div className="menu">
            <UilPlusCircle
              className="menu__icon"
              onClick={() => setShow(true)}
            />
          </div>
        </div>
        <div className="search">
          <span className="search__icon">
            <UilSearch size="20" color="#fff" />
          </span>
          <input
            className="search__input"
            type="text"
            placeholder="Search on messenger"
          />
        </div>
        <div className="contacts">
          {rooms.map((room) => {
            return (
              <div
                role="button"
                tabIndex={0}
                key={room._id}
                // className={`room ${index === currentSelected ? "selected" : ""}`}
                onClick={() => changeCurrentChat()}
                // onClick={() => changeCurrentChat(index, room)}
                onKeyDown={handleKeyDown}
              >
                <div className="avatar">
                  <img
                    // src={`data:image/svg+xml;base64,${room.}`}
                    alt=""
                  />
                </div>
                <div className="username">
                  <h3>{room.name}</h3>
                </div>
              </div>
            );
          })}
        </div>
        <div className="current-user">
          <div className="avatar">
            <img src={userInfo.avatarUrl} alt="avatar" />
          </div>
          <div className="username">
            <h2>{userInfo.name}</h2>
          </div>
        </div>
      </Container>
    </>
  );
}

// import * as React from "react";

// export interface IContactsProps {}

// export default function Contacts(props: IContactsProps) {
//   return <div>Contacts</div>;
// }
