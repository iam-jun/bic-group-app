import {StyleSheet, View} from 'react-native';
import React from 'react';

import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Text from '~/beinComponents/Text';
import ButtonDiscoverItemAction from './ButtonDiscoverItemAction';
import privacyTypes from '~/constants/privacyTypes';
import Icon from '~/beinComponents/Icon';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import {useBaseHook} from '~/hooks';

interface DiscoverItemProps {
  item: any;
  testID?: string;
  onPressJoin: (id: number, name: string) => void;
  onPressCancel: (id: number, name: string) => void;
  onPressView?: (id: number) => void;
}

const DiscoverItem = ({
  item,
  testID,
  onPressView,
  onPressJoin,
  onPressCancel,
}: DiscoverItemProps) => {
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyles(theme);
  const {t} = useBaseHook();

  const {id, name, icon, user_count, privacy, join_status} = item || {};
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
            tintColor={colors.textSecondary}
          />
          <Text.BodyS color={colors.textSecondary} useI18n>
            {privacyTitle}
          </Text.BodyS>
          <Text.BodyS color={colors.textSecondary}>{`  •  `}</Text.BodyS>
          <Icon
            style={styles.iconSmall}
            icon={'UserGroup'}
            size={16}
            tintColor={colors.textSecondary}
          />
          <Text.BodyS color={colors.textSecondary}>{user_count}</Text.BodyS>
          <Text.BodyS color={colors.textSecondary}>
            {` ${t('groups:text_members', {
              count: user_count,
            })}`}
          </Text.BodyS>
        </View>
      }
      RightComponent={
        <ButtonDiscoverItemAction
          data={item}
          joinStatus={join_status}
          onView={onView}
          onJoin={onJoin}
          onCancel={onCancel}
        />
      }
    />
  );
};

export default DiscoverItem;

const createStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
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
};
