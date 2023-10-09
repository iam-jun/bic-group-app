import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IGroup } from '~/interfaces/IGroup';
import AudienceContent from './AudienceContent';
import { spacing } from '~/theme';

interface AudienceItemProps {
    item: IGroup;
    shouldBeChecked: (item: IGroup) => boolean;
    onCheckboxPress: (item: IGroup, isChecked: boolean) => void;
    isSingleSelect?: boolean;
}

const AudienceItem: React.FC<AudienceItemProps> = ({
  item,
  shouldBeChecked,
  onCheckboxPress,
  isSingleSelect,
}) => {
  const styles = createStyle();

  return (
    <View testID="audience_item" style={styles.container}>
      <AudienceContent
        shouldBeChecked={shouldBeChecked}
        onPress={onCheckboxPress}
        style={styles.itemContainer}
        item={item}
        isSingleSelect={isSingleSelect}
      />
    </View>
  );
};

const createStyle = () => StyleSheet.create({
  container: {},
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: spacing.padding.small,
  },
});

export default AudienceItem;
