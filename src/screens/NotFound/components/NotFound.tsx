import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import NoContent from '~/../assets/images/no_content.svg';
import SVGIcon from '~/baseComponents/Icon/SvgIcon';
import Text from '~/beinComponents/Text';
import { spacing } from '~/theme';
import Button from '~/baseComponents/Button';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';

type NotFoundProps = {
    testID?: string;
    onGoBack?: () => void;
}

const NotFound: FC<NotFoundProps> = ({ testID, onGoBack }) => {
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
      <SVGIcon source={NoContent} size={100} />
      <Text.BodyMMedium useI18n style={styles.textContentNotAvailable}>common:content_not_available</Text.BodyMMedium>
      <Text.BodyS useI18n>common:dont_have_permission_to_access</Text.BodyS>
      <Button.Primary
        style={styles.button}
        onPress={onPress}
      >
        {t('common:btn_go_back_to_home')}
      </Button.Primary>
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    container: {
      paddingTop: insets.top + 80,
      alignItems: 'center',
      backgroundColor: colors.white,
      flex: 1,
    },
    textContentNotAvailable: {
      marginTop: spacing.margin.large,
    },
    button: {
      marginTop: spacing.margin.large,
    },
  });
};

export default NotFound;
