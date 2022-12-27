import MDTypography from 'components/common/MDTypography';
import { RoomMessage } from 'models/Chat';
import * as React from 'react';
import { formatDateTimeFirebase } from 'utils/utils';

export interface ITimeMessageProps {
  isMe: boolean;
  message: RoomMessage;
}

export default function TimeMessage({ isMe, message }: ITimeMessageProps) {
  return (
    <MDTypography
      variant="caption"
      sx={{
        position: 'absolute',
        right: isMe ? 'unset' : message.type === 'video' ? '-22px' : '-15px',
        left: isMe ? (message.type === 'video' ? '-22px' : '-15px') : 'unset',
        bottom: `${message.type === 'video' ? '14px' : '8px'}`,
        transform: `${isMe ? 'translateX(-100%)' : 'translateX(100%)'}`,
      }}>
      {message?.sending_timestamp?.seconds ? formatDateTimeFirebase(message.sending_timestamp, 'HH:mm') : ''}
    </MDTypography>
  );
}
