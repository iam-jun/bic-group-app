import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import ListView from '~/beinComponents/list/ListView';
import PostItem from '~/beinComponents/list/items/PostItem';
import ViewSpacing from '~/beinComponents/ViewSpacing';

import HeaderCreatePost from '~/screens/Home/Newsfeed/components/HeaderCreatePost';
import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';

const GroupContent = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const groupPosts = useKeySelector(groupsKeySelector.groupPosts);

  const renderItem = ({item}: any) => {
    return <PostItem postData={item} />;
  };

  return (
    <ListView
      isFullView
      style={styles.listContainer}
      listStyle={styles.listStyle}
      data={groupPosts}
      renderItem={renderItem}
      ListHeaderComponent={<HeaderCreatePost />}
      ListHeaderComponentStyle={styles.listHeaderComponentStyle}
      ListFooterComponent={<ViewSpacing height={theme.spacing.padding.base} />}
      renderItemSeparator={() => (
        <ViewSpacing height={theme.spacing?.margin.base} />
      )}
    />
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing, dimension} = theme;

  return StyleSheet.create({
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
    listHeaderComponentStyle: {
      marginTop: spacing?.margin.base,
    },
  });
};

export default GroupContent;
