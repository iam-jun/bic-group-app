import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ActivityIndicator, Dimensions,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import * as modalActions from '~/storeRedux/modal/actions';

import { spacing } from '~/theme';
import Text from '~/baseComponents/Text';
import Icon from '~/baseComponents/Icon';
import Button from '~/beinComponents/Button';
import ReportReasons from './ReportReasons';
import {
  TargetType, ReportTo, IPayloadReportContent, IPayloadReportMember,
} from '~/interfaces/IReport';
import useReportContentStore from '../store';

const screenHeight = Dimensions.get('window').height;
const modalHeight = 0.35 * screenHeight;

interface IReportContentProps {
  targetId: string;
  groupIds?: string[];
  targetType: TargetType;
  reportTo?: ReportTo;
  dataComment?: {
    parentCommentId?: string;
    postId?: string;
  };
  dataReportMember?: {
    communityId?: string;
  };
}

const ReportContent: React.FC<IReportContentProps> = (props) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { colors } = theme;
  const { targetId, targetType, dataReportMember } = props || {};

  const [reasonState, setReasonState] = useState<any>(null);
  const reportContentActions = useReportContentStore((state) => state.actions);
  const { reportReasons, memberReportReasons } = useReportContentStore((state) => state);
  const headerTitle = targetType === TargetType.MEMBER
    ? 'groups:member_menu:label_report_member' : 'common:text_report_content';

  useEffect(() => {
    if (!reportReasons.data || reportReasons.data?.length === 0) {
      reportContentActions.getReportReasons();
    }
    if (!memberReportReasons.data || memberReportReasons.data?.length === 0) {
      reportContentActions.getMemberReportReasons();
    }
  }, []);

  const onClose = () => {
    dispatch(modalActions.hideModal());
    setReasonState(null);
  };

  const onSubmit = () => {
    if (targetType === TargetType.MEMBER) {
      const payload = {
        targetId,
        communityId: dataReportMember?.communityId,
        reason: reasonState?.id,
      } as IPayloadReportMember;

      reportContentActions.reportMember(payload);
    } else {
      const payload = {
        ...props,
        reasonType: reasonState?.id,
        reason: reasonState?.value,
      } as IPayloadReportContent;

      reportContentActions.reportContent(payload);
    }

    onClose();
  };

  const renderHeaderComponent = () => (
    <View style={styles.header}>
      <Icon
        icon="iconBack"
        size={18}
        onPress={onClose}
        style={styles.iconLeft}
      />
      <View style={styles.boxTitleHeader}>
        <Text.H4
          useI18n
          color={colors.neutral80}
        >
          { headerTitle }
        </Text.H4>
      </View>
    </View>
  );

  const renderContentComponent = () => {
    if (reportReasons.loading) {
      return (
        <View style={styles.boxLoading}>
          <ActivityIndicator size="small" color={colors.gray30} />
        </View>
      );
    }

    return (
      <>
        <ReportReasons
          reasonState={reasonState}
          targetType={targetType}
          setReasonState={setReasonState}
        />
        <Button.Primary
          useI18n
          testID="report_content_bottom_sheet.btn_submit"
          onPress={onSubmit}
          style={styles.btnSubmit}
          disabled={!reasonState || !targetId}
          borderRadius={spacing.borderRadius.base}
          textProps={{ variant: 'buttonM' }}
        >
          common:btn_submit
        </Button.Primary>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeaderComponent()}
      {renderContentComponent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.padding.large,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.margin.large,
  },
  boxTitleHeader: {
    flex: 1,
  },
  boxLoading: {
    justifyContent: 'center',
    alignItems: 'center',
    height: modalHeight,
  },
  iconLeft: {
    marginRight: spacing.margin.small,
  },
  btnSubmit: {
    marginTop: 43,
  },
});

export default ReportContent;
