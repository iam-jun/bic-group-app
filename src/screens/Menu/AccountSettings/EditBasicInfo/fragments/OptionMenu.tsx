import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import {IGenderItem, IRelationshipItem} from '~/interfaces/IEditUser';

import BottomSheet from '~/beinComponents/BottomSheet';
import Divider from '~/beinComponents/Divider';
import ListView from '~/beinComponents/list/ListView';
import Text from '~/beinComponents/Text';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import i18next from 'i18next';
import Icon from '~/beinComponents/Icon';

interface OptionMenuProps {
  data: any[];
  menuRef: any;
  value: string;
  title: string;
  onItemPress: (item: any) => void;
}

const OptionMenu = ({
  data,
  value,
  title,
  menuRef,
  onItemPress,
}: OptionMenuProps) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const renderItem = ({item}: {item: IRelationshipItem | IGenderItem}) => {
    return (
      <TouchableOpacity onPress={() => onItemPress(item)}>
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
    <View>
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
            <ListView data={data} renderItem={renderItem} />
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
    contentComponent: {marginHorizontal: spacing.margin.base},
    chooseText: {
      margin: spacing.margin.base,
    },
  });
};
