import React from 'react';
import {View, StyleSheet, ScrollView, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Icon from '~/beinComponents/Icon';
import Text from '~/beinComponents/Text';
import {IconType} from '~/resources/icons';

const communityMenuData = [
  {
    id: 1,
    text: 'communities:community_menu:your_communities_text',
    type: 'COMMUNITIES',
  },
  {
    id: 2,
    text: 'communities:community_menu:manage_text',
    type: 'MANAGE',
  },
  {
    id: 3,
    text: 'communities:community_menu:discover_text',
    type: 'DISCOVER',
  },
];

export interface CommunityMenuProps {
  style?: StyleProp<ViewStyle>;
  data?: {id: number; text: string; icon?: string; type: string}[];
  selectedIndex?: number;
  onPress: (item: any, index: number) => void;
}

const CommunityMenu = ({
  style,
  data = communityMenuData,
  selectedIndex,
  onPress,
}: CommunityMenuProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const renderReactItem = (item: any, index: number) => {
    const isSelected = index === selectedIndex;
    return (
      <View style={styles.itemView} key={`item_community_data_${item?.text}`}>
        <ButtonWrapper
          contentStyle={[
            styles.itemContainer,
            isSelected ? styles.itemSelectedContainer : {},
          ]}
          testID={`item_community_data_${item.id}`}
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
    <View style={[styles.container, style]}>
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

export default CommunityMenu;
