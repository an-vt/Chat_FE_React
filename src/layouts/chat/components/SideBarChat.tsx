import { Icon, InputAdornment } from "@mui/material";
import { styleScroll } from "common/styles";
import { ChatParent } from "models/Chat";
import { useState } from "react";

function SideBarChat() {
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  // const { rooms, selectedRoom, setSearch, loadingRooms, hasMoreRooms, setPageNumberRooms, parentUnChats } = useChat();
  const [parentUnChat, setParentUnChat] = useState<ChatParent>();
  const closePopup = () => {
    setOpenPopup(false);
    setParentUnChat(null);
  };

  // const { lastElementRef } = useLoadMore(rooms, loadingRooms, hasMoreRooms, setPageNumberRooms);

  const handleClick = () => setOpenPopup(true);

  const handleOK = () => {
    // ChatApiService.addParentChat(parentUnChat?.number, officeSelected?.id)
    //   .then(() => {
    //     // clear parent unchat when change office
    //     setParentUnChat(null);
    //   })
    //   .catch((error: any) => {
    //     console.log(error);
    //   });
    // setOpenPopup(false);
  };

  return (
    <MDBox
      borderRight="1px solid #c5c5c580"
      pb={7}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "83.8vh",
        maxHeight: "83.8vh",
      }}
    >
      <MDBox>
        <MDInput
          variant="outlined"
          sx={{
            flex: 1,
            p: 2,
            borderTopLeftRadius: "10px",
            height: "77px",
          }}
          // onChange={(e: any) => setSearch(e.target.value.trim())}
          fullWidth
          placeholder="chat.talkSearch"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Icon fontSize="medium">search</Icon>
              </InputAdornment>
            ),
          }}
        />
      </MDBox>
      <MDBox
        sx={{
          width: "100%",
          height: "100%",
          overflowY: "auto",
          ...styleScroll,
        }}
      >
        {/* {rooms?.length > 0 &&
          rooms.map((item: AttendeeRoom, index: number) => {
            if (rooms.length === index + 1) {
              return (
                <ChatRoom
                  ref={lastElementRef}
                  attendeeRoom={item}
                  key={item.roomId}
                  active={item.roomId === selectedRoom?.roomId}
                />
              );
            } else {
              return (
                <ChatRoom
                  attendeeRoom={item}
                  key={item.roomId}
                  active={item.roomId === selectedRoom?.roomId}
                />
              );
            }
          })}
      </MDBox> */}
      <MDBox
        sx={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          border: "1px solid #ccc",
          borderRadius: 2,
          p: 0.3,
          pr: 1,
          bottom: 0,
          right: "16px",
          transform: "translateY(-50%)",
          cursor: "pointer",
        }}
        onClick={handleClick}
      >
        <Icon>add_icon</Icon>
        <MDTypography variant="body2" fontWeight="bold" ml={0.5}>
          {"chat.talkParrentAddBtn"}
        </MDTypography>
      </MDBox>
      {/* <MDPopup
        open={openPopup}
        title={"chat.addTitlePopup"}
        textBtnOk={"chat.addBtn"}
        handleOk={handleOK}
        closePopup={closePopup}
        disabledBtnOk={!parentUnChat}
        iconClose
      >
        <MDBox
          sx={{
            py: 2,
            px: 10,
          }}
        >
          <Autocomplete
            noOptionsText={"msg.ERR1019"}
            options={parentUnChats}
            size="small"
            getOptionLabel={(option: ChatParent) =>
              `${option.lastName}${option.firstName}`
            }
            onChange={(
              _event: SyntheticEvent<Element, Event>,
              value: string | ChatParent,
            ) => {
              typeof value === "object" && setParentUnChat(value);
            }}
            value={
              parentUnChats.find(
                (item: ChatParent) => item.id === parentUnChat?.id,
              ) || null
            }
            renderInput={(params) => (
              <TextField
                size="small"
                label={parentUnChat ? "" : t("chat.menuPopup")}
                {...params}
              />
            )}
          />
        </MDBox>
      </MDPopup> */}
    </MDBox>
  );
}

export default SideBarChat;
