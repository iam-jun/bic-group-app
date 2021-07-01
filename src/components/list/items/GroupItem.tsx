import React from 'react';
import {StyleSheet, View} from 'react-native';

import HeaderView from '../../HeaderView';
import ScreenWrapper from '../../ScreenWrapper';
import {margin, padding} from '~/theme/spacing';
import HorizontalView from '../../layout/HorizontalView';
import Icon from '../../Icon';
import TextBadge from '../../texts/TextBadge';
import {IObject} from '~/interfaces/common';
import {useTheme} from 'react-native-paper';

export interface UserType {
  fullName: string;
  avatarUrl: string | null;
  type: string;
}

export interface Props {
  user: UserType;
  updatedAt: string;
  newPostCount: number;
  isPinned?: boolean;
}

const GroupItem: React.FC<Props> = ({
  user,
  updatedAt,
  newPostCount,
  isPinned,
}) => {
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.container}>
      <HeaderView
        avatar={{user, size: 'large'}}
        firstLabel={user.fullName}
        secondLabel={updatedAt}
        style={styles.header}
      />
      <HorizontalView>
        <TextBadge value={newPostCount} />
        <Icon
          icon={isPinned ? 'iconPin' : 'iconPinOutline'}
          style={styles.icon}
          size={22}
          tintColor="grey"
        />
      </HorizontalView>
    </View>
  );
};

const createStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      padding: 4,
      marginHorizontal: margin.large,
      marginVertical: margin.tiny,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 12,
      backgroundColor: colors.background,
    },
    header: {
      paddingVertical: padding.large,
    },
    icon: {
      marginHorizontal: margin.base,
    },
  });
};

export default GroupItem;
