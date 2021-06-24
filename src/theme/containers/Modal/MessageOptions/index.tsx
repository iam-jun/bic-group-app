import React, {MutableRefObject, Ref} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {IObject} from '~/interfaces/common';
import {spacing} from '~/theme/configs';
import {Modalize} from 'react-native-modalize';
import ListView from '~/theme/components/List/ListView';
import messageOptions from '~/constants/messageOptions';
import reactions from '~/constants/reactions';
import Icon from '~/theme/components/Icon';

export interface Props {
  modalRef?: Ref<Modalize | undefined> | MutableRefObject<Modalize | undefined>;
  onMenuPress?: Function;
  onReactionPress?: Function;
  [x: string]: any;
}

const MessageOptionsModal: React.FC<Props> = ({
  modalRef,
  onMenuPress,
  onReactionPress,
  ...props
}) => {
  const theme: IObject<any> = useTheme();
  const styles = themeStyle(theme);

  return (
    <Modalize
      {...props}
      modalStyle={styles.modal}
      adjustToContentHeight={true}
      ref={modalRef}>
      <View style={styles.reactions}>
        {Object.keys(reactions).map(key => (
          <Icon
            key={`reaction-${key}`}
            icon={reactions[key as keyof typeof reactions].icon}
            size={20}
            isButton
            onPress={() => onReactionPress && onReactionPress(key)}
          />
        ))}
      </View>
      <ListView
        style={styles.list}
        data={messageOptions}
        type="option"
        onItemPress={onMenuPress}
      />
    </Modalize>
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
