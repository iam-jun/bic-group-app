import React from 'react';
import {View, Platform, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import ListView from '~/beinComponents/list/ListView';
import PostItem from '~/beinComponents/list/items/PostItem';
import ViewSpacing from '~/beinComponents/ViewSpacing';

import HeaderCreatePost from '~/screens/Home/Newsfeed/components/HeaderCreatePost';
import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import GroupInfoHeader from '~/screens/Groups/GroupDetail/components/GroupInfoHeader';

const GroupContent = () => {
  const theme = useTheme() as ITheme;
  const {spacing} = theme || {};
  const styles = themeStyles(theme);
  const groupPosts = useKeySelector(groupsKeySelector.groupPosts);

  const groupData = useKeySelector(groupsKeySelector.groupDetail.group);

  const renderItem = ({item}: any) => {
    return <PostItem postData={item} />;
  };

  const renderHeader = () => {
    return (
      <View>
        <GroupInfoHeader />
        <ViewSpacing height={spacing.margin.small} />
        <HeaderCreatePost audience={groupData} />
      </View>
    );
  };

  return (
    <ListView
      isFullView
      style={styles.listContainer}
      data={groupPosts}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
      ListHeaderComponentStyle={styles.listHeaderComponentStyle}
      ListFooterComponent={<ViewSpacing height={theme.spacing.padding.base} />}
      renderItemSeparator={() => (
        <ViewSpacing height={theme.spacing.margin.base} />
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
      marginTop: spacing.margin.small,
      marginBottom: spacing.margin.base,
    },
  });
};

export default GroupContent;
