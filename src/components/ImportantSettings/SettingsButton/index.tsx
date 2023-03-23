import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRootNavigation } from '~/hooks/navigation';
import { Button } from '~/baseComponents';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import { spacing } from '~/theme';
import Text from '~/baseComponents/Text';
import useCreateArticle from '~/screens/articles/CreateArticle/hooks/useCreateArticle';
import useSeriesCreation from '~/screens/series/hooks/useSeriesCreation';
import useModalStore from '~/store/modal';
import { useBaseHook } from '~/hooks';
import { PostType } from '~/interfaces/IPost';

interface SettingsButtonProps {
  type: PostType;
  articleId?: string;
  seriesId?: string;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({
  type,
  articleId,
  seriesId,
}) => {
  const { rootNavigation } = useRootNavigation();
  const {
    disableArticleSettings,
    audiencesWithNoPermission: audiencesWithNoPermissionArticle,
  } = useCreateArticle({ articleId });
  const {
    disableSeriesSettings,
    audiencesWithNoPermission: audiencesWithNoPermissionSeries,
  } = useSeriesCreation({ seriesId });
  const { showAlert } = useModalStore((state) => state.actions);
  const { t } = useBaseHook();

  const listAudienceWithNoPermission
    = type === PostType.ARTICLE ? audiencesWithNoPermissionArticle : audiencesWithNoPermissionSeries;
  const disabled
    = type === PostType.ARTICLE ? disableArticleSettings : disableSeriesSettings;

  const onPressSettings = () => {
    if (listAudienceWithNoPermission?.length > 0) {
      const audienceListNames = listAudienceWithNoPermission
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

    if (type === PostType.ARTICLE) {
      rootNavigation.navigate(articleStack.createArticleSettings, { articleId });
    } else {
      rootNavigation.navigate(seriesStack.seriesSettings, {
        seriesId,
        listAudiencesWithoutPermission: audiencesWithNoPermissionSeries,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Button.Primary
        type="ghost"
        icon="Sliders"
        iconSize={18}
        disabled={disabled}
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
