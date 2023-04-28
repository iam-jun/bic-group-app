import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '@react-navigation/native';
import { spacing } from '~/theme';
import Text from '~/baseComponents/Text';
import WorkInfo from '../../components/WorkInfo';
import { Button } from '~/baseComponents';
import useModalStore from '~/store/modal';
import BlockUserInfo from '~/components/BlockUserInfo';
import useBlockingStore from '~/store/blocking';

interface Props {
  id: string;
  fullname: string;
  username: string;
  latestWork?: {
    titlePosition: string;
    company: string;
  };
  isCurrentUser: boolean;
}

const UserHeader = ({
  id, fullname, username, latestWork, isCurrentUser,
}:Props) => {
  const { colors } = useTheme();
  const { showModal, hideModal } = useModalStore((state) => state.actions);
  const [isDisabled, setIsDisabled] = useState(false);

  const actions = useBlockingStore((state) => state.actions);

  const disableButtonBlockUser = () => {
    setIsDisabled(true);
  };

  const onConfirmBlock = () => {
    actions.blockUser(id, disableButtonBlockUser);
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

  return (
    <View testID="user_profile" style={styles.headerName}>
      <Text.H4 testID="user_profile.fullname" numberOfLines={1}>{fullname}</Text.H4>
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

const styles = StyleSheet.create({
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
});

export default UserHeader;
