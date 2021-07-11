import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {IObject} from '~/interfaces/common';
import {spacing} from '~/theme';
import messageOptions from '~/constants/messageOptions';
import reactions from '~/constants/reactions';
import Icon from '~/components/Icon';
import OptionModal from '~/components/modals/OptionModal';
import icons from '~/resources/icons';

export interface Props {
  onMenuPress?: Function;
  onReactionPress?: Function;
  [x: string]: any;
}

const MessageOptionsModal: React.FC<Props> = ({
  onMenuPress,
  onReactionPress,
  ...props
}) => {
  const theme: IObject<any> = useTheme();
  const styles = themeStyle(theme);

  return (
    <OptionModal
      {...props}
      optionData={messageOptions}
      onOptionPress={onMenuPress}
      headerComponent={
        <View style={styles.reactions}>
          {Object.keys(reactions).map(key => (
            <Icon
              key={`reaction-${key}`}
              icon={
                reactions[key as keyof typeof reactions]
                  .icon as keyof typeof icons
              }
              size={20}
              isButton
              onPress={() => onReactionPress && onReactionPress(key)}
            />
          ))}
        </View>
      }
    />
  );
};

const themeStyle = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    modal: {
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      backgroundColor: colors.bgColor,
    },
    reactions: {
      paddingTop: spacing.padding.large,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    list: {
      margin: spacing.margin.base,
    },
  });
};

export default MessageOptionsModal;
