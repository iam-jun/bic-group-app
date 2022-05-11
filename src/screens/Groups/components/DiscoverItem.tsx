import {StyleSheet, View} from 'react-native';
import React from 'react';

import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Text from '~/beinComponents/Text';
import ButtonDiscoverItemAction from './ButtonDiscoverItemAction';
import {useBaseHook} from '~/hooks';
import privacyTypes from '~/constants/privacyTypes';
import Icon from '~/beinComponents/Icon';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';

interface DiscoverItemProps {
  id: number;
  testID?: string;
  onPressJoin: (id: number, name: string) => void;
  onPressCancel: (id: number, name: string) => void;
  onPressGroup: (id: number) => void;
}

const DiscoverItem = ({
  id,
  testID,
  onPressGroup,
  onPressJoin,
  onPressCancel,
}: DiscoverItemProps) => {
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  const {items} = useKeySelector(groupsKeySelector.discoverGroups);
  const currentItem = items[id] || {};
  const {name, icon, user_count, privacy, join_status} = currentItem;
  const privacyData = privacyTypes.find(i => i?.type === privacy) || {};
  const {icon: privacyIcon, title: privacyTitle}: any = privacyData || {};

  const onView = () => {
    onPressGroup?.(id);
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
      testID={testID}
      onPress={onView}
      ContentComponent={
        <View style={styles.groupInfo}>
          <Icon
            style={styles.iconSmall}
            icon={privacyIcon}
            size={16}
            tintColor={theme.colors.iconTint}
          />
          <Text.Subtitle useI18n>{privacyTitle}</Text.Subtitle>
          <Text.Subtitle>{`  •  `}</Text.Subtitle>
          <Icon
            style={styles.iconSmall}
            icon={'UsersAlt'}
            size={16}
            tintColor={theme.colors.iconTint}
          />
          <Text.BodyS>{user_count}</Text.BodyS>
          <Text.Subtitle>{` ${t('groups:text_members', {
            count: user_count,
          })}`}</Text.Subtitle>
        </View>
      }
      RightComponent={
        <ButtonDiscoverItemAction
          data={currentItem}
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
    },
  });
};
