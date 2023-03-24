import { StyleSheet } from 'react-native';
import React, { useState } from 'react';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { t } from 'i18next';
import Text from '~/baseComponents/Text';

import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import images from '~/resources/images';
import spacing from '~/theme/spacing';
import { Button } from '~/baseComponents';
import AlertUnblockUser from './AlertUnblockUser';
import useModalStore from '~/store/modal';
import { IBlockingUser } from '~/interfaces/IBlocking';
import { formatDate } from '~/utils/formatter';
import useBlockingStore from '~/store/blocking';

interface Props {
  item: IBlockingUser;
}

const BlockedUserItem = ({ item }: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const { showAlert } = useModalStore((state) => state.actions);
  const { actions } = useBlockingStore();

  const [isLoading, setIsLoading] = useState(false);

  const {
    fullname, avatar, id, createdAt,
  } = item || {};

  const onConfirm = async () => {
    setIsLoading(true);
    await actions.unblockUser(id);
    setIsLoading(false);
  };

  const onUnlock = () => {
    showAlert({
      title: t('settings:title_unblock_user_name', { name: fullname }),
      children: <AlertUnblockUser />,
      cancelBtn: true,
      cancelLabel: t('common:btn_cancel'),
      confirmLabel: t('common:btn_confirm'),
      onConfirm,
      visible: false,
    });
  };

  const renderUser = () => (
    <>
      <Text.BodyMMedium color={colors.neutral60} numberOfLines={1}>
        {fullname}
      </Text.BodyMMedium>
      <Text.BodyS color={colors.neutral60} numberOfLines={1}>
        {t('settings:text_blocked_at')}
        {' '}
        {formatDate(createdAt, 'MMMM DD YYYY')}
      </Text.BodyS>
    </>
  );

  const renderButtonUnblock = () => (
    <Button.Neutral
      testID={`blocked_user_item_${id}.btn_unblock`}
      style={styles.btnUnblock}
      useI18n
      size="small"
      onPress={onUnlock}
      loading={isLoading}
    >
      settings:btn_unblock
    </Button.Neutral>
  );

  return (
    <PrimaryItem
      testID={`blocked_user_item_${id}`}
      showAvatar
      style={styles.itemContainer}
      avatar={avatar || images.img_user_avatar_default}
      avatarProps={{ isRounded: true, variant: 'small' }}
      ContentComponent={renderUser()}
      RightComponent={renderButtonUnblock()}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: spacing.padding.large,
  },
  btnUnblock: {
    marginLeft: spacing.margin.small,
  },
});

export default BlockedUserItem;
