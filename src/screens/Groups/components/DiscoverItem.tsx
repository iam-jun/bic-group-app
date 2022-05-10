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

const DiscoverItem = (props: any) => {
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);

  const {id, name, icon, user_count, description, privacy, join_status} =
    props || {};
  const privacyData = privacyTypes.find(i => i?.type === privacy) || {};
  const {icon: privacyIcon, title: privacyTitle}: any = privacyData || {};

  return (
    <PrimaryItem
      showAvatar
      avatar={icon}
      avatarProps={{variant: 'largeAlt'}}
      subTitle={description}
      style={styles.item}
      title={name}
      testID={`community_${id}`}
      // onPress={() => onPressCommunities?.(item)}
      ContentComponent={
        <View style={styles.groupInfo}>
          <Icon
            style={styles.iconSmall}
            icon={privacyIcon}
            size={16}
            tintColor={theme.colors.iconTint}
          />
          <Text.Subtitle useI18n>{privacyTitle}</Text.Subtitle>
          <Text.Subtitle> • </Text.Subtitle>
          <Text.BodySM>{user_count}</Text.BodySM>
          <Text.Subtitle>{` ${t('groups:text_members', {
            count: user_count,
          })}`}</Text.Subtitle>
        </View>
      }
      RightComponent={
        <ButtonDiscoverItemAction
          data={props}
          joinStatus={join_status}
          // onView={onPressCommunities}
          // onJoin={onPressJoin}
          // onCancel={onPressCancel}
        />
      }
    />
  );
};

export default DiscoverItem;

const createStyles = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({});
};
