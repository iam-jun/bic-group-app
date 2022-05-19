import React from 'react';
import {View, StyleSheet, ScrollView, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import ButtonWrapper from './Button/ButtonWrapper';
import Icon from './Icon';
import Text from './Text';

export interface FilterProps {
  testID?: string;
  itemTestID?: string;
  style?: StyleProp<ViewStyle>;
  data?: {id: number; text: string; icon?: string; type: string}[];
  selectedIndex?: number;
  onPress: (item: any, index: number) => void;
}

const Filter = ({
  testID,
  style,
  data = [],
  selectedIndex,
  itemTestID,
  onPress,
}: FilterProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const renderReactItem = (item: any, index: number) => {
    const isSelected = index === selectedIndex;
    return (
      <View
        style={styles.itemView}
        key={`${itemTestID || 'item_filter'}_${item?.text}`}>
        <ButtonWrapper
          contentStyle={[
            styles.itemContainer,
            isSelected ? styles.itemSelectedContainer : {},
          ]}
          testID={`${itemTestID || 'item_filter'}_${item.id}`}
          onPress={() => {
            onPress(item, index);
          }}>
          {!!item?.icon && (
            <Icon
              icon={item.icon}
              size={24}
              tintColor={
                isSelected ? theme.colors.primary : theme.colors.iconTintLight
              }
              style={styles.icon}
            />
          )}
          <Text variant={isSelected ? 'bodyM' : 'body'} useI18n>
            {item.text}
          </Text>
        </ButtonWrapper>
      </View>
    );
  };
  return (
    <View testID={testID || 'filter'} style={[styles.container, style]}>
      <ScrollView
        horizontal
        style={{backgroundColor: theme.colors.background}}
        showsHorizontalScrollIndicator={false}
        alwaysBounceHorizontal={false}>
        {data?.map?.(renderReactItem)}
      </ScrollView>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    container: {
      paddingVertical: spacing.padding.base,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.placeholder,
    },
    itemView: {
      padding: 0,
      margin: 0,
      marginLeft: spacing.margin.small,
    },
    itemContainer: {
      backgroundColor: colors.background,
      flexDirection: 'row',
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
      borderRadius: 100,
      borderWidth: 1,
      borderColor: colors.borderDivider,
    },
    itemSelectedContainer: {
      borderColor: colors.borderFocus,
      backgroundColor: colors.borderFocus,
    },
    iconLeftStyle: {marginRight: spacing.margin.base},
    icon: {
      marginRight: spacing.margin.small,
    },
  });
};

export default Filter;
