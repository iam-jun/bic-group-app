import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useRootNavigation } from '~/hooks/navigation';

import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';

import Icon from '~/baseComponents/Icon';
import { ISelectAudienceParams } from '~/screens/post/PostSelectAudience/SelectAudienceHelper';
import spacing from '~/theme/spacing';
import { useBaseHook } from '~/hooks';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import BottomListItem from '~/components/BottomList/BottomListItem';
import MyDraft from './MyDraft';
import Button from '~/baseComponents/Button';
import useModalStore from '~/store/modal';

export interface FloatingCreatePostProps {
  audience?: any;
  createFromGroupId?: string;
}

const FloatingCreatePost: FC<FloatingCreatePostProps> = ({
  audience,
  createFromGroupId,
}: FloatingCreatePostProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const modalActions = useModalStore((state) => state.actions);

  const onCreate = () => {
    modalActions.hideModal();
    const params: ISelectAudienceParams = {
      createFromGroupId,
      isFirstStep: true,
    };
    if (audience) {
      params.initAudience = audience;
    }
    rootNavigation.navigate(
      homeStack.postSelectAudience, params as any,
    );
  };

  const onCreateArticle = () => {
    modalActions.hideModal();

    rootNavigation.navigate(
      articleStack.createArticle,
    );
  };

  const onCreateSeries = () => {
    modalActions.hideModal();

    rootNavigation.navigate(
      seriesStack.seriesSelectAudience,
      { isFirstStep: true },
    );
  };

  const onPress = () => {
    modalActions.showModal({
      isOpen: true,
      ContentComponent: (
        <View>
          <BottomListItem
            testID="create_option.write_post"
            title={t('home:create_content_options:write_post')}
            onPress={onCreate}
          />
          <BottomListItem
            testID="create_option.write_article"
            title={t('home:create_content_options:write_article')}
            onPress={onCreateArticle}
          />
          <BottomListItem
            testID="create_option.write_series"
            title={t('home:create_content_options:write_series')}
            onPress={onCreateSeries}
          />
          <MyDraft />
        </View>),
    });
  };

  return (
    <View style={styles.container}>
      <Button onPress={onPress} style={styles.button}>
        <Icon tintColor={colors.white} width={20} height={20} icon="PenLineSolid" />
      </Button>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      position: 'absolute',
      right: spacing.margin.small,
      bottom: spacing.margin.extraLarge,
    },
    button: {
      width: 44,
      height: 44,
      borderRadius: spacing.borderRadius.pill,
      backgroundColor: colors.purple50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    myDraft: {
      justifyContent: 'space-between',
      borderTopColor: colors.neutral5,
      borderTopWidth: 1,
    },
  });
};

export default FloatingCreatePost;
