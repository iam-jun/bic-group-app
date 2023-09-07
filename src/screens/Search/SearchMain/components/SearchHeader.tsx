import React, { FC } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { Platform, StyleSheet, View } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '~/baseComponents/Icon';
import { SearchInput } from '~/baseComponents/Input';
import { dimension, spacing } from '~/theme';
import { fontFamilies } from '~/theme/fonts';
import Text from '~/baseComponents/Text';

type SearchHeaderProps = {
  onPressBack: () => void;
  onPressFilter: () => void;
  searchText: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: () => void;
  onFocus: () => void;
  autoFocus?: boolean;
  numberActiveFilters?: number;
};

const SearchHeader: FC<SearchHeaderProps> = ({
  onPressBack,
  onPressFilter,
  searchText,
  placeholder,
  onChangeText,
  onSubmitEditing,
  onFocus,
  autoFocus = true,
  numberActiveFilters = 0,
}) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme, insets);

  const renderBadge = () => {
    if (!numberActiveFilters) return null;

    return (
      <View style={styles.badge}>
        <Text.BadgeS color={colors.white}>
          {numberActiveFilters}
        </Text.BadgeS>
      </View>
    );
  };

  return (
    <View style={[styles.headerContainer]}>
      <View style={styles.inputIconContainer}>
        <Icon
          icon="iconBack"
          onPress={onPressBack}
          size={24}
          hitSlop={{
            top: 20,
            bottom: 20,
            left: 20,
            right: 20,
          }}
        />
        <SearchInput
          autoFocus={autoFocus}
          style={styles.textInput}
          value={searchText}
          autoComplete="off"
          placeholder={placeholder}
          placeholderTextColor={theme.colors.gray40}
          selectionColor={theme.colors.gray50}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onSubmitEditing={onSubmitEditing}
        />
        <View>
          <Icon
            icon="BarsSort"
            onPress={onPressFilter}
            size={24}
            hitSlop={{
              top: 20,
              bottom: 20,
              left: 20,
              right: 20,
            }}
          />
          {renderBadge()}
        </View>
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme, insets: EdgeInsets) => {
  const { colors, elevations } = theme;

  return StyleSheet.create({
    headerContainer: {
      paddingTop: insets.top,
      overflow: 'hidden',
      alignItems: 'flex-end',
      flexDirection: 'row',
      backgroundColor: colors.white,
      ...elevations.e1,
      borderBottomColor: colors.gray1,
      paddingHorizontal: spacing.padding.large,
    },
    inputIconContainer: {
      height: dimension.headerHeight,
      flex: 1,
      flexDirection: 'row',
      backgroundColor: colors.white,
      overflow: 'hidden',
      alignItems: 'center',
    },
    textInput: {
      flex: 1,
      height: '100%',
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: dimension.sizes.bodyM,
      color: colors.neutral80,
      marginHorizontal: spacing.margin.base,
    },
    badge: {
      backgroundColor: colors.red40,
      borderRadius: Platform.OS === 'ios' ? 6 : 9,
      width: Platform.OS === 'ios' ? 12 : 18,
      height: Platform.OS === 'ios' ? 12 : 18,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: Platform.OS === 'ios' ? -4 : -10,
      right: 0,
    },
  });
};

export default SearchHeader;
