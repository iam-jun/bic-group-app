import React, {FC} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import SearchInput from '~/beinComponents/inputs/SearchInput';
import i18next from 'i18next';
import Icon from '~/beinComponents/Icon';
import ViewSpacing from '~/beinComponents/ViewSpacing';

export interface HeaderSearchProps {
  isShowSearch: boolean;
  onSearchText?: (searchText: string) => void;
  onPressBack?: () => void;
}

const HeaderSearch: FC<HeaderSearchProps> = ({
  isShowSearch,
  onSearchText,
  onPressBack,
}: HeaderSearchProps) => {
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  if (!isShowSearch) {
    return null;
  }

  const _onChangeText = (text: string) => {
    onSearchText?.(text);
  };

  const _onPressBack = () => {
    onPressBack?.();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {}}
      style={styles.container}>
      <ViewSpacing width={spacing.margin.large} />
      <Icon
        icon="iconBack"
        onPress={_onPressBack}
        size={28}
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
      />
      <ViewSpacing width={spacing.margin.base} />
      <SearchInput
        style={{flex: 1}}
        onChangeText={_onChangeText}
        placeholder={i18next.t('input:search_group')}
      />
      <ViewSpacing width={spacing.margin.large} />
    </TouchableOpacity>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, dimension} = theme;
  return StyleSheet.create({
    container: {
      height: dimension?.headerHeight || 44,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
  });
};

export default HeaderSearch;
