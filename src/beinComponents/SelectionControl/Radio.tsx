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

const Radio: React.FC<Props> = ({isChecked = false, onActionPress}) => {
  const [checked, setChecked] = useState<boolean>(isChecked);
  const theme: ITheme = useTheme();
  const styles = createStyles(theme);

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
      <View style={styles.outsideCircle}>
        {checked ? <View style={styles.insideCircle} /> : null}
      </View>
    </TouchableOpacity>
  );
};

Radio.propTypes = {
  isChecked: PropTypes.bool,
  onActionPress: PropTypes.func.isRequired,
};

const createStyles = (theme: ITheme) => {
  const {colors} = theme;

  return StyleSheet.create({
    outsideCircle: {
      width: 16,
      height: 16,
      borderRadius: 24,
      borderWidth: 1.2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    insideCircle: {
      width: 12,
      height: 12,
      borderRadius: 10,
      backgroundColor: colors.primary,
    },
  });
};

export default Radio;
