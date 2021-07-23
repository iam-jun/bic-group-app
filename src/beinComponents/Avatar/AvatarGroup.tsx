import React from 'react';
import {StyleSheet, StyleProp, View, ViewStyle} from 'react-native';
import AvatarComponent, {
  AvatarProps,
  AvatarType,
} from '~/beinComponents/Avatar/AvatarComponent';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import Image from '~/beinComponents/Image';
import Text from '~/beinComponents/Text';
import {fontFamilies} from '~/theme/fonts';

export interface AvatarGroupProps extends AvatarProps {
  variant?: AvatarType;
  style?: StyleProp<ViewStyle>;
  source?: any;
  totalMember?: number;
  listSource?: string[];
}

const AvatarGroup = ({
  variant = 'medium',
  style,
  source,
  totalMember,
  listSource,
  ...props
}: AvatarGroupProps) => {
  const theme: ITheme = useTheme();
  const {colors, spacing, dimension} = theme;

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

  if (source) {
    return (
      <AvatarComponent
        variant={variant}
        style={style}
        source={source}
        {...props}
      />
    );
  }

  const renderItem = (
    index: number,
    source?: string,
    style?: StyleProp<ViewStyle>,
  ) => {
    return (
      <View
        style={StyleSheet.flatten([
          {
            width: itemContainerSize,
            height: itemContainerSize,
            borderWidth: border,
            borderColor: colors.background,
            borderRadius: spacing?.borderRadius.small,
            backgroundColor: colors.background,
            overflow: 'hidden',
          },
          style,
        ])}>
        <Image
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
    switch (listSource?.length) {
      case 1:
        return renderItem(0, listSource?.[0]);
      case 2:
        return (
          <View style={{flexDirection: 'row'}}>
            {renderItem(0, listSource?.[0])}
            {renderItem(1, listSource?.[1], {marginLeft: -6})}
          </View>
        );
      case 3:
        return (
          <View>
            <View style={{flexDirection: 'row'}}>
              {renderItem(0, listSource?.[0])}
              {renderItem(1, listSource?.[1], {marginLeft: -6})}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: -8,
              }}>
              {renderItem(2, listSource?.[2])}
            </View>
          </View>
        );
      case 4:
        return (
          <View>
            <View style={{flexDirection: 'row'}}>
              {renderItem(0, listSource?.[0])}
              {renderItem(1, listSource?.[1], {marginLeft: -6})}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: -8,
              }}>
              {renderItem(2, listSource?.[2])}
              {renderItem(3, listSource?.[3], {marginLeft: -6})}
            </View>
          </View>
        );
      default:
        return (
          <View>
            <View style={{flexDirection: 'row'}}>
              {renderItem(0, listSource?.[0])}
              {renderItem(1, listSource?.[1], {marginLeft: -6})}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: -8,
              }}>
              {renderItem(2, listSource?.[2])}
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
                    style={{
                      fontFamily: fontFamilies.Poppins,
                      marginTop: 2,
                      fontSize: totalMemberFontSize,
                    }}>
                    {`+${Math.min(99, totalMember)}`}
                  </Text>
                ) : (
                  renderItem(3, listSource?.[3])
                )}
              </View>
            </View>
          </View>
        );
    }
  };

  return (
    <View
      style={StyleSheet.flatten([
        {
          width: containerSize,
          height: containerSize,
          backgroundColor: colors.primary1,
          borderRadius: spacing?.borderRadius.small,
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
