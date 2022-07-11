import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import AvatarComponent, {
  AvatarProps,
  AvatarType,
} from '~/beinComponents/Avatar/AvatarComponent';
import Image from '~/beinComponents/Image';
import Text from '~/beinComponents/Text';
import images from '~/resources/images';
import dimension from '~/theme/dimension';
import {fontFamilies} from '~/theme/fonts';
import {ITheme} from '~/theme/interfaces';
import spacing from '~/theme/spacing';

export interface AvatarGroupProps extends AvatarProps {
  variant?: AvatarType;
  style?: StyleProp<ViewStyle>;
  source?: any;
  totalMember?: number;
}

const AvatarGroup = ({
  variant = 'medium',
  style,
  source,
  totalMember,
  ...props
}: AvatarGroupProps) => {
  const theme = useTheme() as ITheme;
  const {colors} = theme;

  const containerSize = dimension?.avatarSizes?.[variant] || 36;
  const border = 2;
  const itemContainerSize = (containerSize + border * 2) / 2;
  const itemSize = (containerSize - border * 2) / 2;

  const totalMemberFontSizes: {[x: string]: any} = {
    small: 6,
    medium: 8,
    large: 10,
    ultraLarge: 14,
  };
  const totalMemberFontSize = totalMemberFontSizes[variant] || 8;

  const renderItem = (
    index: number,
    source?: string,
    style?: StyleProp<ViewStyle>,
  ) => {
    return (
      <View
        testID={`avatar_group.item_${index}`}
        style={StyleSheet.flatten([
          {
            width: itemContainerSize,
            height: itemContainerSize,
            borderWidth: border,
            borderColor: colors.background,
            borderRadius: spacing.borderRadius.small,
            backgroundColor: colors.background,
            overflow: 'hidden',
          },
          style,
        ])}>
        <Image
          {...props}
          style={{
            width: itemSize,
            height: itemSize,
            backgroundColor: colors.primary1,
          }}
          source={source}
        />
      </View>
    );
  };

  const renderItems = () => {
    if (!Array.isArray(source))
      return (
        <AvatarComponent
          {...props}
          source={source}
          placeholderSource={images.img_group_avatar_default}
        />
      );

    switch (source?.length) {
      case 1:
        return renderItem(0, source?.[0]);
      case 2:
        return (
          <View testID="avatar_group.group_2" style={{flexDirection: 'row'}}>
            {renderItem(0, source?.[0])}
            {renderItem(1, source?.[1], {marginLeft: -6})}
          </View>
        );
      case 3:
        return (
          <View testID="avatar_group.group_3">
            <View style={{flexDirection: 'row'}}>
              {renderItem(0, source?.[0])}
              {renderItem(1, source?.[1], {marginLeft: -6})}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: -8,
              }}>
              {renderItem(2, source?.[2])}
            </View>
          </View>
        );
      case 4:
        return (
          <View testID="avatar_group.group_4">
            <View style={{flexDirection: 'row'}}>
              {renderItem(0, source?.[0])}
              {renderItem(1, source?.[1], {marginLeft: -6})}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: -8,
              }}>
              {renderItem(2, source?.[2])}
              {renderItem(3, source?.[3], {marginLeft: -6})}
            </View>
          </View>
        );
      default:
        return (
          <View testID="avatar_group.group_4_plus">
            <View style={{flexDirection: 'row'}}>
              {renderItem(0, source?.[0])}
              {renderItem(1, source?.[1], {marginLeft: -6})}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: -8,
              }}>
              {renderItem(2, source?.[2])}
              <View
                style={{
                  width: itemContainerSize,
                  height: itemContainerSize,
                  backgroundColor: colors.background,
                  borderRadius: 6,
                  marginLeft: -6,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {totalMember ? (
                  <Text
                    testID="avatar_group.total_member"
                    style={{
                      fontFamily: fontFamilies.OpenSans,
                      marginTop: 2,
                      fontSize: totalMemberFontSize,
                    }}>
                    {`+${Math.min(99, totalMember)}`}
                  </Text>
                ) : (
                  renderItem(3, source?.[3])
                )}
              </View>
            </View>
          </View>
        );
    }
  };

  return (
    <View
      testID="avatar_group"
      style={StyleSheet.flatten([
        {
          width: containerSize,
          height: containerSize,
          backgroundColor: colors.primary1,
          borderRadius: spacing.borderRadius.small,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 1,
        },
        style,
      ])}>
      {renderItems()}
    </View>
  );
};

export default AvatarGroup;
