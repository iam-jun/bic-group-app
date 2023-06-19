import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRootNavigation } from '~/hooks/navigation';
import { Button } from '~/baseComponents';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import { spacing } from '~/theme';
import useCreateArticle from '~/screens/articles/CreateArticle/hooks/useCreateArticle';
import useSeriesCreation from '~/screens/series/hooks/useSeriesCreation';
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
  } = useCreateArticle({ articleId });
  const {
    disableSeriesSettings,
  } = useSeriesCreation({ seriesId });

  const disabled
    = type === PostType.ARTICLE ? disableArticleSettings : disableSeriesSettings;

  const onPressSettings = () => {
    if (type === PostType.ARTICLE) {
      rootNavigation.navigate(articleStack.createArticleSettings, { articleId });
    } else {
      rootNavigation.navigate(seriesStack.seriesSettings, {
        seriesId,
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
