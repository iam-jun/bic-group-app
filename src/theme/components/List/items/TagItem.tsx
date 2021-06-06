import React from 'react';
import {StyleSheet} from 'react-native';
import {
  grey2 as BACKGROUND_COLOR,
  grey4 as ICON_CORLOR,
  grey6 as TEXT_COLOR,
} from '~/theme/configs/colors';
import Icon from '../../Icon';
import ThemeView from '~/theme/components/ThemeView';
import TextContent from '../../Text';

export interface Props {
  name?: string;
  onRemovePress?: () => void;
}

const TagItem: React.FC<Props> = ({name, onRemovePress}) => {
  return (
    <ThemeView style={[styles.container, styles.backgroundColor]}>
      <TextContent primary={styles.textStyle} bold>
        {name}
      </TextContent>
      {onRemovePress && (
        <Icon
          tintColor={ICON_CORLOR}
          size={10}
          icon="iconClose"
          onPress={onRemovePress}
        />
      )}
    </ThemeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginEnd: 3,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  textStyle: {
    color: TEXT_COLOR,
    fontSize: 10,
  },
  backgroundColor: {
    backgroundColor: BACKGROUND_COLOR,
  },
});

export default TagItem;
