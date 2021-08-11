import React, {useEffect, useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import ListView from '~/beinComponents/list/ListView';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Header from '~/beinComponents/Header';
import PostItem from '~/beinComponents/list/items/PostItem';
import {ITheme} from '~/theme/interfaces';
import images from '~/resources/images';
import HeaderCreatePost from '~/screens/Home/Newsfeed/components/HeaderCreatePost';
import useHome from '~/hooks/home';
import {AppContext} from '~/contexts/AppContext';
import homeActions from '~/screens/Home/redux/actions';
import {useUserIdAuth} from '~/hooks/auth';
import menuActions from '~/screens/Menu/redux/actions';
import postActions from '~/screens/Post/redux/actions';

const Newsfeed = () => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);
  const homePostsData = useHome();
  const {loadingHomePosts, homePosts} = homePostsData;
  const dispatch = useDispatch();
  const {streamClient} = useContext(AppContext);

  const userId = useUserIdAuth();

  const renderItem = ({item}: any) => {
    return <PostItem postData={item} />;
  };

  const getData = () => {
    if (streamClient) {
      dispatch(
        homeActions.getHomePosts({
          streamClient,
          userId: userId.toString(),
        }),
      );
    }
  };

  useEffect(() => {
    getData();
  }, [streamClient]);

  useEffect(() => {
    dispatch(postActions.addToAllPosts(homePosts));
  }, [homePosts]);

  return (
    <View style={styles.container}>
      <Header
        avatar={images.logo_bein}
        hideBack
        title={'post:news_feed'}
        titleTextProps={{useI18n: true}}
        icon={images.logo_bein}
        onPressMenu={getData}
        menuIcon={'Sync'}
      />
      <ListView
        isFullView
        style={styles.listStyle}
        data={homePosts}
        loading={loadingHomePosts}
        renderItem={renderItem}
        ListHeaderComponent={() => <HeaderCreatePost />}
        ListFooterComponent={<View style={{paddingBottom: 30}} />}
        renderItemSeparator={() => (
          <ViewSpacing height={theme.spacing?.margin.base} />
        )}
      />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    listStyle: {
      paddingTop: spacing?.padding.base,
      backgroundColor: colors.bgDisable,
    },
  });
};

export default Newsfeed;
