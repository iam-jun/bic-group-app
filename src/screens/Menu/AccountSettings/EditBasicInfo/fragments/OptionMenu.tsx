import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import i18next from 'i18next';
import { IOptionItem } from '~/interfaces/IEditUser';

import BottomSheet from '~/baseComponents/BottomSheet';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Icon from '~/baseComponents/Icon';
import spacing from '~/theme/spacing';

interface OptionMenuProps {
  data: IOptionItem[];
  menuRef: any;
  value: string;
  onItemPress: (item: any) => void;
  testID?: string;
}

const OptionMenu = ({
  data,
  value,
  menuRef,
  onItemPress,
  testID,
}: OptionMenuProps) => {
  const theme: ExtendedTheme = useTheme();

  const renderItem = ({ item }: { item: IOptionItem }) => (
    <TouchableOpacity
      testID={`edit_user_info.option_menu.item_${item.type}`}
      onPress={() => onItemPress(item)}
    >
      <PrimaryItem
        style={styles.containerItem}
        title={i18next.t(item.title)}
        titleProps={{ variant: 'bodyM' }}
        RightComponent={
          value === item.type ? (
            <Icon icon="CheckSolid" size={24} tintColor={theme.colors.blue50} />
          ) : undefined
        }
      />
    </TouchableOpacity>
  );

  return (
    <View testID={testID}>
      <BottomSheet
        modalizeRef={menuRef}
        ContentComponent={(
          <View style={styles.contentComponent}>
            {data.map((item: IOptionItem) => (
              <View key={`${item?.title} ${item?.type}`}>
                {renderItem({ item })}
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
};

export default OptionMenu;

const styles = StyleSheet.create({
  contentComponent: {},
  chooseText: {
    margin: spacing.margin.base,
  },
  containerItem: {
    paddingVertical: spacing.padding.base,
    paddingHorizontal: spacing.padding.large,
  },
});
