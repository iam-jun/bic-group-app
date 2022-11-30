import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, {
  FC, useCallback, useRef, useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { SlideInLeft, SlideOutRight } from 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import { Button } from '~/baseComponents';
import Divider from '~/beinComponents/Divider';
import ImagePicker from '~/beinComponents/ImagePicker';
import StickerView from '~/components/StickerView';
import { uploadImage } from '~/helpers/article';
import { IGiphy } from '~/interfaces/IGiphy';
import { IGetFile } from '~/services/imageUploader';
import modalActions from '~/storeRedux/modal/actions';
import { borderRadius, margin, padding } from '~/theme/spacing';
import { Icon, IconBack, IconButton } from './components/Icon';
import InputModalView from './components/InputModalView';
import {
  Alignments, AlignType, Headings, HeadingType, Lists, ListType, MarkType, MarkUps,
} from './constant';

export interface ArticleFormatToolBarProps {
  onModalVisbleChanged: (visible: boolean) => void;
  toggleQuote: () => void;
  insertLink: (url: string, text: string) => void;
  insertImage: (url: string) => void;
  insertVideoEmbed: (url: string) => void;
  setAlign: (type: AlignType) => void;
  toggleMark: (type: MarkType) => void;
  toggleList: (type: ListType) => void;
  toggleHeading: (type: HeadingType) => void;
}

const ArticleFormatToolBar: FC<ArticleFormatToolBarProps> = ({
  onModalVisbleChanged,
  toggleQuote,
  insertLink,
  insertImage,
  insertVideoEmbed,
  setAlign,
  toggleMark,
  toggleList,
  toggleHeading,
}) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const stickerViewRef = useRef<any>();
  const dispatch = useDispatch();

  const [ovelayType, setOverlayType] = useState<''|'text'|'paragraph'>('');

  const onTextIconPress = () => setOverlayType('text');

  const onParagraphIconPress = () => setOverlayType('paragraph');

  const onBackIconPress = () => setOverlayType('');

  const openGallery = async () => {
    const image = await ImagePicker.openPickerSingle({
      mediaType: 'photo',
    });

    uploadImage({ file: image, dispatch, onSuccess: (file: IGetFile) => insertImage(file?.url) });
  };

  const openGiphy = () => {
    stickerViewRef?.current?.show?.('giphy', true);
  };

  const onGiphySelected = useCallback((gif: IGiphy) => {
    stickerViewRef?.current?.hide?.();
    insertImage(gif.url);
  }, []);

  const openModal = (type: 'link'|'video') => {
    dispatch(modalActions.showModal({
      isOpen: true,
      ContentComponent: <InputModalView
        type={type}
        insertLink={insertLink}
        insertVideoEmbed={insertVideoEmbed}
      />,
    }));
  };

  const openModalLink = () => openModal('link');
  const openModalVideo = () => openModal('video');

  const renderIconAlign = ([type, icon]) => <IconButton type={type} icon={icon} onPress={setAlign} />;
  const renderIconMark = ([type, icon]) => <IconButton type={type} icon={icon} onPress={toggleMark} />;
  const renderIconList = ([type, icon]) => <IconButton type={type} icon={icon} onPress={toggleList} />;
  const renderIconHeading = ([type, icon]) => <IconButton type={type} icon={icon} onPress={toggleHeading} />;

  const renderFormatHeading = () => {
    if (!ovelayType) return null;

    if (ovelayType === 'text') {
      return (
        <Animated.View
          style={[styles.container, styles.overlay]}
          entering={SlideInLeft}
          exiting={SlideOutRight}
        >
          <IconBack onPress={onBackIconPress} />
          {Object.entries(Headings).map(renderIconHeading)}
          <Divider horizontal style={styles.divider} />
          {Object.entries(Lists).map(renderIconList)}
          <IconButton icon="QuoteLeft" onPress={toggleQuote} />
        </Animated.View>
      );
    }

    if (ovelayType === 'paragraph') {
      return (
        <Animated.View
          style={[styles.container, styles.overlay]}
          entering={SlideInLeft}
          exiting={SlideOutRight}
        >
          <IconBack onPress={onBackIconPress} />
          {Object.entries(MarkUps).map(renderIconMark)}
          <Divider horizontal style={styles.divider} />
          {Object.entries(Alignments).map(renderIconAlign)}
        </Animated.View>
      );
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <Button style={styles.iconButton} onPress={onTextIconPress}>
          <Icon icon="Text" />
        </Button>
        <Divider horizontal style={styles.divider} />
        <Button style={styles.iconButton} onPress={onParagraphIconPress}>
          <Icon icon="Bold" />
          <Icon icon="Italic" />
          <Icon icon="Underline" />
        </Button>
        <Divider horizontal style={styles.divider} />
        <IconButton icon="Image" onPress={openGallery} />
        <IconButton icon="ClapperboardPlay" onPress={openModalVideo} />
        <IconButton icon="iconAddGif" onPress={openGiphy} />
        <Divider horizontal style={styles.divider} />
        <IconButton icon="Link" onPress={openModalLink} />
      </View>
      {renderFormatHeading()}
      <StickerView
        fullscreen
        stickerViewRef={stickerViewRef}
        onGiphySelected={onGiphySelected}
        onVisibleChanged={onModalVisbleChanged}
      />
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingHorizontal: padding.small,
      paddingVertical: padding.tiny,
      backgroundColor: colors.neutral,
      shadowRadius: 2,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowColor: 'rgba(0, 0, 0, 0.8)',
      elevation: 4,
    },
    overlay: {
      flexDirection: 'row',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    divider: {
      marginHorizontal: margin.small,
    },
    iconButton: {
      flexDirection: 'row',
      backgroundColor: colors.neutral2,
      padding: padding.xSmall,
      borderRadius: borderRadius.small,
    },

  });
};

export default ArticleFormatToolBar;
