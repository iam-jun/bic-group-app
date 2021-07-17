import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';
import PropTypes from 'prop-types';

import commonActions, {IAction} from '~/constants/commonActions';
import {ITheme} from '~/theme/interfaces';

interface Props {
  isChecked?: boolean;
  onActionPress: (action: IAction) => void;
}

const Toggle: React.FC<Props> = ({isChecked = false, onActionPress}) => {
  const [checked, setChecked] = useState<boolean>(isChecked);
  const theme: ITheme = useTheme();
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
      <View style={styles.outsideRectangle}>
        <View style={styles.insideCircle} />
      </View>
    </TouchableOpacity>
  );
};

Toggle.propTypes = {
  isChecked: PropTypes.bool,
  onActionPress: PropTypes.func.isRequired,
};

const createStyles = (theme: ITheme, isChecked: boolean) => {
  const {colors} = theme;

  return StyleSheet.create({
    outsideRectangle: {
      width: 32,
      height: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isChecked ? colors.primary7 : colors.bgFocus,
      alignItems: isChecked ? 'flex-end' : 'flex-start',
      justifyContent: 'center',
      backgroundColor: isChecked ? colors.primary7 : colors.border,
    },
    insideCircle: {
      width: 16,
      height: 16,
      right: 0,
      borderRadius: 12,
      backgroundColor: isChecked ? colors.background : colors.bgFocus,
    },
  });
};

export default Toggle;
