import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Icon from '~/beinComponents/Icon';
import Text from '~/beinComponents/Text';

const communityMenuData = [
  {
    id: 1,
    text: 'communities:community_menu:your_communities_text',
    icon: 'UsersAlt',
    type: 'COMMUNITIES',
  },
  {
    id: 2,
    text: 'communities:community_menu:manage_text',
    icon: 'Dashboard',
    type: 'MANAGE',
  },
  {
    id: 3,
    text: 'communities:community_menu:discover_text',
    icon: 'Compass',
    type: 'DISCOVER',
  },
];

const CommunityMenu = ({
  selectedIndex,
  onPress,
}: {
  selectedIndex?: number;
  onPress: (item: any, index: number) => void;
}) => {
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
          onPress={() => {
            onPress(item, index);
          }}>
          <Icon
            icon={item.icon}
            size={24}
            tintColor={
              isSelected ? theme.colors.primary : theme.colors.iconTintLight
            }
            style={styles.icon}
          />
          <Text
            useI18n
            color={
              isSelected ? theme.colors.primary : theme.colors.textSecondary
            }>
            {item.text}
          </Text>
        </ButtonWrapper>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        style={{backgroundColor: theme.colors.background}}
        showsHorizontalScrollIndicator={false}
        alwaysBounceHorizontal={false}>
        {communityMenuData.map(renderReactItem)}
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
      backgroundColor: colors.surface,
      flexDirection: 'row',
      padding: spacing.padding.small,
      borderRadius: 100,
    },
    itemSelectedContainer: {
      backgroundColor: colors.primary2,
    },
    iconLeftStyle: {marginRight: spacing.margin.base},
    icon: {
      marginRight: spacing.margin.small,
    },
  });
};

export default CommunityMenu;
