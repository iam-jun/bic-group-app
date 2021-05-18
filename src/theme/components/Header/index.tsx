/* eslint-disable no-shadow */
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  TextStyle,
  ViewStyle,
  StyleProp,
} from 'react-native';

import Text from '~/theme/components/Text';

import spacing, {padding} from '~/theme/configs/spacing';
import Icon from '../Icon';
import icons from '~/constants/icons';

export interface Props {
  title?: string;
  isDefault?: boolean;
  isFullView?: boolean;
  titleStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  leftPress?: () => void;
  leftIcon?: React.ReactNode;
  rightPress?: () => void;
  rightIcon?: React.ReactNode;
  middleComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
}

const Header: React.FC<Props> = ({
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

  // const heightSafeArea = (insets: any) => ({
  //   height: Platform.OS === 'android' ? 78 + insets.top : 44 + insets.top,
  // });
  const _goBack = () => {
    navigation.goBack();
  };
  const styles = themeStyles(title);
  return (
    <View
      style={StyleSheet.flatten([
        // heightSafeArea(insets),
        styles.container,
        containerStyle,
        isFullView && {paddingHorizontal: padding.large},
      ])}>
      {leftIcon || isDefault ? (
        isDefault ? (
          <Icon
            onPress={isDefault ? _goBack : leftPress}
            style={isDefault ? styles.backStyle : {}}
            icon={icons.iconBack}
          />
        ) : (
          leftIcon
        )
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
        <TouchableOpacity onPress={rightPress}>{rightIcon}</TouchableOpacity>
      ) : rightComponent ? (
        rightComponent
      ) : isDefault ? (
        <Text style={styles.emptyRightStyle} />
      ) : null}
    </View>
  );
};

const themeStyles = (title: string | undefined) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: spacing.padding.small,
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

Header.defaultProps = {
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

export default Header;
