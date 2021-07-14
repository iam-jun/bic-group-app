import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {IObject} from '~/interfaces/common';
import {spacing} from '~/theme';
import postOptions from '~/constants/postOptions';
import OptionModal, {
  IOptionModal,
  IOptionModalRef,
} from '~/components/modals/OptionModal';

export interface Props {
  modalRef?: IOptionModalRef;
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
    <OptionModal
      {...props}
      ref={modalRef}
      optionData={postOptions}
      onOptionPress={onMenuPress}
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

export default React.forwardRef(
  (props: Props, ref?: React.Ref<IOptionModal>) => (
    <PostOptionsModal modalRef={ref} {...props} />
  ),
);
