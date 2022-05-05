import React, {FC, useRef, useState} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Header from '~/beinComponents/Header';
import {debounce} from 'lodash';
import CommunityMenu from '~/screens/Groups/Communities/components/CommunityMenu';
import GroupJoined from '~/screens/Groups/YourGroups/GroupJoined';

export interface YourGroupsProps {
  style?: StyleProp<ViewStyle>;
}

const YourGroups: FC<YourGroupsProps> = ({style}: YourGroupsProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const headerRef = useRef<any>();

  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const menuData = [
    {
      id: 1,
      text: 'communities:title_group_joined',
      icon: 'UsersAlt',
      type: 'JOINED',
    },
    {
      id: 2,
      text: 'communities:title_manage',
      icon: 'Dashboard',
      type: 'MANAGE',
    },
  ];

  const onPress = (item: any, index: number) => {
    // setSelectedIndex(index);
    if (item?.type === 'MANAGE') {
      alert('Manage Group');
    }
  };

  const onShowSearch = (isShow: boolean) => {
    console.log(`\x1b[36m🐣️ index onShowSearch: ${isShow}\x1b[0m`);
  };

  const onSearchText = debounce((searchText: string) => {
    console.log(`\x1b[36m🐣️ index onSearchText: ${searchText}\x1b[0m`);
  }, 300);

  const renderContent = () => {
    return <GroupJoined />;
  };

  return (
    <View style={styles.containerScreen}>
      <Header
        headerRef={headerRef}
        title="communities:title_your_groups"
        titleTextProps={{useI18n: true}}
        onShowSearch={onShowSearch}
        onSearchText={onSearchText}
      />
      <View style={styles.container}>
        <CommunityMenu
          style={{paddingVertical: spacing.padding.small}}
          data={menuData}
          selectedIndex={selectedIndex}
          onPress={onPress}
        />
        {renderContent()}
      </View>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {flex: 1},
    containerScreen: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });
};

export default YourGroups;
