import React from 'react';
import {StyleSheet} from 'react-native';

import HeaderView from '../../Header/HeaderView';
import ThemeView from '../../ThemeView';
import {margin, padding} from '~/theme/configs/spacing';
import HorizontalView from '../../Layout/HorizontalView';
import Icon from '../../Icon';
import TextBadge from '../../Text/TextBadge';

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
  return (
    <ThemeView style={styles.container}>
      <HeaderView
        avatar={{user, size: 40}}
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
    </ThemeView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
    marginHorizontal: margin.large,
    marginVertical: margin.tiny,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
  },
  header: {
    paddingVertical: padding.large,
  },
  icon: {
    marginHorizontal: margin.base,
  },
});

export default GroupItem;
