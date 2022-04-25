import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import {IOptionItem} from '~/interfaces/IEditUser';

import BottomSheet from '~/beinComponents/BottomSheet';
import Divider from '~/beinComponents/Divider';
import Text from '~/beinComponents/Text';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import i18next from 'i18next';
import Icon from '~/beinComponents/Icon';

interface OptionMenuProps {
  data: IOptionItem[];
  menuRef: any;
  value: string;
  title: string;
  onItemPress: (item: any) => void;
  testID?: string;
}

const OptionMenu = ({
  data,
  value,
  title,
  menuRef,
  onItemPress,
  testID,
}: OptionMenuProps) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const renderItem = ({item}: {item: IOptionItem}) => {
    return (
      <TouchableOpacity
        testID={`edit_user_info.option_menu.item_${item.type}`}
        onPress={() => onItemPress(item)}>
        <PrimaryItem
          title={i18next.t(item.title)}
          height={36}
          RightComponent={
            value === item.type ? (
              <Icon
                icon={'Check'}
                size={24}
                tintColor={theme.colors.primary7}
              />
            ) : undefined
          }
        />
      </TouchableOpacity>
    );
  };

  return (
    <View testID={testID}>
      <BottomSheet
        modalizeRef={menuRef}
        ContentComponent={
          <View style={styles.contentComponent}>
            <Text.ButtonSmall
              color={theme.colors.textSecondary}
              style={styles.chooseText}
              useI18n>
              {title}
            </Text.ButtonSmall>
            <Divider />
            {data.map((item: IOptionItem) => (
              <View key={item?.title + item?.type}>{renderItem({item})}</View>
            ))}
          </View>
        }
      />
    </View>
  );
};

export default OptionMenu;

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    contentComponent: {},
    chooseText: {
      margin: spacing.margin.base,
    },
  });
};
