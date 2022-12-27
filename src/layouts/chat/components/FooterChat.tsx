import { Icon } from '@mui/material';
import { useAppSelector } from 'app/hooks';
import MDBox from 'components/common/MDBox';
import MDButton from 'components/common/MDButton';
import MDInput from 'components/common/MDInput';
import MDTypography from 'components/common/MDTypography';
import { selectorOfficeSelected } from 'components/Navbars/DashboardNavbar/dashboardNavbarSlice';
import { useChat } from 'context/chat';
import { AttendeeRoom } from 'models/Chat';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ChatApiService } from 'services/chat.service';
import { getFolderUploadFirebase } from 'utils/utils';
import { v4 as uuidv4 } from 'uuid';

export interface IFooterChatProps {
  onSubmit: (content: string, type: 'text' | 'image' | 'video' | 'announcement') => void;
}

export default function FooterChat({ onSubmit }: IFooterChatProps) {
  const officeSelected = useAppSelector(selectorOfficeSelected);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const { t } = useTranslation('common');
  const ONE_MB_TO_BYTES = 1048576;
  const MAXIMUM_TOTAL_SIZE_FILE_BYTES = 200 * ONE_MB_TO_BYTES;
  const MAX_CHAR_COUNTER = 2000;
  const [disableBtnSend, setDisableBtnSend] = useState<boolean>(true);
  const { selectedRoom, rooms, isParentExpiredContract } = useChat();

  const room = rooms.find((item: AttendeeRoom) => item.roomId === selectedRoom?.roomId);
  const clearInput = () => {
    if (inputRef.current && fileRef.current) {
      inputRef.current.value = '';
      fileRef.current.value = '';
    }
  };

  useEffect(() => {
    return clearInput;
  }, [selectedRoom?.roomId]);

  const handleClick = () => {
    if (inputRef?.current) {
      onSubmit(inputRef.current.value.trim(), 'text');
      inputRef.current.value = '';
      setDisableBtnSend(true);
    }
  };

  const handleUploadFile = (e: any) => {
    const files = e.target.files;
    let totalSizeFile = 0;
    let isContainFileOther = false;
    for (const file of files) {
      totalSizeFile += file.size;
      if (!(file.type.split('/')[0] === 'image' || file.type.split('/')[0] === 'video')) {
        isContainFileOther = true;
      }
    }

    if (isContainFileOther) {
      //replace param message error
      toast.warning(t('msg.ERR1000').replace('{0}', 'ファイルの拡張子'));
    } else {
      if (totalSizeFile > MAXIMUM_TOTAL_SIZE_FILE_BYTES) {
        toast.warning(t('chat.maximumFileSize'));
      } else {
        for (const file of files) {
          const typeFileSplits = file.name.split('.');
          const typeFile = typeFileSplits[typeFileSplits.length - 1];

          const pathFileUpdate = `user-content/${officeSelected?.uid}/${moment().format(
            'YYYYMM',
          )}/${getFolderUploadFirebase(file)}/${uuidv4()}.${typeFile}`;
          ChatApiService.uploadFiles(file, pathFileUpdate)
            .then((resp: any) => {
              onSubmit(resp, file?.type?.split('/')[0]);
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
    }
    if (fileRef?.current) fileRef.current.value = '';
  };

  const handleChangeInput = (e: any) => {
    if (e.target.value.length > MAX_CHAR_COUNTER) {
      inputRef.current.value = inputRef.current.value.substring(0, MAX_CHAR_COUNTER);
    }
    if (e.target.value.trim().length > 0) {
      setDisableBtnSend(false);
    } else {
      setDisableBtnSend(true);
    }
  };

  const handleFocus = async () => {
    if (room?.unread_count > 0) {
      try {
        await ChatApiService.updateDocument(`attendees/${officeSelected?.uid}/rooms`, selectedRoom?.roomId, {
          unread_count: 0,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <MDBox
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2,
        borderTop: '1px solid #ccc',
        height: '213px',
      }}>
      <MDBox
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: `${isParentExpiredContract ? '0.5' : '1'}`,
        }}>
        <input
          style={{ display: 'none' }}
          id="upload-image"
          onChange={handleUploadFile}
          disabled={isParentExpiredContract}
          type="file"
          accept="video/*,image/*"
          multiple
          ref={fileRef}
        />
        <label htmlFor="upload-image">
          <MDBox
            sx={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #ccc',
              borderRadius: 2,
              p: 0.5,
              pr: 1,
              right: '16px',
              cursor: 'pointer',
            }}>
            <Icon>file_upload_icon</Icon>
            <MDTypography variant="body2" fontWeight="bold" ml={0.5}>
              {t('chat.uploadBtn')}
            </MDTypography>
          </MDBox>
        </label>
        <MDButton color="info" onClick={handleClick} disabled={disableBtnSend || isParentExpiredContract}>
          {t('chat.sendBtn')}
        </MDButton>
      </MDBox>
      <MDInput
        placeholder={isParentExpiredContract ? t('msg.ERR1179') : t('chat.placeholderInput')}
        multiline
        sx={{ flex: '1' }}
        fullWidth
        inputRef={inputRef}
        onChange={handleChangeInput}
        minRows={5}
        maxRows={5}
        onFocus={handleFocus}
        disabled={isParentExpiredContract}
        onKeyPress={(e: any) => {
          if (e.key === 'Enter' && (e.altKey || e.ctrlKey)) {
            inputRef.current.value = inputRef.current.value + '\n';
          }
          if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
            if (inputRef?.current?.value.trim()) {
              handleClick();
            } else {
              inputRef.current.value = '';
              setDisableBtnSend(true);
            }
            e.preventDefault();
          }
        }}
      />
    </MDBox>
  );
}
