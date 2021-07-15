import React from 'react';
import {StyleSheet} from 'react-native';
import {
  grey2 as BACKGROUND_COLOR,
  grey4 as ICON_CORLOR,
  grey6 as TEXT_COLOR,
} from '~/theme/colors';
import Icon from '../../Icon';
import ScreenWrapper from '~/components/ScreenWrapper';
import Text from '../../texts/Text';
import {IObject} from '~/interfaces/common';
import {useTheme} from 'react-native-paper';

export interface Props {
  name?: string;
  onRemovePress?: () => void;
}

const TagItem: React.FC<Props> = ({name, onRemovePress}) => {
  const theme: IObject<any> = useTheme();
  return (
    <ScreenWrapper
      style={[styles.container, {backgroundColor: theme.colors.tag}]}>
      <Text primary={styles.textStyle} bold>
        {name}
      </Text>
      {onRemovePress && (
        <Icon
          tintColor={ICON_CORLOR}
          size={10}
          icon="iconClose"
          onPress={onRemovePress}
        />
      )}
    </ScreenWrapper>
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
});

export default TagItem;
