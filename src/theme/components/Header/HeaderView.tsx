import React from 'react';
import {View, StyleSheet, TextStyle, StyleProp, ViewStyle} from 'react-native';
import HorizontalView from '../Layout/HorizontalView';
import Text from '../Text/';
import Avatar from '../Image/Avatar';
import Icon from '../Icon';
import {IconProps} from '../Icon';
import {margin, padding} from '~/theme/configs/spacing';
import {IObject} from '~/interfaces/common';
import * as RootNavigation from '~/utils/refNavigator';
import {homeStack} from '~/configs/navigator';

export interface Props {
  style?: StyleProp<ViewStyle>;
  infoStyle?: StyleProp<TextStyle>;
  firstLabel?: string;
  secondLabel?: string;
  thirdLabel?: string;
  avatar?: IObject<any>;
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
  icon,
  space = 2,
  renderCustom,
  showBackButton,
}) => {
  return (
    <HorizontalView style={[styles.container, style]}>
      {showBackButton && (
        <Icon
          style={styles.iconBack}
          icon="iconBack"
          size={18}
          onPress={() => RootNavigation.navigate(homeStack.home)}
        />
      )}

      <HorizontalView>
        <Avatar size={50} {...avatar} />

        <View style={[styles.userInfo, infoStyle]}>
          <HorizontalView
            style={[styles.firstContainer, {marginBottom: space}]}>
            <Text maxBold medium>
              {firstLabel}
            </Text>
            {icon && <Icon style={styles.icon} {...icon} />}
          </HorizontalView>
          {secondLabel && (
            <>
              <Text style={{marginBottom: space}} h6>
                {secondLabel}
              </Text>
            </>
          )}
          {thirdLabel && (
            <Text style={{marginBottom: space}} h6>
              {thirdLabel}
            </Text>
          )}
          {renderCustom && renderCustom()}
        </View>
      </HorizontalView>
    </HorizontalView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: padding.large,
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
    marginStart: margin.large,
    padding: 6,
  },
  avatar: {
    marginStart: margin.large,
  },
  avatarWithIcon: {
    marginStart: 4,
  },
});

export default React.memo(HeaderView);
