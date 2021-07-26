import React from 'react';
import {View, StyleSheet, TextStyle, StyleProp, ViewStyle} from 'react-native';
import HorizontalView from './layout/HorizontalView';
import Text from './texts/Text';
import Avatar, {AvatarProps} from './Avatar';
import Icon from '../beinComponents/Icon';
import {IconProps} from '../beinComponents/Icon';
import {margin, padding} from '~/theme/spacing';
import {IObject} from '~/interfaces/common';
import {homeStack} from '~/configs/navigator';
import {useTheme} from 'react-native-paper';
import {formatDate} from '~/utils/formatData';
import {rootNavigationRef} from '~/router/navigator/refs';

export interface Props {
  style?: StyleProp<ViewStyle>;
  infoStyle?: StyleProp<ViewStyle>;
  firstLabel?: string;
  secondLabel?: string;
  thirdLabel?: string;
  firstLabelStyle?: StyleProp<TextStyle>;
  secondLabelStyle?: StyleProp<TextStyle>;
  thirdLabelStyle?: StyleProp<TextStyle>;
  avatar?: AvatarProps;
  icon?: IconProps;
  space?: number;
  renderCustom?: () => void;
  showBackButton?: boolean;
}

const HeaderView: React.FC<Props> = ({
  style,
  infoStyle,
  avatar,
  firstLabel,
  secondLabel,
  thirdLabel,
  firstLabelStyle,
  secondLabelStyle,
  thirdLabelStyle,
  icon,
  space = 2,
  renderCustom,
  showBackButton,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <HorizontalView style={[styles.container, style]}>
      {showBackButton && (
        <Icon
          style={styles.iconBack}
          icon="iconBack"
          size={18}
          onPress={() =>
            rootNavigationRef?.current?.canGoBack &&
            rootNavigationRef?.current?.goBack()
          }
        />
      )}
      <HorizontalView style={{alignItems: 'center'}}>
        <Avatar
          size="base"
          {...avatar}
          style={!showBackButton && styles.avatar}
        />
        <View style={[styles.userInfo, infoStyle]}>
          <HorizontalView
            style={[styles.firstContainer, {marginBottom: space}]}>
            <Text style={firstLabelStyle} bold medium>
              {firstLabel}
            </Text>
            {icon && <Icon style={styles.icon} {...icon} />}
          </HorizontalView>
          {!!secondLabel && (
            <>
              <Text
                style={[styles.label, secondLabelStyle, {marginBottom: space}]}
                h6>
                {formatDate(secondLabel, 'll', 3) || secondLabel}
              </Text>
            </>
          )}
          {!!thirdLabel && (
            <Text
              style={[styles.label, thirdLabelStyle, {marginBottom: space}]}
              h6>
              {thirdLabel}
            </Text>
          )}
          {renderCustom && renderCustom()}
        </View>
      </HorizontalView>
    </HorizontalView>
  );
};

const createStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      // paddingTop: padding.large,
      alignItems: 'flex-start',
      flexShrink: 1,
    },
    userInfo: {
      marginStart: margin.small,
      flexShrink: 1,
    },
    firstContainer: {},
    icon: {
      marginStart: 4,
    },
    iconBack: {
      marginStart: margin.base,
      padding: 6,
    },
    avatar: {
      // marginStart: margin.large,
    },
    avatarWithIcon: {
      marginStart: 4,
    },
    label: {
      color: colors?.ViewLabel.color,
    },
  });
};

export default React.memo(HeaderView);
