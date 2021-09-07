import React, {useEffect, useState} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import useGroups from '~/hooks/groups';
import groupsActions from '~/screens/Groups/redux/actions';
import ListView from '~/beinComponents/list/ListView';
import {useBaseHook} from '~/hooks';
import SearchInput from '~/beinComponents/inputs/SearchInput';
import Header from '~/beinComponents/Header';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {IGroup} from '~/interfaces/IGroup';
import {deviceDimensions} from '~/theme/dimension';

const Groups: React.FC = () => {
  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const {t} = useBaseHook();
  const styles = themeStyles(theme);

  const dimensions = useWindowDimensions();
  const isLaptop = dimensions.width >= deviceDimensions.laptop;

  const groupsData = useGroups();
  const {loadingJoinedGroups, joinedGroups} = groupsData;

  // for rooms search - client search
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<IGroup[]>([]);

  const onChangeTextSearch = (text: string) => {
    const newSearchResults = joinedGroups.filter((item: IGroup) =>
      item.name.toLowerCase().includes(text.toLowerCase()),
    );
    setSearchText(text);
    setSearchResults(newSearchResults);
  };

  useEffect(() => {
    dispatch(groupsActions.getJoinedGroups());
  }, []);

  return (
    <View style={styles.containerScreen}>
      <Header
        hideBack
        title="tabs:groups"
        titleTextProps={{useI18n: true}}
        removeBorderAndShadow={isLaptop}
      />
      <View style={styles.groupContainer}>
        <SearchInput
          style={{marginVertical: 12}}
          onChangeText={onChangeTextSearch}
          placeholder={t('input:search_group')}
        />
        <ListView
          type={'flatGroups'}
          loading={loadingJoinedGroups}
          data={searchText ? searchResults : joinedGroups}
          isFullView
          ListHeaderComponent={
            <Text.H5>
              {searchText ? t('groups:search_results') : t('groups:all_groups')}
            </Text.H5>
          }
        />
      </View>
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing, colors} = theme;

  return StyleSheet.create({
    containerScreen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    groupContainer: {
      flex: 1,
      paddingHorizontal: spacing?.padding.large,
    },
  });
};

export default Groups;
