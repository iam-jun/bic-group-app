import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {ITheme} from '~/theme/interfaces';
import {useRootNavigation} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';

const DraftPost = () => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  //get draft post called from MainTabs
  const draftPosts = useKeySelector(postKeySelector.draftPosts) || [];
  const canLoadMore = useKeySelector(postKeySelector.draftCanLoadMore);

  console.log(`\x1b[35m🐣️ index DraftPost `, draftPosts, `\x1b[0m`);

  return (
    <ScreenWrapper isFullView backgroundColor={colors.background}>
      <Header
        titleTextProps={{useI18n: true}}
        title={'home:draft_post'}
        hideBackOnLaptop
      />
      <View>
        <Text>List Draft Posts will show here!</Text>
      </View>
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
  });
};

export default DraftPost;
