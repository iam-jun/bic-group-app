import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { IPost } from '~/interfaces/IPost';
import { spacing } from '~/theme';
import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import { Button } from '~/baseComponents';
import { goToContentInseries } from '../helper';
import { escapeMarkDown } from '~/utils/formatter';
import { getTitlePostItemInSeries } from '~/helpers/common';
import { useBaseHook } from '~/hooks';

type ContentItemProps = {
    item: IPost;
    isPrev: boolean;
}

const ContentItem: FC<ContentItemProps> = ({ item, isPrev }) => {
  const { title } = item;
  const { t } = useBaseHook();
  const escapeMarkDownTitle = escapeMarkDown(title);
  const titlePost = getTitlePostItemInSeries(escapeMarkDownTitle);
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const goToContent = () => {
    goToContentInseries(item);
  };

  return (
    <Button onPress={goToContent} style={styles.container}>
      {isPrev && <Icon style={styles.iconPrev} tintColor={colors.neutral40} size={14} icon="ArrowLeft" />}
      <View style={styles.containerTitle}>
        <Text.BodyM style={[styles.textTitle, !isPrev && { textAlign: 'right' }]} numberOfLines={2}>{!!titlePost ? titlePost : t('series:text_no_content')}</Text.BodyM>
      </View>
      {!isPrev && <Icon style={styles.iconNext} tintColor={colors.neutral40} size={14} icon="ArrowRight" />}
    </Button>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      paddingVertical: spacing.padding.large,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    containerTitle: {
      flex: 1,
    },
    textTitle: {
      color: colors.neutral60,
    },
    iconPrev: {
      marginRight: spacing.padding.base,
    },
    iconNext: {
      marginLeft: spacing.padding.base,
    },
  });
};

export default ContentItem;
