import { useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import { ITag } from '~/interfaces/ITag';
import spacing from '~/theme/spacing';
import useTagItemMenu from '../useTagItemMenu';

type TagItemProps = {
    item: ITag;
    isMember: boolean;
}

const TagItem: FC<TagItemProps> = ({ item, isMember }) => {
  const { name } = item;
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle();

  const { showMenu } = useTagItemMenu(item);

  const onPressMenu = () => {
    showMenu();
  };

  return (
    <View style={styles.row}>
      <View style={styles.flex}>
        <Text.BodyM numberOfLines={1}>{name}</Text.BodyM>
      </View>
      {isMember && (
      <Icon
        icon="Ellipsis"
        onPress={onPressMenu}
        size={20}
        tintColor={colors.neutral40}
        hitSlop={{
          top: 20,
          bottom: 20,
          left: 20,
          right: 20,
        }}
      />
      )}
    </View>
  );
};

const createStyle = () => StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: spacing.padding.base,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
    marginRight: spacing.margin.small,
  },

});

export default TagItem;
