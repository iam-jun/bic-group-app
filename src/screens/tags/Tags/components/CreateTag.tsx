import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Button from '~/baseComponents/Button';
import { TextInput } from '~/baseComponents/Input';
import Text from '~/baseComponents/Text';
import { useBaseHook } from '~/hooks';
import { ICommunity } from '~/interfaces/ICommunity';
import type { CreateTag as CreateTagType } from '~/interfaces/ITag';
import useCommunitiesStore, { ICommunitiesState } from '~/store/entities/communities';
import { spacing } from '~/theme';
import useTagsControllerStore from '../../store';

type CreateTagProps = {
    communityId: string;
}

const CreateTag: FC<CreateTagProps> = ({ communityId }) => {
  const { t } = useBaseHook();
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const [tag, setTag] = useState('');

  const loading = useTagsControllerStore((state) => state.loading);
  const actions = useTagsControllerStore((state) => state.actions);

  const community = useCommunitiesStore(
    useCallback(
      (state: ICommunitiesState) => state.data[communityId] || ({} as ICommunity),
      [communityId],
    ),
  );
  const { groupId } = community;

  const createTag = () => {
    const newTag: CreateTagType = {
      groupId,
      name: tag.trim(),
    };
    actions.addTag(communityId, newTag);
    setTag('');
  };

  const onChangeText = (text: string) => {
    setTag(text.toLowerCase());
  };

  const isDisabledBtnCreateTag = tag.trim().length === 0;

  return (
    <View style={styles.container}>
      <TextInput
        label={t('tags:create_tag')}
        testID="create_tag"
        value={tag}
        placeholder={t('tags:input_tag')}
        onChangeText={onChangeText}
        maxLength={32}
        autoCapitalize="none"
      />
      <Text.BodyS color={colors.neutral40} useI18n>tags:input_tag_require_max_length</Text.BodyS>
      <View style={styles.btnContainer}>
        <Button.Primary loading={loading} disabled={isDisabledBtnCreateTag} onPress={createTag}>
          {t('tags:create')}
        </Button.Primary>
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.small,
      backgroundColor: colors.white,
    },
    btnContainer: {
      marginTop: spacing.margin.large,
      paddingVertical: spacing.padding.small,
      borderTopColor: colors.neutral5,
      borderTopWidth: 1,
    },
  });
};

export default CreateTag;
