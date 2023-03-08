import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRootNavigation } from '~/hooks/navigation';
import { Button } from '~/baseComponents';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import { spacing } from '~/theme';
import Text from '~/baseComponents/Text';
import useCreateArticle from '~/screens/articles/CreateArticle/hooks/useCreateArticle';
import useModalStore from '~/store/modal';
import { useBaseHook } from '~/hooks';

interface SettingsButtonProps {
    articleId: string;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ articleId }) => {
  const { rootNavigation } = useRootNavigation();
  const { disableArticleSettings, audiencesWithNoPermission } = useCreateArticle({ articleId });
  const { showAlert } = useModalStore((state) => state.actions);
  const { t } = useBaseHook();

  const onPressSettings = () => {
    if (audiencesWithNoPermission?.length > 0) {
      const audienceListNames = audiencesWithNoPermission
        .map((audience) => audience.name)
        .join(', ');
      const alertPayload = {
        title: t('post:post_setting_permissions_alert:title'),
        children: (
          <Text.BodyM style={styles.childrenText}>
            {t('post:post_setting_permissions_alert:description_1')}
            <Text.BodyMMedium>{audienceListNames}</Text.BodyMMedium>
            {t('post:post_setting_permissions_alert:description_2')}
          </Text.BodyM>
        ),
        onConfirm: null,
        cancelBtn: true,
      };
      showAlert(alertPayload);
      return;
    }

    rootNavigation.navigate(articleStack.createArticleSettings, { articleId });
  };

  return (
    <View style={styles.container}>
      <Button.Primary
        type="ghost"
        icon="Sliders"
        iconSize={18}
        disabled={disableArticleSettings}
        onPress={onPressSettings}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: spacing.margin.small,
  },
  childrenText: {
    paddingTop: spacing.padding.tiny,
    paddingBottom: spacing.padding.base,
    paddingHorizontal: spacing.padding.large,
  },
});

export default SettingsButton;
