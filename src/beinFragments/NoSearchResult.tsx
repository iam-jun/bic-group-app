import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/beinComponents/Text';
import NoSearchResultImg from '~/../assets/images/no_search_result_grey.svg';
import SvgIcon from '~/beinComponents/Icon/SvgIcon';

export interface NoSearchResultProps {
  title?: string;
}

const NoSearchResult: FC<NoSearchResultProps> = ({
  title,
}: NoSearchResultProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  return (
    <View style={styles.container}>
      <SvgIcon source={NoSearchResultImg} width={250} height={200} />
      <Text.BodyM style={styles.text} useI18n>
        {title || 'common:text_search_no_results'}
      </Text.BodyM>
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      marginHorizontal: 55,
      color: colors.gray50,
      textAlign: 'center',
    },
  });
};

export default NoSearchResult;
