import React, { FC, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { debounce } from 'lodash';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { useBaseHook } from '~/hooks';
import { ISelectedFilterUser } from '~/interfaces/IHome';

import SearchInput from '~/baseComponents/Input/SearchInput';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';
import { Avatar, Button } from '~/baseComponents';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import useFilterToolbarStore from './store';
import appConfig from '~/configs/appConfig';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import NoSearchResultsFound from '../NoSearchResultsFound';
import { Icon } from '../articles/ArticleFormatToolBar/components/Icon';
import modalActions from '~/storeRedux/modal/actions';
import { getTextNameUserDisplay } from './helper';
import useCommonController from '~/screens/store';

export interface NFSFilterCreateBySpecificProps {
  selectedCreatedBy?: any;
  onSelect?: (selected?: ISelectedFilterUser) => void;
}

const FilterCreateBySpecific: FC<NFSFilterCreateBySpecificProps> = ({
  selectedCreatedBy,
  onSelect,
}: NFSFilterCreateBySpecificProps) => {
  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles();

  const [isShowYou, setIsShowYou] = useState(true);

  const userProfileData = useCommonController((state) => state.myProfile) || {};

  const actions = useFilterToolbarStore((state) => state.actions);
  const searchData = useFilterToolbarStore((state) => state.search);
  const {
    key: searchKey, items: searchItems, hasNextPage: searchUserCanLoadMore, loading: searchUserLoading,
  } = searchData || {};

  useEffect(
    () => {
      actions.searchPostUsers('');
    }, [],
  );

  const onChangeText = debounce(
    (text: string) => {
      const query = text.trim();
      if (query.length > 0) {
        setIsShowYou(false);
      }
      if (query.length === 0) {
        setIsShowYou(true);
      }
      actions.searchPostUsers(query);
    }, appConfig.searchTriggerTime,
  );

  const onPressUser = (user: any) => {
    onSelect?.({ id: `${user?.id}`, name: user?.fullname });
    dispatch(modalActions.hideModal());
  };

  const renderItem = ({ item }: any) => (
    <Button testID={`user_${item?.id}`} style={styles.rowItem} onPress={() => onPressUser(item)}>
      <View style={styles.rowSubContainer}>
        <Avatar.Base
          source={item?.avatar}
          isRounded
          variant="small"
        />
        <ViewSpacing width={spacing.padding.small} />
        <View style={{ flex: 1 }}>
          <Text.BodyM numberOfLines={1} color={colors.neutral60}>{`${getTextNameUserDisplay(item)}`}</Text.BodyM>
        </View>
      </View>
      {
        item?.id === selectedCreatedBy?.id && <Icon testID={`filter_create_by_specific.check_${item?.id}`} style={styles.check} icon="CircleCheckSolid" tintColor={colors.blue50} />
      }
    </Button>
  );

  const renderHeader = () => isShowYou && renderItem({ item: userProfileData });

  const onEndReached = () => {
    actions.searchPostUsers(searchKey, true);
  };

  const renderFooter = () => {
    const isLoading = searchUserLoading;
    const isHasNextPage = searchUserCanLoadMore;
    if (!isLoading && isHasNextPage) {
      return (
        <ActivityIndicator
          style={{ marginVertical: spacing.margin.base }}
          color={theme.colors.gray20}
        />
      );
    }
    return null;
  };

  const renderEmpty = () => {
    if (searchUserLoading) {
      return <LoadingIndicator style={{ margin: spacing.margin.small }} />;
    }
    return <NoSearchResultsFound />;
  };

  return (
    <TouchableOpacity testID="filter_created_by" activeOpacity={1} style={styles.container}>
      <Text.H4 style={styles.textHeader}>
        {t('home:newsfeed_search:filter_post_by')}
      </Text.H4>
      <View style={styles.row}>
        <SearchInput
          style={styles.searchInput}
          placeholder={t('home:newsfeed_search:search_people')}
          onChangeText={onChangeText}
        />
      </View>
      <FlatList
        data={searchItems || []}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => `newsfeed_search_user_${item?.id}`}
        keyboardShouldPersistTaps="always"
        ListFooterComponent={renderFooter}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        onEndReached={onEndReached}
      />
    </TouchableOpacity>
  );
};

const EXTRA_HEIGHT = 200;

const createStyles = () => {
  const insets = useSafeAreaInsets();
  const { deviceHeight, headerHeight } = dimension;
  const containerHeight = deviceHeight - headerHeight - insets.top - EXTRA_HEIGHT;

  return StyleSheet.create({
    container: {
      height: containerHeight,
      paddingHorizontal: 0,
      paddingBottom: 0,
    },
    textHeader: {
      marginTop: spacing.margin.tiny,
      marginBottom: spacing.margin.extraLarge,
      marginHorizontal: spacing.margin.large,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.padding.large,
      marginBottom: spacing.margin.extraLarge,
    },
    searchInput: {
      // marginLeft: spacing.margin.large,
      flex: 1,
    },
    rowItem: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.padding.large,
      marginBottom: spacing.margin.extraLarge,
    },
    rowSubContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    check: {
      marginLeft: spacing.margin.tiny,
    },
  });
};

export default FilterCreateBySpecific;
