import { StyleSheet, View } from 'react-native';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextInput } from '~/baseComponents/Input';
import { useBaseHook } from '~/hooks';
import { margin, padding } from '~/theme/spacing';
import { Button } from '~/baseComponents';
import Text from '~/baseComponents/Text';
import modalActions from '~/storeRedux/modal/actions';

interface Props {
  type: 'link'|'embed';
  insertLink: (url: string, text: string) => void;
  insertEmbed: (url: string) => void;
}

const InputModalView: FC<Props> = ({ type, insertLink, insertEmbed }) => {
  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');

  const onCancel = () => {
    dispatch(modalActions.hideModal());
  };

  const onSave = () => {
    if (type === 'link') {
      insertLink(url, text);
      dispatch(modalActions.hideModal());
      return;
    }

    insertEmbed(url);
    dispatch(modalActions.hideModal());
  };

  const renderContent = () => {
    if (type === 'embed') {
      return (
        <TextInput
          autoFocus
          testID="input_modal_view.embed_url"
          style={styles.input}
          placeholder={t('article:modal_add_embed:link_placeholder')}
          onChangeText={setUrl}
        />
      );
    }

    return (
      <View>
        <TextInput
          autoFocus
          testID="input_modal_view.link_text"
          style={styles.input}
          placeholder={t('article:modal_add_link:text_placeholder')}
          onChangeText={setText}
        />
        <TextInput
          style={styles.input}
          testID="input_modal_view.link_value"
          placeholder={t('article:modal_add_link:link_placeholder')}
          onChangeText={setUrl}
        />
      </View>
    );
  };

  const linkSaveDisabled = !text || !url;
  const videoSaveDisabled = !url;
  const disabled = type === 'link' ? linkSaveDisabled : videoSaveDisabled;

  return (
    <View style={styles.container}>
      <Text.H4 useI18n>
        {`article:modal_add_${type}:title`}
      </Text.H4>
      {renderContent()}
      <View style={styles.buttonContainer}>
        <Button.Neutral useI18n style={styles.btnCancel} onPress={onCancel}>common:btn_cancel</Button.Neutral>
        <Button.Primary useI18n disabled={disabled} onPress={onSave}>common:text_add</Button.Primary>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: padding.base,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: padding.base,
  },
  btnCancel: {
    marginEnd: margin.base,
  },
  input: {
    marginTop: margin.base,
  },
});

export default InputModalView;
