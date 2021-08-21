import React, {useEffect, useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import ListView from '~/beinComponents/list/ListView';
import PostItem from '~/beinComponents/list/items/PostItem';
import ViewSpacing from '~/beinComponents/ViewSpacing';

import HeaderCreatePost from '~/screens/Home/Newsfeed/components/HeaderCreatePost';
import {ITheme} from '~/theme/interfaces';
import useGroups from '~/hooks/groups';
import groupsActions from '~/screens/Groups/redux/actions';
import {AppContext} from '~/contexts/AppContext';
import {useUserIdAuth} from '~/hooks/auth';

const GroupContent = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const groupData = useGroups();
  const {loadingGroupPosts, groupPosts, groupDetail} = groupData;
  const {id: groupId} = groupDetail?.group;
  const dispatch = useDispatch();

  const {streamClient} = useContext(AppContext);
  const userId = useUserIdAuth();

  const renderItem = ({item}: any) => {
    return <PostItem postData={item} />;
  };

  const getGroupPosts = () => {
    if (streamClient) {
      dispatch(groupsActions.getGroupPosts({streamClient, userId, groupId}));
    }
  };

  useEffect(() => {
    getGroupPosts();
  }, []);

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
