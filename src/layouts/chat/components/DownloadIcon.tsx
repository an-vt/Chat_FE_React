import { Icon } from '@mui/material';
import axios from 'axios';
import MDBox from 'components/common/MDBox';
import { ref } from 'firebase/storage';
import * as React from 'react';
import { storage } from 'services/firebase';
import { downloadFile } from 'utils/utils';

export interface IIconDownloadProps {
  content: string;
  isMe: boolean;
}

export function DownloadIcon({ content, isMe }: IIconDownloadProps) {
  const httpsReference = ref(storage, content);
  const download = () => {
    axios({
      url: content,
      method: 'GET',
      responseType: 'blob',
    }).then((response: any) => {
      downloadFile(response, httpsReference?.name);
    });
  };
  return (
    <MDBox
      onClick={download}
      sx={{
        cursor: 'pointer',
      }}>
      <Icon
        fontSize="medium"
        sx={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          left: `${isMe ? '-45px' : 'unset'}`,
          right: `${isMe ? 'unset' : '-45px'}`,
          color: '#C7CCD0',
        }}>
        file_download_icon
      </Icon>
    </MDBox>
  );
}
