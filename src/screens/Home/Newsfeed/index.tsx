import React from 'react';
import {View} from 'react-native';

import ListView from '~/beinComponents/list/ListView';

import {ScreenWrapper, ViewSpacing} from '~/components';
import {spacing} from '~/theme';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';
import Header from '~/beinComponents/Header';
import images from '~/resources/images';
import HeaderCreatePost from '~/screens/Home/Newsfeed/components/HeaderCreatePost';
import {data} from './dummy-data';
import PostItem from '~/beinComponents/list/items/PostItem';

const Newsfeed = () => {
  const theme: ITheme = useTheme();
  const styles = createStyle(theme);

  const renderItem = ({item}: any) => {
    return <PostItem postData={item} />;
  };

  // const {streamClient} = useContext(AppContext);
  // dispatch(createAction(ActionTypes.GetStreamSample, {streamClient}));
  return (
    <ScreenWrapper isFullView>
      <Header
        avatar={images.logo_bein}
        hideBack
        title={'post:news_feed'}
        titleTextProps={{useI18n: true}}
        icon={images.logo_bein}
      />
      <ListView
        isFullView
        style={styles.container}
        data={data}
        renderItem={renderItem}
        ListHeaderComponent={() => <HeaderCreatePost />}
        ListFooterComponent={<View style={{paddingBottom: 30}} />}
        renderItemSeparator={() => <ViewSpacing height={spacing.margin.base} />}
      />
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      paddingTop: spacing.padding.base,
      backgroundColor: colors.bgDisable,
    },
  });
};

export default Newsfeed;
