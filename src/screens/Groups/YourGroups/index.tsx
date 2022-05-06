import React, {FC, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Header from '~/beinComponents/Header';
import {debounce} from 'lodash';
import CommunityMenu from '~/screens/Groups/Communities/components/CommunityMenu';
import GroupJoined from '~/screens/Groups/YourGroups/GroupJoined';
import {useRootNavigation} from '~/hooks/navigation';
import {useDispatch} from 'react-redux';
import modalActions, {showHideToastMessage} from '~/store/modal/actions';

export interface YourGroupsProps {
  route?: {
    params?: {
      communityId: number;
    };
  };
}

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

const YourGroups: FC<YourGroupsProps> = ({route}: YourGroupsProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const headerRef = useRef<any>();

  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const communityId = route?.params?.communityId as number;

  if (!communityId) {
    rootNavigation.goBack();
    dispatch(
      showHideToastMessage({
        content: 'common:text_error_message',
        props: {textProps: {useI18n: true}, type: 'error'},
      }),
    );
  }

  const onPress = (item: any, index: number) => {
    // setSelectedIndex(index);
    if (item?.type === 'MANAGE') {
      dispatch(modalActions.showAlertNewFeature());
    }
  };

  const onShowSearch = (isShow: boolean) => {
    console.log(`\x1b[36m🐣️ index onShowSearch: ${isShow}\x1b[0m`);
  };

  const onSearchText = debounce((searchText: string) => {
    console.log(`\x1b[36m🐣️ index onSearchText: ${searchText}\x1b[0m`);
  }, 300);

  const renderContent = () => {
    return <GroupJoined communityId={communityId} />;
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
  const {colors} = theme;
  return StyleSheet.create({
    container: {flex: 1},
    containerScreen: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });
};

export default YourGroups;
