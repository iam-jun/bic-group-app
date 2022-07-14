import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';

import Text from '~/beinComponents/Text';
import NoSearchResultImg from '~/../assets/images/no_search_result_grey.svg';
import SvgIcon from '~/beinComponents/Icon/SvgIcon';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';

export interface NoSearchResultProps {
  title?: string;
}

const NoSearchResult: FC<NoSearchResultProps> = ({
  title,
}: NoSearchResultProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  return (
    <View style={styles.container}>
      {/* @ts-ignore */}
      <SvgIcon source={NoSearchResultImg} width={250} height={200} />
      <Text.BodyM style={styles.text} useI18n>
        {title || 'common:text_search_no_results'}
      </Text.BodyM>
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors} = theme;

  return StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      marginHorizontal: 55,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });
};

export default NoSearchResult;
