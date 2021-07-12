import React, {MutableRefObject, Ref} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {IObject} from '~/interfaces/common';
import {spacing} from '~/theme';
import {Modalize} from 'react-native-modalize';
import ListView from '~/components/list/ListView';
import Text from '../texts/Text';
import Divider from '../Divider';
import {IListViewItem} from '../list/items';
import {Portal} from 'react-native-portalize';
import {IHandles} from 'react-native-modalize/lib/options';

export type IOptionModal = Modalize | IHandles | undefined;

export interface Props {
  modalRef?:
    | Ref<IOptionModal | undefined>
    | MutableRefObject<IOptionModal | undefined>;
  title?: string;
  headerComponent?: React.ReactNode;
  option?: IListViewItem;
  optionData?: IObject<any>[];
  onOptionPress?: Function;
  [x: string]: any;
}

const OptionModal: React.FC<Props> = ({
  modalRef,
  style,
  title,
  headerComponent,
  option,
  optionData,
  onOptionPress,
  children,
  ...props
}) => {
  const theme: IObject<any> = useTheme();
  const styles = themeStyle(theme);

  return (
    <Portal>
      <Modalize
        {...props}
        modalStyle={styles.modal}
        adjustToContentHeight={true}
        ref={modalRef}>
        <View style={style}>
          {headerComponent ? (
            headerComponent
          ) : title ? (
            <View>
              <Text>{title}</Text>
              <Divider />
            </View>
          ) : null}

          {optionData ? (
            <ListView
              style={styles.list}
              data={optionData}
              type={option || 'option'}
              onItemPress={onOptionPress}
            />
          ) : (
            children
          )}
        </View>
      </Modalize>
    </Portal>
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
    list: {
      margin: spacing.margin.base,
    },
  });
};

export default React.forwardRef(
  (props: Props, ref?: React.Ref<IOptionModal>) => (
    <OptionModal modalRef={ref} {...props} />
  ),
);
