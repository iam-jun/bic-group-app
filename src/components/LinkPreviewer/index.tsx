import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import Text from '~/beinComponents/Text';
import Image from '~/beinComponents/Image';
import { useKeySelector } from '~/hooks/selector';
import appActions from '~/storeRedux/app/actions';
import spacing from '~/theme/spacing';
import { getUrlFromText } from '~/utils/common';
import { openUrl } from '~/utils/link';
import { Button } from '~/baseComponents';
import images from '~/resources/images';
import Icon from '~/baseComponents/Icon';

interface LinkPreviewerProps {
  text?: string;
  showClose?: boolean;
}

const LinkPreviewer = ({ text, showClose }: LinkPreviewerProps) => {
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const [visible, setVisible] = useState<boolean>(false);
  const linkPreviews = useKeySelector('app.linkPreviews');

  // do not use link as state because FlashList in newsfeed cache component state
  const urls = useMemo(() => getUrlFromText(text, []), [text]);
  const link = urls?.[0];

  useEffect(() => {
    if (link && !linkPreviews?.[link]) {
      dispatch(appActions.getLinkPreview(link));
    }
  }, [link]);

  // link preview must have title at least
  if (!link || !linkPreviews?.[link]?.title) return null;

  const onPress = () => {
    openUrl(link);
  };

  const onClose = () => {
    setVisible(true);
  };

  if (!!visible) return null;

  return (
    <Button onPress={onPress}>
      <View style={styles.container}>
        {!!linkPreviews?.[link]?.image && (
          <Image
            style={styles.thumbnail}
            source={linkPreviews[link].image}
            placeholderSource={images.img_thumbnail_default}
          />
        )}
        <View style={styles.metadata}>
          <Text.BodyS numberOfLines={1} color={colors.neutral80}>
            {linkPreviews?.[link]?.domain}
          </Text.BodyS>
          <Text.H6 numberOfLines={2} style={styles.title}>
            {linkPreviews?.[link].title}
          </Text.H6>
        </View>
        {
          !!showClose
              && (
              <TouchableOpacity
                onPress={onClose}
                style={styles.buttonClose}
              >
                <Icon size={12} tintColor={colors.neutral40} icon="Xmark" />
              </TouchableOpacity>
              )
        }
      </View>
    </Button>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.neutral5,
      borderRadius: spacing.borderRadius.large,
      marginVertical: spacing.margin.small,
      marginHorizontal: spacing.margin.large,
    },
    metadata: {
      flex: 1,
      paddingHorizontal: spacing.padding.small,
      paddingVertical: spacing.padding.small,
    },
    thumbnail: {
      width: 92,
      height: 82,
      borderTopLeftRadius: spacing.borderRadius.large,
      borderBottomLeftRadius: spacing.borderRadius.large,
    },
    title: {
      marginTop: spacing.margin.small,
    },
    buttonClose: {
      position: 'absolute',
      zIndex: 2,
      borderRadius: spacing.borderRadius.circle,
      backgroundColor: colors.neutral2,
      top: 8,
      right: 8,
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

export default LinkPreviewer;
