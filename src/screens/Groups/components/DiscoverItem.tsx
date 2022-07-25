import {StyleSheet, View} from 'react-native';
import React from 'react';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Text from '~/beinComponents/Text';
import ButtonDiscoverItemAction from './ButtonDiscoverItemAction';
import privacyTypes from '~/constants/privacyTypes';
import Icon from '~/beinComponents/Icon';
import {useBaseHook} from '~/hooks';
import spacing from '~/theme/spacing';

interface DiscoverItemProps {
  item: any;
  testID?: string;
  onPressJoin: (id: string, name: string) => void;
  onPressCancel: (id: string, name: string) => void;
  onPressView?: (id: string) => void;
}

const DiscoverItem = ({
  item,
  testID,
  onPressView,
  onPressJoin,
  onPressCancel,
}: DiscoverItemProps) => {
  const theme: ExtendedTheme = useTheme();
  const {colors} = theme;
  const {t} = useBaseHook();

  const {id, name, icon, userCount, privacy, joinStatus} = item || {};
  const privacyData = privacyTypes.find(i => i?.type === privacy) || {};
  const {icon: privacyIcon, title: privacyTitle}: any = privacyData || {};

  const onView = () => {
    onPressView?.(id);
  };

  const onJoin = () => {
    onPressJoin(id, name);
  };

  const onCancel = () => {
    onPressCancel(id, name);
  };

  return (
    <PrimaryItem
      showAvatar
      avatar={icon}
      avatarProps={{variant: 'largeAlt'}}
      style={styles.item}
      title={name}
      titleProps={{variant: 'h5'}}
      testID={testID}
      onPress={onView}
      ContentComponent={
        <View style={styles.groupInfo}>
          <Icon
            style={styles.iconSmall}
            icon={privacyIcon}
            size={16}
            tintColor={colors.gray50}
          />
          <Text.BodyS color={colors.gray50} useI18n>
            {privacyTitle}
          </Text.BodyS>
          <Text.BodyS color={colors.gray50}>{`  •  `}</Text.BodyS>
          <Icon
            style={styles.iconSmall}
            icon={'UserGroup'}
            size={16}
            tintColor={colors.gray50}
          />
          <Text.BodyS color={colors.gray50}>{userCount}</Text.BodyS>
          <Text.BodyS color={colors.gray50}>
            {` ${t('groups:text_members', {
              count: userCount,
            })}`}
          </Text.BodyS>
        </View>
      }
      RightComponent={
        <ButtonDiscoverItemAction
          data={item}
          joinStatus={joinStatus}
          onView={onView}
          onJoin={onJoin}
          onCancel={onCancel}
        />
      }
    />
  );
};

export default DiscoverItem;

const styles = StyleSheet.create({
  item: {
    height: '100%',
    flex: 1,
    paddingVertical: spacing.padding.small,
  },
  iconSmall: {
    marginRight: spacing.margin.tiny,
    height: 16,
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
});
