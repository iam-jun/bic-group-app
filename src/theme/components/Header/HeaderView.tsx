import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import HorizontalView from '../Layout/HorizontalView';
import TextContent from '../Text/TextContent';
import Avatar from '../Image/oldAvatar';
import Icon from '../Icon/Icon';

export const SPACE_BASE = 16;
export const SPACE_TINY = 8;

export interface Props {
  style?: any;
  infoStyle?: any;
  avatar?: any;
  firstLabel?: any;
  secondLabel?: any;
  thirdLabel?: any;
  icon?: any;
  firstLabelColor?: any;
  secondLabelColor?: any;
  thirdLabelColor?: any;
  firstLabelSize?: any;
  secondLabelSize?: any;
  thirdLabelSize?: any;
  space?: any;
  renderCustom?: any;
  showBackButton?: any;
}

const HeaderView: React.FC<Props> = ({
  style,
  infoStyle,
  avatar,
  firstLabel,
  secondLabel,
  thirdLabel,
  icon,
  firstLabelColor,
  secondLabelColor,
  thirdLabelColor,
  firstLabelSize = 'medium',
  secondLabelSize = 'medium',
  thirdLabelSize = 'medium',
  space = 4,
  renderCustom,
  showBackButton,
}) => {
  return (
    <HorizontalView style={[styles.container, style]}>
      {showBackButton && (
        <Icon
          style={styles.iconBack}
          icon="ICON_BACK"
          size={18}
          onPress={() => {}}
        />
      )}
      <HorizontalView>
        <Avatar
          containerStyle={[
            styles.avatar,
            showBackButton && styles.avatarWithIcon,
          ]}
          {...avatar}
        />

        <View style={[styles.userInfo, infoStyle]}>
          <HorizontalView
            style={[styles.firstContainer, {marginBottom: space}]}>
            <TextContent
              inline={true}
              weight="bold"
              size={firstLabelSize}
              numberOfLines={2}>
              {firstLabel}
            </TextContent>
            {icon && <Icon style={styles.icon} {...icon} />}
          </HorizontalView>
          {secondLabel && (
            <TextContent
              style={{marginBottom: space}}
              size={secondLabelSize}
              color={secondLabelColor}>
              {secondLabel}
            </TextContent>
          )}
          {thirdLabel && (
            <TextContent
              style={{marginBottom: space}}
              size={thirdLabelSize}
              color={thirdLabelColor}>
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
