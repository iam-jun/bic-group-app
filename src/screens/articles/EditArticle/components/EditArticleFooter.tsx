import React from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import Button from '~/baseComponents/Button';
import Icon from '~/baseComponents/Icon';
import { IconType } from '~/resources/icons';
import modalActions from '~/storeRedux/modal/actions';

import spacing, { borderRadius } from '~/theme/spacing';

const EditArticleFooter = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const dispatch = useDispatch();

  const onPress = () => {
    dispatch(modalActions.showAlertNewFeature());
  };

  const renderButton = (icon: IconType, onPress: any) => (
    <Button style={styles.button}>
      <Icon size={24} icon={icon} onPress={onPress} />
    </Button>
  );

  return (
    <View style={styles.container}>
      <View style={styles.centerLine} />
      <View style={styles.buttonContainer}>
        {renderButton('Users', onPress)}
        {renderButton('ImageLandscape', onPress)}
        {renderButton('InputText', onPress)}
        {renderButton('ChartTreeMap', onPress)}
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const insets = useSafeAreaInsets();
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      borderTopWidth: 1,
      borderRightWidth: 1,
      borderLeftWidth: 1,
      borderColor: colors.neutral5,
      paddingTop: spacing.padding.base,
      paddingBottom: insets.bottom,
      borderTopRightRadius: borderRadius.extraLarge,
      borderTopLeftRadius: borderRadius.extraLarge,
      width: '100%',
    },
    centerLine: {
      position: 'absolute',
      top: spacing.margin.tiny,
      alignSelf: 'center',
      width: 40,
      height: 3,
      borderRadius: borderRadius.small,
      backgroundColor: colors.gray20,
    },
    buttonContainer: {
      flexDirection: 'row',
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
    },
    button: {
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default EditArticleFooter;
