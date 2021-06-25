import React from 'react';
import {StyleProp, StyleSheet, ViewStyle, View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Modal} from 'react-native-paper';

import {IObject} from '~/interfaces/common';
import * as actions from '~/store/common/actions';
import {borderRadius, margin, padding} from '~/theme/configs/spacing';
import Text from '../Text/index';
import {sizes} from '~/theme/configs/dimension';
import ThemeView from '../ThemeView/';
import Divider from '../Divider';
import {convertMultiLanguage} from '~/utils/language';
import ViewSpacing from '../ViewSpacing';

const languages = convertMultiLanguage();

export interface Props {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  dismissable?: boolean;
  [x: string]: any;
}

const AlertModal: React.FC<Props> = props => {
  const {style, dismissable, ...rest} = props;
  const styles = themeStyles();
  const {alert} = useSelector((state: IObject<any>) => state.common);
  const dispatch = useDispatch();
  const {visible, title, content, onConfirm, onCancel, cancelBtn} = alert;

  return (
    <Modal
      visible={visible}
      contentContainerStyle={styles.modal}
      dismissable={dismissable}
      style={StyleSheet.flatten([style && style])}
      {...rest}>
      <ThemeView testID="alertModal" style={styles.container}>
        <Text style={styles.title} h4 bold>
          {title && title}
        </Text>
        <Divider />
        <ViewSpacing height={margin.base} />
        <Text style={styles.content}>{content}</Text>
        <View style={styles.displayBtn}>
          {cancelBtn && (
            <Text
              style={styles.textBtn}
              testID="textAlertCancel"
              onPress={() => {
                dispatch(actions.hideAlert());
                onCancel && onCancel();
              }}>
              {languages.common.btn_cancel}
            </Text>
          )}
          <Text
            style={styles.textBtn}
            testID="textAlertConfirm"
            onPress={() => {
              dispatch(actions.hideAlert());
              onConfirm && onConfirm();
            }}>
            {languages.common.text_ok}
          </Text>
        </View>
      </ThemeView>
    </Modal>
  );
};

const themeStyles = () => {
  return StyleSheet.create({
    modal: {
      marginHorizontal: margin.large,
    },
    container: {
      borderRadius: borderRadius.small,
    },
    displayBtn: {
      flexDirection: 'row-reverse',
    },
    title: {
      textAlign: 'center',
      marginVertical: margin.base,
    },
    content: {
      marginHorizontal: margin.base,
    },
    textBtn: {
      paddingRight: padding.small,
      marginVertical: margin.base,
      fontWeight: '600',
      fontSize: sizes.h4,
    },
  });
};

AlertModal.defaultProps = {
  style: {},
  dismissable: false,
};

export default AlertModal;
