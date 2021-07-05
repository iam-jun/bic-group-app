import React, {MutableRefObject, Ref} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {IObject} from '~/interfaces/common';
import {spacing} from '~/theme';
import {Modalize} from 'react-native-modalize';
import ListView from '~/components/list/ListView';
import postOptions from '~/constants/postOptions';

export interface Props {
  modalRef?: Ref<Modalize | undefined> | MutableRefObject<Modalize | undefined>;
  onMenuPress?: Function;
  onReactionPress?: Function;
  [x: string]: any;
}

const PostOptionsModal: React.FC<Props> = ({
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
      <ListView
        style={styles.list}
        data={postOptions}
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

export default PostOptionsModal;
