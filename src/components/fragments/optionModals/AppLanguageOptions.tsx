import React, {MutableRefObject, Ref} from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {IObject} from '~/interfaces/common';
import {spacing} from '~/theme';
import {Modalize} from 'react-native-modalize';
import ListView from '~/components/list/ListView';
import {languages} from '~/configs';

export interface Props {
  modalRef?: Ref<Modalize | undefined> | MutableRefObject<Modalize | undefined>;
  onMenuPress?: Function;
  [x: string]: any;
}

const AppLanguageOptions: React.FC<Props> = ({
  modalRef,
  onMenuPress,
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
        data={languages}
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
    top: {
      alignItems: 'center',
      paddingVertical: spacing.padding.large,
    },
    list: {
      margin: spacing.margin.base,
    },
  });
};

export default AppLanguageOptions;
