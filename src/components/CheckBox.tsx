import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';
import PropTypes from 'prop-types';

import Icon from '~/components/Icon';
import commonActions, {IAction} from '~/constants/commonActions';
import {IObject} from '~/interfaces/common';

interface Props {
  isChecked?: boolean;
  onActionPress: (action: IAction) => void;
}

const Checkbox: React.FC<Props> = ({isChecked = false, onActionPress}) => {
  const [checked, setChecked] = useState<boolean>(isChecked);
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme, checked);

  const _onChangeValue = () => {
    const newValue = !checked;
    setChecked(newValue);

    if (newValue) {
      onActionPress(commonActions.checkBox as IAction);
    } else {
      onActionPress(commonActions.uncheckBox as IAction);
    }
  };

  return (
    <TouchableOpacity onPress={_onChangeValue}>
      <View style={styles.checkbox}>
        {checked ? <Icon icon="iconCheckbox" size={12} /> : null}
      </View>
    </TouchableOpacity>
  );
};

Checkbox.propTypes = {
  isChecked: PropTypes.bool,
  onActionPress: PropTypes.func.isRequired,
};

const createStyles = (theme: IObject<any>, isChecked: boolean) => {
  const {colors} = theme;

  return StyleSheet.create({
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 1,
      borderRadius: 6,
      backgroundColor: isChecked ? colors.primary7 : colors.surface,
      justifyContent: 'center',
    },
  });
};

export default Checkbox;
