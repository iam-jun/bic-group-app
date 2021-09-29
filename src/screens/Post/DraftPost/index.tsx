import React, {useEffect} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {ITheme} from '~/theme/interfaces';
import {useRootNavigation} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';

import Header from '~/beinComponents/Header';
import PostViewDraft from '~/screens/Post/components/PostViewDraft';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import ListView from '~/beinComponents/list/ListView';

const DraftPost = () => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  //get draft post called from MainTabs
  const draftPosts = useKeySelector(postKeySelector.draftPosts) || [];
  const canLoadMore = useKeySelector(postKeySelector.draftCanLoadMore);

  const renderItem = ({item, index}: any) => {
    return <PostViewDraft data={item} />;
  };

  const renderFooter = () => {
    return <ViewSpacing height={theme.spacing.margin.large} />;
  };

  return (
    <View style={styles.container}>
      <Header
        titleTextProps={{useI18n: true}}
        title={'home:draft_post'}
        hideBackOnLaptop
      />
      <ListView
        isFullView
        containerStyle={styles.listContainer}
        data={draftPosts}
        renderItem={renderItem}
        renderItemSeparator={() => (
          <ViewSpacing height={theme.spacing.margin.large} />
        )}
        ListFooterComponent={renderFooter}
        // refreshing={refreshing}
        // onRefresh={() => getData(true)}
        // onLoadMore={() => getData()}
      />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing, dimension} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        Platform.OS === 'web' ? colors.surface : colors.bgSecondary,
    },
    headerOnLaptop: {
      backgroundColor: colors.surface,
    },
    listContainer: {
      flex: 1,
      ...Platform.select({
        web: {
          alignSelf: 'center',
          width: '100%',
          maxWidth: dimension.maxNewsfeedWidth,
        },
      }),
    },
    listFooter: {
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default DraftPost;
