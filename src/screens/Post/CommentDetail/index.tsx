import React, {useState, useEffect, useCallback} from 'react';
import {InteractionManager, View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {ITheme} from '~/theme/interfaces';
import Header from '~/beinComponents/Header';
import CommentDetailContent from './CommentDetailContent';

const CommentDetail = (props: any) => {
  const theme = useTheme() as ITheme;
  const {colors} = theme;

  return (
    <ScreenWrapper isFullView backgroundColor={colors.background}>
      <Header titleTextProps={{useI18n: true}} title={'post:label_comment'} />
      <CommentDetailContent {...props} />
    </ScreenWrapper>
  );
};

export default CommentDetail;
