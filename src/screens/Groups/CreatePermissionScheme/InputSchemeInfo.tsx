import React, {FC, useState} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import TextInput from '~/beinComponents/inputs/TextInput';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import groupsActions from '~/screens/Groups/redux/actions';
import {useDispatch} from 'react-redux';

export interface InputSchemeInfoProps {
  style?: StyleProp<ViewStyle>;
}

const InputSchemeInfo: FC<InputSchemeInfoProps> = ({
  style,
}: InputSchemeInfoProps) => {
  const [isFocusDesc, setIsFocusDesc] = useState(false);

  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const name = useKeySelector(groupsKeySelector.permission.creatingScheme.name);
  const description = useKeySelector(
    groupsKeySelector.permission.creatingScheme.description,
  );

  const onChangeName = (value: string) => {
    dispatch(groupsActions.setCreatingSchemeData({name: value, description}));
  };

  const onChangeDesc = (value: string) => {
    dispatch(groupsActions.setCreatingSchemeData({name, description: value}));
  };

  const onFocusDesc = () => {
    setIsFocusDesc(true);
  };

  const onBlurDesc = () => {
    setIsFocusDesc(false);
  };

  return (
    <View style={[styles.container, style]}>
      <Text.H5 style={styles.textTitle}>Scheme name:</Text.H5>
      <TextInput
        value={name}
        testID="input_scheme_info.input_name"
        style={styles.textInputName}
        onChangeText={onChangeName}
        // error={error}
        // helperContent={
        //   error ? i18next.t('profile:text_name_must_not_be_empty') : undefined
        // }
        placeholder={'Enter scheme name'}
        activeOutlineColor={theme.colors.primary6}
        outlineColor={theme.colors.borderCard}
        maxLength={32}
      />
      <Text.H5 style={styles.textTitle}>Scheme description:</Text.H5>
      <View
        style={[
          styles.textInput,
          isFocusDesc ? styles.textInputActive : styles.textInputInactive,
        ]}>
        <TextInput
          value={description}
          testID="input_scheme_info.input_desc"
          onChangeText={onChangeDesc}
          multiline
          placeholder={'Write your description here (maximum 255 characters)'}
          activeOutlineColor={theme.colors.background}
          outlineColor={theme.colors.background}
          maxLength={255}
          onFocus={onFocusDesc}
          onBlur={onBlurDesc}
        />
        <Text.Subtitle style={styles.textCount}>0/255</Text.Subtitle>
      </View>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      marginTop: spacing.margin.base,
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
    },
    textTitle: {marginTop: spacing.margin.large},
    textInputName: {marginBottom: spacing.margin.small},
    textInput: {
      borderRadius: spacing.borderRadius.small,
      paddingBottom: spacing.padding.extraLarge,
      height: 120, //fixed height to avoid callback layout another components below this in scrollview
    },
    textInputActive: {
      borderWidth: 2,
      borderColor: colors.primary6,
    },
    textInputInactive: {
      borderWidth: 1,
      paddingHorizontal: 1,
      paddingTop: 1,
      paddingBottom: spacing.padding.extraLarge || 24 + 1,
      borderColor: colors.borderCard,
    },
    textCount: {
      color: colors.textSecondary,
      marginRight: spacing.margin.large,
      position: 'absolute',
      right: 0,
      bottom: spacing.margin.base,
    },
  });
};

export default InputSchemeInfo;
