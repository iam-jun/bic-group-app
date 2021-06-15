import React from 'react';
import {StyleProp, StyleSheet, ViewStyle, View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Modal} from 'react-native-paper';

import {IObject} from '~/interfaces/common';
import * as actions from '~/store/common/actions';
import {white} from '~/theme/configs/colors';
import {borderRadius, margin, padding} from '~/theme/configs/spacing';
import Text from '../Text/index';
import {sizes} from '~/theme/configs/dimension';

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
      contentContainerStyle={styles.containerStyle}
      dismissable={dismissable}
      style={StyleSheet.flatten([style && style])}
      {...rest}>
      <View testID="alertModal">
        <Text style={styles.textCenter} h3>
          {title && title}
        </Text>
        <Text style={styles.textCenter}>{content}</Text>
        <View style={styles.displayBtn}>
          {cancelBtn && (
            <Text
              style={styles.textBtn}
              testID="textAlertCancel"
              onPress={() => {
                dispatch(actions.hideAlert());
                onCancel && onCancel();
              }}>
              Cancel
            </Text>
          )}
          <Text
            style={styles.textBtn}
            testID="textAlertConfirm"
            onPress={() => {
              dispatch(actions.hideAlert());
              onConfirm && onConfirm();
            }}>
            Confirm
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const themeStyles = () => {
  return StyleSheet.create({
    containerStyle: {
      backgroundColor: white,
      padding: padding.small,
      borderRadius: borderRadius.small,
      marginHorizontal: margin.base,
    },
    displayBtn: {
      flexDirection: 'row-reverse',
    },
    textCenter: {
      textAlign: 'center',
    },
    textBtn: {
      paddingRight: padding.small,
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
