import React from 'react';
import {View, StyleSheet, TextStyle, StyleProp, ViewStyle} from 'react-native';
import HorizontalView from '../Layout/HorizontalView';
import TextContent from '../Text/';
import Avatar from '../Image/Avatar';
import Icon from '../Icon';
import {IconProps} from '../Icon';

export const SPACE_BASE = 16;
export const SPACE_TINY = 8;

export interface Props {
  style?: StyleProp<ViewStyle>;
  infoStyle?: StyleProp<TextStyle>;
  firstLabel?: string;
  secondLabel?: string;
  thirdLabel?: string;
  avatar?: object;
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
          onPress={() => {}}
        />
      )}

      <HorizontalView>
        <Avatar size={50} {...avatar} />

        <View style={[styles.userInfo, infoStyle]}>
          <HorizontalView
            style={[styles.firstContainer, {marginBottom: space}]}>
            <TextContent maxBold medium>
              {firstLabel}
            </TextContent>
            {icon && <Icon style={styles.icon} {...icon} />}
          </HorizontalView>
          {secondLabel && (
            <>
              <TextContent style={{marginBottom: space}} h6>
                {secondLabel}
              </TextContent>
            </>
          )}
          {thirdLabel && (
            <TextContent style={{marginBottom: space}} h6>
              {thirdLabel}
            </TextContent>
          )}
          {renderCustom && renderCustom()}
        </View>
      </HorizontalView>
    </HorizontalView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: SPACE_BASE,
    alignItems: 'flex-start',
    flexShrink: 1,
  },
  userInfo: {
    marginStart: SPACE_TINY,
    flexShrink: 1,
  },
  firstContainer: {},
  icon: {
    marginStart: 4,
  },
  iconBack: {
    marginStart: SPACE_BASE,
    padding: 6,
  },
  avatar: {
    marginStart: SPACE_BASE,
  },
  avatarWithIcon: {
    marginStart: 4,
  },
});

export default React.memo(HeaderView);
