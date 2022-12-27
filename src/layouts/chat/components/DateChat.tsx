import MDBox from 'components/common/MDBox';
import MDTypography from 'components/common/MDTypography';
import * as React from 'react';
import { formatDateTimeFirebase } from 'utils/utils';

export interface DateChatProps {
  date: {
    nanoseconds: number;
    seconds: number;
  };
}

export default function DateChat({ date }: DateChatProps) {
  return (
    <MDBox sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
      <MDTypography variant="caption" color="#919191">
        {date && formatDateTimeFirebase(date, 'MM月DD日')}
      </MDTypography>
    </MDBox>
  );
}
