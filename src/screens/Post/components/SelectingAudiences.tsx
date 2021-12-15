import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Tag from '~/beinComponents/Tag';
import {IAudience} from '~/interfaces/IPost';
import Divider from '~/beinComponents/Divider';

export interface SelectingAudiencesProps {
  list: IAudience[];
  onRemoveItem: (item: IAudience) => void;
}

const SelectingAudiences: React.FC<SelectingAudiencesProps> = ({
  list,
  onRemoveItem,
}: SelectingAudiencesProps) => {
  const [showAll, setShowAll] = useState(false);

  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const onPressShowAll = () => {
    setShowAll(!showAll);
  };

  const onPressRemoveItem = (item: IAudience) => {
    onRemoveItem?.(item);
  };

  const renderItem = (item: any, index: number) => {
    const {name, icon, avatar} = item;
    return (
      <Tag
        style={styles.item}
        key={'tag_' + index}
        avatar={icon || avatar}
        label={name}
        onPressIcon={() => onPressRemoveItem(item)}
      />
    );
  };

  if (!list || list?.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text.H6 style={{flex: 1}}>Chosen Audiences</Text.H6>
        <ButtonWrapper
          textProps={{color: colors.primary7, variant: 'buttonSmall'}}
          onPress={onPressShowAll}
          testID="selecting_audiences.show">
          {showAll ? 'Show less' : `Show all(${list?.length})`}
        </ButtonWrapper>
      </View>
      <View
        testID="selecting_audiences"
        style={{
          flexDirection: 'row',
          flexWrap: showAll ? 'wrap' : 'nowrap',
        }}>
        {list?.map?.(renderItem)}
      </View>
      <Divider style={styles.divider} />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing?.padding.large,
    },
    headerContainer: {
      flexDirection: 'row',
      paddingVertical: spacing?.padding.small,
    },
    item: {
      marginRight: spacing?.margin.small,
      marginBottom: spacing?.margin.small,
    },
    divider: {
      marginTop: spacing.margin.tiny,
    },
  });
};

export default SelectingAudiences;
