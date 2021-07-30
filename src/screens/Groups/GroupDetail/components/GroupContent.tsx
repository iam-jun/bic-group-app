import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import ListView from '~/beinComponents/list/ListView';
import PostItem from '~/beinComponents/list/items/PostItem';
import HeaderCreatePost from '~/screens/Home/Newsfeed/components/HeaderCreatePost';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import {ITheme} from '~/theme/interfaces';
import groupsActions from '~/screens/Groups/redux/actions';
import useGroups from '~/hooks/groups';

const GroupContent = () => {
  const theme: ITheme = useTheme();
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const groupData = useGroups();
  const {loadingGroupPosts, groupPosts} = groupData;
  console.log('groupPosts', groupPosts);

  useEffect(() => {
    // TODO: need to change groupId
    dispatch(groupsActions.getGroupPosts(0));
    // if (id) {
    //   dispatch(groupsActions.getGroupPosts(id));
    //   dispatch(groupsActions.getGroupDetail(id));
    // }
  }, []);

  const renderItem = ({item}: any) => {
    return <PostItem postData={item} />;
  };

  return (
    <ListView
      isFullView
      listStyle={styles.listStyle}
      loading={loadingGroupPosts}
      data={groupPosts}
      renderItem={renderItem}
      ListHeaderComponent={<HeaderCreatePost />}
      ListHeaderComponentStyle={styles.listHeaderComponentStyle}
      ListFooterComponent={<View style={{paddingBottom: 12}} />}
      renderItemSeparator={() => (
        <ViewSpacing height={theme.spacing?.margin.base} />
      )}
    />
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    listStyle: {
      backgroundColor: colors.bgDisable,
    },
    listHeaderComponentStyle: {
      marginTop: spacing?.margin.base,
    },
  });
};

export default GroupContent;
