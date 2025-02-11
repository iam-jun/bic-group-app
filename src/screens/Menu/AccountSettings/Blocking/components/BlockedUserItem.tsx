import { StyleSheet, View } from 'react-native';
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
import VerifiedView from '~/components/VerifiedView';

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
    fullname, avatar, id, updatedAt, username, isVerified,
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
    <View style={styles.userContainer}>
      <View style={styles.row}>
        <Text.BodyMMedium color={colors.neutral60} numberOfLines={1}>
          {fullname}
        </Text.BodyMMedium>
        <VerifiedView size={12} isVerified={isVerified} />
      </View>
      <Text.BodyS color={colors.neutral30} numberOfLines={1}>
        @
        {username}
      </Text.BodyS>
    </View>
  );

  const renderButtonUnblock = () => (
    <Button.Neutral
      testID={`blocked_user_item_${id}.btn_unblock`}
      style={styles.btnUnblock}
      useI18n
      size="medium"
      type="ghost"
      onPress={onUnlock}
      loading={isLoading}
      icon="UserSlashSolid"
      iconSize={14}
    >
      settings:btn_unblock
    </Button.Neutral>
  );

  return (
    <View style={styles.container}>
      <PrimaryItem
        testID={`blocked_user_item_${id}`}
        showAvatar
        style={styles.itemContainer}
        avatar={avatar || images.img_user_avatar_default}
        avatarProps={{ isRounded: true, variant: 'small' }}
        ContentComponent={renderUser()}
      />
      <Text.BodyXS color={colors.neutral40} style={styles.time}>
        {t('settings:text_blocked_at')}
        {' '}
        {formatDate(updatedAt, 'MMM DD, YYYY')}
      </Text.BodyXS>
      {renderButtonUnblock()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.padding.large,
  },
  itemContainer: {
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
  time: {
    marginTop: spacing.margin.base,
  },
  btnUnblock: {
    marginTop: spacing.margin.base,
    alignSelf: 'flex-start',
  },
  userContainer: {
    paddingRight: spacing.padding.xSmall,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default BlockedUserItem;
