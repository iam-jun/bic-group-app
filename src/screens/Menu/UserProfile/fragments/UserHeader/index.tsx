import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { spacing } from '~/theme';
import Text from '~/baseComponents/Text';
import WorkInfo from '../../components/WorkInfo';
import { Button } from '~/baseComponents';
import useModalStore from '~/store/modal';
import BlockUserInfo from '~/components/BlockUserInfo';
import useBlockingStore from '~/store/blocking';
import VerifiedView from '~/components/VerifiedView';
import useTooltip from '../../../../../components/Tooltip.tsx/stores';
import { useRootNavigation } from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';

interface Props {
  id: string;
  fullname: string;
  username: string;
  screenId: string;
  latestWork?: {
    titlePosition: string;
    company: string;
  };
  isCurrentUser: boolean;
  isVerified?:boolean;
}

const UserHeader = ({
  id, fullname, username, screenId, latestWork, isCurrentUser, isVerified,
}:Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { rootNavigation } = useRootNavigation();

  const { showModal, hideModal } = useModalStore((state) => state.actions);
  const [isDisabled, setIsDisabled] = useState(false);

  const actions = useBlockingStore((state) => state.actions);
  const tooltipActions = useTooltip((state) => state.actions);

  useEffect(() => {
    tooltipActions.setUpScreenTooltip(screenId);
  }, [screenId]);

  const blockUserSuccess = () => {
    setIsDisabled(true);
    rootNavigation.navigate(mainStack.blocking, { popScreen: 2 });
  };

  const onConfirmBlock = () => {
    actions.blockUser(id, blockUserSuccess);
    onCancelBlock();
  };

  const onCancelBlock = () => {
    hideModal();
  };

  const onPressBlock = () => {
    showModal({
      isOpen: true,
      ContentComponent: (
        <BlockUserInfo
          fullname={fullname}
          style={styles.userBlock}
          onConfirmBlock={onConfirmBlock}
          onCancelBlock={onCancelBlock}
        />
      ),
    });
  };

  const renderTextBlock = () => {
    if (isDisabled) {
      return 'block_user:text_blocked_user';
    }
    return 'block_user:text_block_user';
  };

  const onShowTooltip = () => {
    tooltipActions.showTooltip(screenId);
  };

  const onLayoutUserHeader = (event: any) => {
    tooltipActions.setViewPosition(screenId, { y: event.nativeEvent?.layout?.y || 0 });
  };

  const onLayoutFullnameContainer = (event: any) => {
    // eslint-disable-next-line no-unsafe-optional-chaining
    tooltipActions.setViewPosition(screenId, { x: event.nativeEvent?.layout?.x + event.nativeEvent?.layout?.width });
  };

  return (
    <View
      testID="user_profile"
      style={styles.headerName}
      onLayout={onLayoutUserHeader}
    >
      <View style={styles.row} onLayout={onLayoutFullnameContainer}>
        <Text.H4 testID="user_profile.fullname" numberOfLines={1}>
          {fullname}
        </Text.H4>
        <VerifiedView isVerified={isVerified} screenId={screenId} onPress={onShowTooltip} />
      </View>
      {!!username && (
        <Text.BodyS
          testID="user_profile.username"
          color={colors.neutral40}
          style={styles.subtitle}
        >
          {`@${username}`}
        </Text.BodyS>
      )}
      <WorkInfo style={styles.subtitle} latestWork={latestWork} />
      {!isCurrentUser && (
        <Button.Neutral
          testID="user_header.btn_block"
          icon="UserSlashSolid"
          type="ghost"
          style={styles.buttonBlock}
          onPress={onPressBlock}
          disabled={isDisabled}
          useI18n
        >
          {renderTextBlock()}
        </Button.Neutral>
      )}
    </View>
  );
};

const createStyle = (_theme: ExtendedTheme) => StyleSheet.create({
  headerName: {
    alignItems: 'center',
    paddingBottom: spacing.margin.base,
    paddingHorizontal: spacing.margin.large,
  },
  subtitle: {
    marginTop: spacing.margin.small,
    textAlign: 'center',
  },
  buttonBlock: {
    marginTop: spacing.margin.small,
  },
  userBlock: {
    paddingHorizontal: spacing.padding.large,
    paddingVertical: spacing.padding.small,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default UserHeader;
