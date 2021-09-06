import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Text} from '~/components';
import Icon from '~/beinComponents/Icon';
import {IObject} from '~/interfaces/common';
import {generateUniqueId} from '~/utils/generator';

export interface Props {
  data: string[];
  onItemPress?: (item: string, index: number) => void;
  onRemovePress?: (item: string, index: number) => void;
  [x: string]: any;
}

const TagsView: React.FC<Props> = ({
  data,
  onItemPress,
  onRemovePress,
  ...props
}) => {
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);
  return (
    <View>
      {data.map((item: any, index: number) => (
        <TouchableOpacity
          key={generateUniqueId()}
          onPress={() => onItemPress && onItemPress(item, index)}>
          <View style={[styles.container, {backgroundColor: theme.colors.tag}]}>
            <Text primary={styles.textStyle} bold>
              {item}
            </Text>
            {onRemovePress && (
              <Icon
                tintColor={theme.colors.grey6}
                size={10}
                icon="iconClose"
                onPress={() => onRemovePress(item, index)}
              />
            )}
          </View>{' '}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const createStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
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
      color: colors.grey6,
      fontSize: 10,
    },
  });
};

export default TagsView;
