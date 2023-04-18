import React from 'react';
import ReportContent from '~/components/Report/ReportContent';
import { TargetType } from '~/interfaces/IReport';

export const onPressReportThisMember = ({ modalActions, actor }) => {
  modalActions.hideBottomList();

  const dataReportMember = {
    userId: actor?.id,
    reportedMember: actor,
  };

  modalActions.showModal({
    isOpen: true,
    ContentComponent: (
      <ReportContent
        targetId={dataReportMember.userId}
        targetType={TargetType.MEMBER}
        dataReportMember={dataReportMember}
      />
    ),
  });
};
