import Icon from '@mui/material/Icon';
import { useAppSelector } from 'app/hooks';
import { styleScroll } from 'common/styles';
import MDBox from 'components/common/MDBox';
import MDLoadingInline from 'components/common/MDLoadingInline';
import { selectorOfficeSelected } from 'components/Navbars/DashboardNavbar/dashboardNavbarSlice';
import { useChat } from 'context/chat';
import useLoadMore from 'hooks/useLoadMore';
import { RoomMessage } from 'models/Chat';
import moment from 'moment';
import React, { Fragment, useState } from 'react';
import { formatDateTimeFirebase } from 'utils/utils';
import BoxChat from './BoxChat';
import DateChat from './DateChat';

export default function ContentChat() {
  const {
    messages,
    loadingMessages,
    hasMoreMessages,
    setPageNumberMessages,
    handleScrollNewestMessage,
    firstMessageRef,
    loadingContentChat,
  } = useChat();
  const officeSelected = useAppSelector(selectorOfficeSelected);
  const [show, setShow] = useState<boolean>(false);

  const { lastElementRef } = useLoadMore(messages, loadingMessages, hasMoreMessages, setPageNumberMessages);

  const checkDifferentDateMessage = (datePrev: string, dateCurrent: string): boolean =>
    moment(datePrev).isSame(moment(dateCurrent));

  const handleScroll = (e: any) => {
    const { clientHeight, scrollTop } = e.target;

    if (clientHeight + scrollTop <= 0) setShow(true);
    else setShow(false);
  };

  return (
    <MDBox
      sx={{
        position: 'relative',
        height: 'calc(100% - 213px)',
      }}>
      <MDBox
        p={2}
        sx={{
          position: 'relative',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column-reverse',
          height: '100%',
          width: '100%',
          ...styleScroll,
        }}
        onScroll={handleScroll}>
        {loadingContentChat && <MDLoadingInline />}
        {messages.length > 0 &&
          messages.map((item: RoomMessage, index: number) => {
            return (
              <Fragment key={item.messageId}>
                {index === 0 && <div ref={firstMessageRef}></div>}
                {messages.length === index + 1 ? (
                  <BoxChat ref={lastElementRef} message={item} isMe={officeSelected?.uid === item.sender_uid} />
                ) : (
                  <BoxChat message={item} isMe={officeSelected?.uid === item.sender_uid} />
                )}
                {messages.length === index + 1 ? (
                  <DateChat date={item.sending_timestamp} />
                ) : (
                  item?.sending_timestamp &&
                  messages[index + 1]?.sending_timestamp &&
                  !checkDifferentDateMessage(
                    formatDateTimeFirebase(item?.sending_timestamp),
                    formatDateTimeFirebase(messages[index + 1]?.sending_timestamp),
                  ) && <DateChat date={item.sending_timestamp} />
                )}
              </Fragment>
            );
          })}
      </MDBox>
      {show && (
        <MDBox
          sx={{
            position: 'absolute',
            left: '50%',
            bottom: 0,
            transform: 'translate(-50%, -100%)',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#FB8C00',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: '0.7',
            cursor: 'pointer',
            '&:hover': {
              opacity: '0.8',
            },
          }}
          onClick={handleScrollNewestMessage}>
          <Icon
            fontSize="large"
            sx={{
              color: '#fff',
            }}>
            arrow_downward_icon
          </Icon>
        </MDBox>
      )}
    </MDBox>
  );
}
