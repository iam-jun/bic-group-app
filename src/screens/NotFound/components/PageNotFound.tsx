import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import Button from '~/baseComponents/Button';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import Image from '~/components/Image';
import images from '~/resources/images';
import dimension from '~/theme/dimension';

type PageNotFoundProps = {
  testID?: string;
  onGoBack?: () => void;
};

const PageNotFound: FC<PageNotFoundProps> = ({ testID, onGoBack }) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { t } = useBaseHook();
  const { goHome } = useRootNavigation();

  const onPress = () => {
    onGoBack?.();
    goHome();
  };

  return (
    <View testID={testID} style={styles.container}>
      <Image resizeMode="contain" style={styles.imgEmpty} source={images.img_empty_search_post} />
      <Text.H3 useI18n style={styles.title}>
        common:page_not_found:title
      </Text.H3>
      <Text.BodyS useI18n style={styles.description}>
        common:page_not_found:description
      </Text.BodyS>
      <Button.Primary style={styles.button} onPress={onPress}>
        {t('common:btn_go_back_to_home')}
      </Button.Primary>
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      paddingTop: dimension.deviceHeight / 3,
      alignItems: 'center',
      backgroundColor: colors.white,
      flex: 1,
    },
    title: {
      marginTop: spacing.margin.large,
    },
    description: {
      marginTop: spacing.margin.tiny,
      paddingHorizontal: spacing.padding.large * 4,
      textAlign: 'center',
    },
    button: {
      marginTop: spacing.margin.large,
    },
    imgEmpty: {
      width: 100,
      height: 83.2,
    },
  });
};

export default PageNotFound;
