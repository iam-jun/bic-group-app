/* eslint-disable no-shadow */
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  StyleSheet,
  View,
  Platform,
  TextStyle,
  ViewStyle,
  StyleProp,
} from 'react-native';

import Text from '~/components/texts/Text';

import spacing, {padding} from '~/theme/spacing';
import Icon from '../../beinComponents/Icon';
import icons, {IconType} from '~/resources/icons';
import {IObject} from '~/interfaces/common';
import {useTheme} from 'react-native-paper';

export interface Props {
  title?: string;
  isDefault?: boolean;
  isFullView?: boolean;
  titleStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  leftPress?: () => void;
  leftIcon?: IconType;
  rightPress?: () => void;
  rightIcon?: IconType;
  middleComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
}

const NavigationHeader: React.FC<Props> = ({
  title,
  titleStyle,
  containerStyle,
  leftIcon,
  leftPress,
  rightIcon,
  rightPress,
  middleComponent,
  rightComponent,
  leftComponent,
  isDefault,
  isFullView,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const theme: IObject<any> = useTheme();

  const heightSafeArea = (insets: any) => ({
    height: Platform.OS === 'android' ? 48 + insets.top : 40 + insets.top,
  });
  const _goBack = () => {
    navigation.goBack();
  };
  const styles = themeStyles(theme, title);
  return (
    <View
      style={StyleSheet.flatten([
        heightSafeArea(insets),
        styles.container,
        containerStyle,
        isFullView && {paddingHorizontal: padding.large},
      ])}>
      {isDefault ? (
        isDefault ? (
          <Icon
            onPress={isDefault ? _goBack : leftPress}
            style={isDefault ? styles.backStyle : {}}
            size={20}
            icon="iconBack"
          />
        ) : leftIcon ? (
          <Icon size={20} icon={leftIcon} onPress={leftPress} />
        ) : null
      ) : leftComponent ? (
        leftComponent
      ) : null}
      {title ? (
        <Text h4 bold style={isDefault ? styles.titleStyle : titleStyle}>
          {title}
        </Text>
      ) : middleComponent ? (
        middleComponent
      ) : null}
      {rightIcon ? (
        <Icon size={20} icon={rightIcon} onPress={rightPress} />
      ) : rightComponent ? (
        rightComponent
      ) : isDefault ? (
        <Text style={styles.emptyRightStyle} />
      ) : null}
    </View>
  );
};

const themeStyles = (theme: IObject<any>, title: string | undefined) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      alignItems: 'flex-end',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.small,
      backgroundColor: theme.colors.bgColor,
      borderBottomColor: theme.colors.border,
      borderBottomWidth: 1,
    },
    backStyle: {
      paddingLeft: 0,
    },
    titleStyle: {
      fontSize: 16,
    },
    emptyRightStyle: {
      width: 32,
    },
  });

NavigationHeader.defaultProps = {
  leftPress: () => {},
  rightPress: () => {},
  containerStyle: {},
  titleStyle: {},
  middleComponent: null,
  rightComponent: null,
  leftComponent: null,
  isDefault: false,
  isFullView: false,
};

export default NavigationHeader;
