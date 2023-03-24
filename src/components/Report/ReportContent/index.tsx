import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ActivityIndicator, Dimensions, ScrollView,
} from 'react-native';
import { useTheme } from '@react-navigation/native';

import { spacing } from '~/theme';
import Text from '~/baseComponents/Text';
import Icon from '~/baseComponents/Icon';
import Button from '~/beinComponents/Button';
import ReportReasons from './ReportReasons';
import {
  TargetType, ReportTo, IPayloadReportContent, IPayloadReportMember,
} from '~/interfaces/IReport';
import useReportContentStore from '../store';
import useModalStore from '~/store/modal';
import BlockUserInfo from '~/components/BlockUserInfo';
import { ICommunityMembers } from '~/interfaces/ICommunity';
import { IGroupMembers } from '~/interfaces/IGroup';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Checkbox from '~/baseComponents/Checkbox';
import Divider from '~/beinComponents/Divider';
import useUserProfileStore from '~/screens/Menu/UserProfile/store';
import useBlockingStore from '~/store/blocking';

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
    reportedMember: ICommunityMembers | IGroupMembers;
  };
}

const ReportContent: React.FC<IReportContentProps> = (props) => {
  const theme = useTheme();
  const { colors } = theme;
  const { targetId, targetType, dataReportMember } = props || {};

  const [shouldBlockUserInfo, setShouldBlockUserInfo] = useState(false);
  const [reasonState, setReasonState] = useState<any>(null);
  const reportContentActions = useReportContentStore((state) => state.actions);
  const { reportReasons, memberReportReasons } = useReportContentStore((state) => state);
  const shouldReportMember = targetType === TargetType.MEMBER;
  const headerTitle = shouldReportMember
    ? 'groups:member_menu:label_report_member' : 'common:text_report_content';
  const modalActions = useModalStore((state) => state.actions);
  const { blockUser } = useUserProfileStore((state) => state.actions);

  const { list: listBlocking, actions: { getListBlockingUsers } } = useBlockingStore();
  const isBlockedUser = listBlocking.some((item) => item.id === targetId);

  useEffect(() => {
    if (!reportReasons.data || reportReasons.data?.length === 0) {
      reportContentActions.getReportReasons();
    }
    if (!memberReportReasons.data || memberReportReasons.data?.length === 0) {
      reportContentActions.getMemberReportReasons();
    }
  }, []);

  const onClose = () => {
    modalActions.hideModal();
    setReasonState(null);
  };

  const onSubmit = async () => {
    if (shouldReportMember) {
      const payload = {
        targetId,
        communityId: dataReportMember?.communityId,
        reason: reasonState?.id,
      } as IPayloadReportMember;

      reportContentActions.reportMember(payload);

      if (shouldBlockUserInfo) {
        await blockUser(targetId);
        getListBlockingUsers(true);
      }
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

  const onPressCheckBlockUser = (isChecked: boolean) => {
    setShouldBlockUserInfo(isChecked);
  };

  const renderBlockUser = () => (
    shouldReportMember && !isBlockedUser && (
      <>
        <Divider />
        <ViewSpacing height={spacing.margin.base} />
        <Checkbox label="block_user:text_block_user_also" onPress={onPressCheckBlockUser} useI18n />
        {shouldBlockUserInfo && (
          <View>
            <ViewSpacing height={spacing.margin.base} />
            <BlockUserInfo fullname={dataReportMember?.reportedMember?.fullname} />
          </View>
        )}
      </>
    )
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
      <ScrollView>
        <ReportReasons
          reasonState={reasonState}
          targetType={targetType}
          setReasonState={setReasonState}
        />
        {renderBlockUser()}
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
      </ScrollView>
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
