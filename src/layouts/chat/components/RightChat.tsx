import { useAppSelector } from 'app/hooks';
import MDBox from 'components/common/MDBox';
import { selectorOfficeSelected } from 'components/Navbars/DashboardNavbar/dashboardNavbarSlice';
import { useChat } from 'context/chat';
import { serverTimestamp } from 'firebase/firestore';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ChatApiService } from 'services/chat.service';
import ContentChat from './ContentChat';
import FooterChat from './FooterChat';

export default function RightChat() {
  const { selectedRoom, handleGoToNewestMessage } = useChat();
  const officeSelected = useAppSelector(selectorOfficeSelected);
  const { t } = useTranslation('common');

  const handleSubmit = (content: string, type: 'text' | 'image' | 'video' | 'announcement' = 'text') => {
    const data = {
      sender_uid: officeSelected?.uid,
      sender_name: officeSelected?.name,
      sender_type: 'school',
      receiver_uid: selectedRoom?.partner_uid,
      receiver_name: selectedRoom?.partner_name,
      receiver_type: 'parent',
      type: type,
      content,
      sending_timestamp: serverTimestamp(),
    };

    ChatApiService.addDocument(`/rooms/${selectedRoom?.roomId}/messages`, data)
      .then(() => {
        handleGoToNewestMessage();
      })
      .catch((err: any) => {
        console.log(err);
        toast.error(t('chat.sendFailed'));
      });
  };
  return (
    <MDBox sx={{ maxHeight: '83.8vh', height: '83.8vh', display: 'flex', flexDirection: 'column' }}>
      <ContentChat />
      <FooterChat onSubmit={handleSubmit} />
    </MDBox>
  );
}
