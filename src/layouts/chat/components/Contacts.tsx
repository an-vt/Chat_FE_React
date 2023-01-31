import {
  UilAngleRightB,
  UilPlusCircle,
  UilSearch,
  UilUsersAlt,
} from "@iconscout/react-unicons";
import chatApi from "api/chatAPI";
import { Room, RoomAdd } from "models";
import { JoinRoomSocket } from "models/ChatSocket";
import { useState } from "react";
import styled from "styled-components";
import Logo from "../../../assets/logo.svg";
import Modal from "../../../components/Modal";
import { useAuth } from "../../../context/AuthProvider";
import { useChat } from "../../../context/ChatProvider";
import SuggestItem from "./SuggestItem";

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 6% 69% 15%;
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
      padding: 6px 0;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    margin-top: 8px;
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
      border-radius: 0.8rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          width: 3rem;
        }
      }
      .username {
        h2 {
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
        width: 3rem;
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
    &__input,
    &__input::placeholder {
      width: 100%;
      padding: 8px;
      font-size: 16px;
      outline: none;
      border: 1px solid #fff;
      color: #000;
      border-radius: 6px;
    }
  }

  .suggest {
    &__title {
      color: white;
      margin-left: 10px;
    }

    &__list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow: auto;
      height: 100%;
      max-height: calc(270px);
    }
  }

  .group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #333;
    padding: 0 8px;
    margin: 8px 0;
    margin-top: 15px;
    cursor: pointer;
    &__left {
      display: flex;
      align-items: center;
      gap: 6px;
      &__icon {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        border: 1px solid #fff;
        border-radius: 50%;
      }
      p {
        font-size: 16px;
        color: white;
      }
    }

    &__right {
      display: flex;
      align-items: center;
      border-radius: 1px solid #fff;
    }
  }
`;

export default function Contacts() {
  const [show, setShow] = useState<boolean>(false);
  const [checkedCreateGroup, setCheckedCreateGroup] = useState<boolean>(false);
  const { rooms, members, memberUnAdds, selectedRoom, setSelectedRoom } =
    useChat();
  const { userInfo } = useAuth();
  const { socket } = useChat();

  const handleKeyDown = () => {
    console.log("aaa");
  };

  const handleClickCreateGroup = () => setCheckedCreateGroup(true);

  const handleAddChat = async (memberId: string) => {
    const data: RoomAdd = {
      memberIds: [userInfo._id, memberId],
      type: "SELF",
    };
    try {
      await chatApi.createRoom(data);

      // add chat for update list memberUnadds
      socket.current.emit("list-member-unadd-send", data);

      // update list rooms
      socket.current.emit("list-room-send", data);
    } catch (error: any) {
      console.log(`Create room error : ${error.message}`);
    }
  };

  const handleClickIconAdd = () => {
    setShow(true);
  };

  const handleClosePopup = () => {
    setShow(false);
    setCheckedCreateGroup(false);
  };

  const handleChangeRoom = (room: Room) => {
    if (typeof setSelectedRoom === "function") {
      setSelectedRoom(room);
      const data: JoinRoomSocket = {
        userId: userInfo._id,
        roomId: room._id,
      };
      socket.current.emit("join-room", data);
    }
  };

  return (
    <>
      <Modal
        title={`New ${checkedCreateGroup ? "Group" : "Message"}`}
        visible={show}
        onClose={handleClosePopup}
      >
        <ModalContent className="content">
          <input
            type="text"
            className="content__input"
            placeholder="Enter your name friend"
          />
          {!checkedCreateGroup && (
            <div
              className="group"
              role="button"
              tabIndex={0}
              onClick={handleClickCreateGroup}
              onKeyDown={() => console.log("key down")}
            >
              <div className="group__left">
                <span className="group__left__icon">
                  <UilUsersAlt size={30} color="white" />
                </span>
                <p>Create a new group</p>
              </div>
              <div className="group__right">
                <UilAngleRightB color="white" />
              </div>
            </div>
          )}
          <h2 className="suggest__title">Suggested</h2>
          <div className="suggest__list">
            {checkedCreateGroup
              ? members.map((item) => (
                  <SuggestItem
                    key={item._id}
                    name={item.name ?? ""}
                    image={item.avatarUrl ?? ""}
                    checkedCreateGroup={checkedCreateGroup}
                    onClick={handleAddChat}
                    memberId={item._id}
                  />
                ))
              : memberUnAdds.map((item) => (
                  <SuggestItem
                    key={item._id}
                    name={item.name ?? ""}
                    image={item.avatarUrl ?? ""}
                    checkedCreateGroup={checkedCreateGroup}
                    onClick={handleAddChat}
                    memberId={item._id}
                  />
                ))}
          </div>
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
              onClick={handleClickIconAdd}
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
          {rooms?.map((room) => {
            return (
              <div
                role="button"
                tabIndex={0}
                key={room._id}
                className={`room ${
                  selectedRoom?._id === room._id ? "selected" : ""
                }`}
                onClick={() => handleChangeRoom(room)}
                onKeyDown={handleKeyDown}
              >
                <div className="avatar">
                  <img src={room.avatarUrl} alt="avatar" />
                </div>
                <div className="username">
                  <h2>{room.name}</h2>
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
