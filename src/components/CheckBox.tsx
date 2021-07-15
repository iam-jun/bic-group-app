import React from 'react';
import Icon from '~/components/Icon';

import commonActions from '~/constants/commonActions';

interface Props {
  toggleCheckBox: boolean;
  setToggleCheckBox: Function;
  onActionPress: Function;
}

const CheckBox: React.FC<Props> = ({
  toggleCheckBox,
  setToggleCheckBox,
  onActionPress,
}) => {
  const onToggleCheckBox = () => {
    setToggleCheckBox(!toggleCheckBox);
    if (!toggleCheckBox) {
      onActionPress(commonActions.checkBox);
    } else {
      onActionPress(commonActions.uncheckBox);
    }
  };

  return (
    <>
      {toggleCheckBox ? (
        <Icon icon="iconCheckbox" size={24} onPress={onToggleCheckBox} />
      ) : (
        <Icon icon="iconEmptyCheckbox" size={24} onPress={onToggleCheckBox} />
      )}
    </>
  );
};

export default CheckBox;
