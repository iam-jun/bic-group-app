import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Image from '~/beinComponents/Image';
import Text from '~/beinComponents/Text';
import { useKeySelector } from '~/hooks/selector';
import appActions from '~/store/app/actions';
import { scaleSize } from '~/theme/dimension';

import spacing from '~/theme/spacing';
import { getUrlFromText, openLink } from '~/utils/common';
import ButtonWrapper from './Button/ButtonWrapper';

interface Props {
  text?: string;
}

const LinkPreviewer = ({ text }: Props) => {
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const [link, setLink] = useState<string | null | undefined>('');
  const linkPreviews = useKeySelector('app.linkPreviews');

  useEffect(() => {
    const url = getUrlFromText(text);
    setLink(url);
  }, [text]);

  useEffect(() => {
    if (link && !linkPreviews?.[link]) {
      dispatch(appActions.getLinkPreview(link));
    }
  }, [link]);

  // link preview must have title at least
  if (!link || !linkPreviews?.[link]?.title) return null;

  const onPress = () => {
    openLink(link);
  };

  return (
    <ButtonWrapper contentStyle={styles.container} onPress={onPress}>
      {!!linkPreviews?.[link].image && (
        <Image
          style={styles.thumbnail}
          containerStyle={styles.thumbnailContainer}
          source={linkPreviews?.[link].image}
        />
      )}
      <View style={styles.metadata}>
        <Text.ButtonM style={styles.title}>
          {linkPreviews?.[link].title}
        </Text.ButtonM>
        {!!linkPreviews?.[link].description && (
          <Text.BodyS style={styles.description}>
            {linkPreviews?.[link].description}
          </Text.BodyS>
        )}
      </View>
    </ButtonWrapper>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'column',
      marginTop: spacing.margin.small,
      borderRadius: spacing.borderRadius.small,
      backgroundColor: colors.neutral1,
      borderWidth: 1,
      borderColor: colors.neutral5,
      overflow: 'hidden',
      alignItems: 'flex-start',
    },
    thumbnailContainer: {
      width: '100%',
      marginBottom: spacing.margin.base,
    },
    thumbnail: {
      width: scaleSize(307),
      height: scaleSize(225.5),
    },
    metadata: {
      paddingHorizontal: spacing.padding.small,
      paddingBottom: spacing.padding.large,
    },
    title: {
      marginTop: spacing.margin.small,
    },
    description: {
      marginTop: spacing.margin.small,
    },
  });
};

export default LinkPreviewer;
