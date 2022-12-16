import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useState } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { useRootNavigation } from '~/hooks/navigation';
import { EditTag as EditTagType, ITag } from '~/interfaces/ITag';
import { spacing } from '~/theme';
import useTagsControllerStore from '../store';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';
import { useBaseHook } from '~/hooks';
import Header from '~/beinComponents/Header';
import TextInput from '~/baseComponents/Input/TextInput';
import Text from '~/baseComponents/Text';

type EditTagProps = {
    route: {
        params: {
          tag: ITag
        },
    }
}

const EditTag: FC<EditTagProps> = (props) => {
  const { params } = props.route || {};
  const { tag } = params || {};
  const { name, id } = tag;
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const [nameTagState, setNameTagState] = useState(name || '');

  const loading = useTagsControllerStore((state) => state.loading);
  const actions = useTagsControllerStore((state) => state.actions);

  const handleSave = () => {
    const tagUpdate: EditTagType = {
      id,
      name: nameTagState.trim(),
    };
    actions.editTag(tagUpdate);
    Keyboard.dismiss();
  };

  const onSave = () => {
    Store.store.dispatch(modalActions.showAlert({
      title: t('tags:edit_tag'),
      content: t('tags:do_you_want_to_change_this_tag'),
      cancelBtn: true,
      cancelLabel: t('common:btn_cancel'),
      confirmLabel: t('common:btn_edit'),
      onConfirm: () => handleSave(),
    }));
  };

  const isChanged = nameTagState !== name;

  const isDisabledBtnEditTag = nameTagState.trim().length === 0 || !isChanged;

  const handleBack = () => {
    if (isChanged) {
      Keyboard.dismiss();
      Store.store.dispatch(modalActions.showAlert({
        title: t('discard_alert:title'),
        content: t('discard_alert:content'),
        cancelBtn: true,
        cancelLabel: t('common:btn_discard'),
        confirmLabel: t('common:btn_stay_here'),
        onCancel: () => rootNavigation.goBack(),
      }));
      return;
    }
    rootNavigation.goBack();
  };

  const onChangeText = (text: string) => {
    setNameTagState(text.toLowerCase());
  };

  return (
    <View style={styles.container}>
      <Header
        useI18n
        title="tags:edit_tag"
        buttonProps={{ disabled: isDisabledBtnEditTag, loading, style: styles.btnSave }}
        buttonText="common:btn_save"
        onPressButton={onSave}
        onPressBack={handleBack}
      />
      <View style={styles.content}>
        <TextInput
          testID="edit_tag"
          value={nameTagState}
          placeholder={t('tags:input_tag')}
          onChangeText={onChangeText}
          maxLength={32}
          autoCapitalize="none"
        />
        <Text.BodyS color={colors.neutral40} useI18n>tags:input_tag_require_max_length</Text.BodyS>
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    childrenText: {
      paddingVertical: spacing.padding.small,
      paddingBottom: spacing.padding.base,
      paddingHorizontal: spacing.padding.large,
    },
    btnSave: {
      marginRight: spacing.margin.small,
    },
    content: {
      padding: spacing.padding.large,
    },
  });
};

export default EditTag;
