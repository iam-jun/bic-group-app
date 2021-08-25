import React from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import SVGIcon from '~/beinComponents/Icon/SvgIcon';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';
import {useBaseHook} from '~/hooks';
import {ITheme} from '~/theme/interfaces';
import NotFoundImg from '../../../assets/images/404_Colored.svg';

const NotFound = () => {
  const theme: ITheme = useTheme() as ITheme;
  const {t} = useBaseHook();
  const styles = createStyle(theme);
  const dimensions = useWindowDimensions();

  const imgMaxWidth = 328;
  const imgPadding = theme.spacing.margin.base || 12;
  let imgSize = dimensions.width - 2 * imgPadding;
  if (imgSize > imgMaxWidth) imgSize = imgMaxWidth;

  /*
  TODO: Handle pressing go back.
    - If signed in, go to home page.
    - Otherwise, go to landing page
  */
  return (
    <ScreenWrapper isFullView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* @ts-ignore */}
        <SVGIcon source={NotFoundImg} size={imgSize} />
        <Text.Body style={styles.desc}>{t('error:not_found_desc')}</Text.Body>
        {/*<Button.Secondary*/}
        {/*  style={styles.button}*/}
        {/*  color={theme.colors.primary7}*/}
        {/*  textColor={theme.colors.background}*/}
        {/*  onPress={() => console.log('Pressed "Go back"')}*/}
        {/*  textVariant="h6">*/}
        {/*  {t('error:button_not_found')}*/}
        {/*</Button.Secondary>*/}
      </View>
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    contentContainer: {
      maxWidth: 328,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    desc: {
      marginVertical: spacing.margin.base,
      textAlign: 'center',
    },
    button: {
      padding: spacing.margin.base,
      paddingTop: spacing.margin.small,
    },
  });
};

export default NotFound;
