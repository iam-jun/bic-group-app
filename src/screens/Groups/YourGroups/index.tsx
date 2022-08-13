import React, { FC, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import Header from '~/beinComponents/Header';
import Filter from '~/beinComponents/Filter';
import GroupJoined from '~/screens/Groups/YourGroups/GroupJoined';
import { useRootNavigation } from '~/hooks/navigation';
import modalActions, { showHideToastMessage } from '~/storeRedux/modal/actions';
import YourGroupsSearch from '~/screens/Groups/YourGroups/YourGroupsSearch';
import groupsActions from '~/storeRedux/groups/actions';
import { useBaseHook } from '~/hooks';
import spacing from '~/theme/spacing';

export interface YourGroupsProps {
  route?: {
    params?: {
      communityId: string;
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

const YourGroups: FC<YourGroupsProps> = ({ route }: YourGroupsProps) => {
  const headerRef = useRef<any>();

  const { t } = useBaseHook();
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const translateX = useSharedValue(0);

  const communityId = route?.params?.communityId;

  if (!communityId) {
    rootNavigation.goBack();
    dispatch(showHideToastMessage({
      content: 'common:text_error_message',
      props: { textProps: { useI18n: true }, type: 'error' },
    }));
  }

  const onPress = (item: any) => {
    if (item?.type === 'MANAGE') {
      dispatch(modalActions.showAlertNewFeature());
    }
  };

  const onShowSearch = (isShow: boolean) => {
    dispatch(groupsActions.setYourGroupsSearch({ showSearch: isShow, key: '' }));
  };

  const onSearchText = debounce(
    (searchText: string) => {
      communityId && dispatch(groupsActions.getYourGroupsSearch({ communityId, key: searchText }));
    }, 300,
  );

  const renderContent = () => (communityId ? <GroupJoined communityId={communityId} /> : null);

  return (
    <View style={styles.containerScreen}>
      <Header
        headerRef={headerRef}
        title="communities:title_your_groups"
        titleTextProps={{ useI18n: true }}
        onShowSearch={onShowSearch}
        onSearchText={onSearchText}
        searchPlaceholder={t('input:search_group')}
      />
      <View style={styles.container}>
        <Filter
          testID="your_groups.menu"
          itemTestID="your_groups.menu.item"
          style={{ paddingVertical: spacing.padding.small }}
          data={menuData}
          onPress={onPress}
          translateX={translateX}
        />
        {renderContent()}
        <YourGroupsSearch />
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: { flex: 1 },
    containerScreen: {
      flex: 1,
      backgroundColor: colors.white,
    },
  });
};

export default YourGroups;
