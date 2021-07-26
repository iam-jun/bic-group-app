import React from 'react';
import {View, StyleSheet} from 'react-native';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';

const PostDetail = () => {
  const theme: ITheme = useTheme();
  const styles = createStyle(theme);

  return (
    <ScreenWrapper>
      <Header subTitle={'Post detail'} />
      <Text>Creating new component PostDetail</Text>
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
  });
};

export default PostDetail;
