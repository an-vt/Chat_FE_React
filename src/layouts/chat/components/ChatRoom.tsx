import { Badge } from '@mui/material';
import { formatDateUpdateBy, StorageKeys } from 'common/constants';
import MDAvatar from 'components/common/MDAvatar';
import MDBox from 'components/common/MDBox';
import MDTypography from 'components/common/MDTypography';
import { useChat } from 'context/chat';
import { AttendeeRoom } from 'models/Chat';
import React, { forwardRef } from 'react';
import { saveToStorage } from 'utils/storage';
import { convertUuidToNumber, formatDateTimeFirebase } from 'utils/utils';
import { colorRoomMap } from '../data';

export interface IChatItemProps {
  attendeeRoom: AttendeeRoom;
  active: boolean;
}

const ChatRoom = forwardRef(({ attendeeRoom, active }: IChatItemProps, ref: any) => {
  const { setSelectedRoom, selectedRoom, handleGoToNewestMessage, setLoadingContentChat } = useChat();
  const MAX_MESSAGES_UNREAD = 99;
  const NUMBER_DIVIDEND = 20;
  const roomColorNumber = attendeeRoom?.partner_uid && convertUuidToNumber(attendeeRoom?.partner_uid) % NUMBER_DIVIDEND;

  const handleClick = () => {
    setLoadingContentChat(true);
    setSelectedRoom(attendeeRoom);
    setTimeout(handleGoToNewestMessage, 300);
    setTimeout(() => setLoadingContentChat(false), 350);
    saveToStorage(StorageKeys.ROOM_ID, attendeeRoom.roomId);
  };

  return (
    <MDBox
      ref={ref}
      position="relative"
      display="flex"
      gap={'10px'}
      alignItems="center"
      onClick={handleClick}
      sx={{
        borderRadius: '6px',
        cursor: 'pointer',
        border: 'none',
        backgroundColor: active ? '#eee' : '',
        px: 2,
        py: 1,
      }}>
      <MDAvatar
        size="md"
        alt="class"
        sx={{
          bgcolor: `${colorRoomMap[roomColorNumber]}`,
        }}>
        <MDTypography color="white">{attendeeRoom?.partner_name.charAt(0).toUpperCase()}</MDTypography>
      </MDAvatar>
      <MDBox
        sx={{
          width: '300px',
        }}>
        <MDTypography
          fontWeight="bold"
          title={attendeeRoom?.partner_name}
          sx={{ maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {attendeeRoom?.partner_name}
        </MDTypography>
        <MDTypography variant="body2" fontWeight="light" sx={{ color: '#909090' }}>
          {attendeeRoom?.last_updated_timestamp
            ? formatDateTimeFirebase(attendeeRoom.last_updated_timestamp, formatDateUpdateBy)
            : ''}
        </MDTypography>
      </MDBox>
      {attendeeRoom?.roomId !== selectedRoom?.roomId && attendeeRoom?.unread_count > 0 && (
        <MDBox
          sx={{
            position: 'absolute',
            right: `${+attendeeRoom.unread_count <= MAX_MESSAGES_UNREAD ? '15px' : '21px'}`,
            top: '-7px',
          }}>
          <Badge
            badgeContent={
              attendeeRoom.unread_count < 10
                ? attendeeRoom.unread_count.toString().slice(0, 1)
                : attendeeRoom.unread_count
            }
            color="primary"
            max={MAX_MESSAGES_UNREAD}
            sx={{ '& .css-10e32ua-MuiBadge-badge': { minWidth: '30px' } }}></Badge>
        </MDBox>
      )}
    </MDBox>
  );
});

export default ChatRoom;
