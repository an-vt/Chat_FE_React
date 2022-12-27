import MDAvatar from 'components/common/MDAvatar';
import MDBox from 'components/common/MDBox';
import MDTypography from 'components/common/MDTypography';
import { RoomMessage } from 'models/Chat';
import React, { forwardRef, Fragment, useState } from 'react';
import LightBox from 'react-image-lightbox';
import { convertUuidToNumber } from 'utils/utils';
import { colorRoomMap } from '../data';
import { DownloadIcon } from './DownloadIcon';
import TimeMessage from './TimeMessage';

export interface IBoxChatProps {
  isMe: boolean;
  message: RoomMessage;
}

const rightArrow = {
  content: '""',
  position: 'absolute',
  backgroundColor: '#BCE1BE',
  width: '23px',
  height: '12px',
  top: '8px',
  borderBottomRightRadius: '100%',
  right: '-23px',
};

const rightArrowOverlap = {
  content: '""',
  position: 'absolute',
  backgroundColor: '#fff',
  width: '23px',
  height: '4px',
  top: '8px',
  borderBottomRightRadius: '100%',
  borderBottomLeftRadius: '100%',
  right: '-23px',
};

const leftArrow = {
  content: '""',
  position: 'absolute',
  backgroundColor: '#eee',
  width: '23px',
  height: '12px',
  top: '8px',
  borderBottomLeftRadius: '100%',
  left: '-23px',
};

const leftArrowOverlap = {
  content: '""',
  position: 'absolute',
  backgroundColor: '#fff',
  height: '4px',
  top: '8px',
  borderBottomLeftRadius: '100%',
  borderBottomRightRadius: '100%',
  width: '23px',
  left: '-23px',
};

const BoxChat = forwardRef(({ isMe, message }: IBoxChatProps, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const NUMBER_DIVIDEND = 20;
  const roomColorNumber = message?.sender_uid && convertUuidToNumber(message?.sender_uid) % NUMBER_DIVIDEND;

  return (
    <MDBox ref={ref} display="flex" justifyContent={isMe ? 'flex-end' : 'flex-start'} my={1}>
      <MDBox
        sx={{
          display: 'flex',
          gap: 4,
          flexDirection: isMe ? 'row-reverse' : 'row',
          maxWidth: '60%',
        }}>
        <MDAvatar
          size="md"
          alt="class"
          sx={{
            bgcolor: `${colorRoomMap[roomColorNumber] || ''}`,
          }}>
          <MDTypography color="white">{message?.sender_name?.charAt(0).toUpperCase()}</MDTypography>
        </MDAvatar>
        <MDBox
          sx={{
            backgroundColor: `${message.type !== 'video' ? (isMe ? '#BCE1BE' : '#EEEEEE') : 'unset'}`,
            position: 'relative',
            p: `${message.type !== 'video' ? '8px' : 'unset'}`,
            '&::before': isMe ? rightArrow : leftArrow,
            '&::after': isMe ? rightArrowOverlap : leftArrowOverlap,
            whiteSpace: 'pre-wrap',
            borderRadius: '10px',
            height: 'auto',
          }}
          width="100%"
          maxWidth={{ xl: 0.9, lg: 0.8, md: 0.9, sm: 0.9 }}>
          {message.type === 'text' || message.type === 'announcement' ? (
            <Fragment>
              <MDTypography variant="body2" fontWeight="regular">
                {message.content}
              </MDTypography>
              <TimeMessage isMe={isMe} message={message} />
            </Fragment>
          ) : message.type === 'image' ? (
            <Fragment>
              <img
                style={{ width: 'auto', maxWidth: '100%', height: '100%', borderRadius: '10px', cursor: 'pointer' }}
                src={message.content}
                onClick={() => setOpen(true)}
              />
              <DownloadIcon content={message.content} isMe={isMe} />
              <TimeMessage isMe={isMe} message={message} />
            </Fragment>
          ) : (
            message.type === 'video' && (
              <Fragment>
                <video
                  controls
                  width="320px"
                  height="auto"
                  src={message.content}
                  style={{
                    backgroundColor: isMe ? '#BCE1BE' : '#EEEEEE',
                    padding: '8px',
                    borderRadius: '10px',
                  }}
                />
                <DownloadIcon content={message.content} isMe={isMe} />
                <TimeMessage isMe={isMe} message={message} />
              </Fragment>
            )
          )}
        </MDBox>
      </MDBox>
      {open && <LightBox mainSrc={message.content} onCloseRequest={() => setOpen(false)} />}
    </MDBox>
  );
});

export default BoxChat;
