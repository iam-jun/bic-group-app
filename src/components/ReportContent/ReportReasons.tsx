import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import { Radio } from '~/baseComponents';
import { spacing } from '~/theme';
import useReportContentStore from './store';
import { IReason, TargetType } from '~/interfaces/IReport';

interface ReportReasonsProps {
  reasonState: IReason;
  targetType: TargetType;
  setReasonState: (item: IReason) => void;
}

const ReportReasons: React.FC<ReportReasonsProps> = ({
  reasonState,
  targetType,
  setReasonState,
}) => {
  const { reportReasons, memberReportReasons } = useReportContentStore((state) => state);
  const reasons = targetType === TargetType.MEMBER ? memberReportReasons.data : reportReasons.data;

  const renderReasons = () => (
    reasons?.map((item) => (
      <Radio
        key={`report_content${item.id}`}
        useI18n
        label={item.value}
        isChecked={reasonState?.id === item.id}
        onPress={() => setReasonState(item)}
        style={styles.radioReason}
      />
    ))
  );

  return (
    <ScrollView style={styles.container}>
      {renderReasons()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: spacing.margin.large,
  },
  radioReason: {
    marginBottom: spacing.margin.base,
  },
});

export default ReportReasons;
