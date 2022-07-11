import React, {FC, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSharedValue} from 'react-native-reanimated';

import {ITheme} from '~/theme/interfaces';

import Header from '~/beinComponents/Header';
import {debounce} from 'lodash';
import Filter from '~/beinComponents/Filter';
import GroupJoined from '~/screens/Groups/YourGroups/GroupJoined';
import {useRootNavigation} from '~/hooks/navigation';
import {useDispatch} from 'react-redux';
import modalActions, {showHideToastMessage} from '~/store/modal/actions';
import YourGroupsSearch from '~/screens/Groups/YourGroups/YourGroupsSearch';
import groupsActions from '~/screens/Groups/redux/actions';
import {useBaseHook} from '~/hooks';
import spacing from '~/theme/spacing';

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
    type: 'JOINED',
  },
  {
    id: 2,
    text: 'communities:title_group_manage',
    type: 'MANAGE',
  },
];

const YourGroups: FC<YourGroupsProps> = ({route}: YourGroupsProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const headerRef = useRef<any>();

  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);
  const translateX = useSharedValue(0);

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
    dispatch(groupsActions.setYourGroupsSearch({showSearch: isShow, key: ''}));
  };

  const onSearchText = debounce((searchText: string) => {
    dispatch(groupsActions.getYourGroupsSearch({communityId, key: searchText}));
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
        searchPlaceholder={t('input:search_group')}
      />
      <View style={styles.container}>
        <Filter
          testID={'your_groups.menu'}
          itemTestID={'your_groups.menu.item'}
          style={{paddingVertical: spacing.padding.small}}
          data={menuData}
          activeIndex={selectedIndex}
          onPress={onPress}
          translateX={translateX}
        />
        {renderContent()}
        <YourGroupsSearch />
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
