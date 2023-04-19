import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, {
  FC, useCallback, useEffect, useRef, useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeInUp, SlideInLeft, SlideOutRight,
} from 'react-native-reanimated';
import { Button } from '~/baseComponents';
import Divider from '~/beinComponents/Divider';
import ImagePicker from '~/beinComponents/ImagePicker';
import StickerView from '~/components/StickerView';
import { useBaseHook } from '~/hooks';
import { IFilePicked } from '~/interfaces/common';
import { IGiphy } from '~/interfaces/IGiphy';
import useUploaderStore from '~/store/uploader';
import { borderRadius, margin, padding } from '~/theme/spacing';
import { Icon, IconBack, IconButton } from './components/Icon';
import InputModalView from './components/InputModalView';
import {
  Alignments, AlignType, Headings, HeadingType, Lists, ListType, MarkType, MarkUps,
} from './constant';
import { AppConfig } from '~/configs';
import { formatBytes } from '~/utils/formatter';
import showToast from '~/store/helper/showToast';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import useModalStore from '~/store/modal';
import { ResourceUploadType } from '~/interfaces/IUpload';

export interface ArticleFormatToolBarProps {
  onModalVisbleChanged: (visible: boolean) => void;
  toggleQuote: () => void;
  insertLink: (url: string, text: string) => void;
  insertImage: (url: string) => void;
  insertEmbed: (url: string) => void;
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
  insertEmbed,
  setAlign,
  toggleMark,
  toggleList,
  toggleHeading,
}) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const stickerViewRef = useRef<any>();

  const [selectedImage, setSelectedImage] = useState<IFilePicked>();
  const actions = useUploaderStore((state) => state.actions);
  const uploadedFile = useUploaderStore(useCallback(
    (state) => state.uploadedFiles[selectedImage?.name], [selectedImage],
  ));
  const uploadError = useUploaderStore(useCallback((state) => state.errors[selectedImage?.name], [selectedImage]));
  const modalActions = useModalStore((state) => state.actions);

  const [ovelayType, setOverlayType] = useState<''|'text'|'paragraph'>('');

  useEffect(() => {
    if (uploadedFile) {
      insertImage(uploadedFile?.url);
      setSelectedImage(null);
    }
  }, [uploadedFile]);

  useEffect(() => {
    if (uploadError) {
      const content = typeof uploadError === 'string' ? uploadError : t('post:error_upload_photo_failed');
      showToast({ content, type: ToastType.ERROR });
    }
  }, [uploadError]);

  const onTextIconPress = () => setOverlayType('text');

  const onParagraphIconPress = () => setOverlayType('paragraph');

  const onBackIconPress = () => setOverlayType('');

  const openGallery = async () => {
    const image = await ImagePicker.openPickerSingle({
      mediaType: 'photo',
    });
    if (image?.size > AppConfig.articlePhotoMaxSize) {
      const error = t('common:error:file:over_file_size').replace('{n}',
        formatBytes(AppConfig.articlePhotoMaxSize, 0));
      showToast({ content: error, type: ToastType.ERROR });
      return;
    }
    setSelectedImage(image);
    actions.uploadImage({ file: image, uploadType: ResourceUploadType.articleContent });
  };

  const openGiphy = () => {
    stickerViewRef?.current?.show?.('giphy', true);
  };

  const onGiphySelected = useCallback((gif: IGiphy) => {
    stickerViewRef?.current?.hide?.();
    insertImage(gif.url);
  }, []);

  const openModal = (type: 'link'|'embed') => {
    modalActions.showModal({
      isOpen: true,
      ContentComponent: <InputModalView
        type={type}
        insertLink={insertLink}
        insertEmbed={insertEmbed}
      />,
    });
  };

  const openModalLink = () => openModal('link');
  const openModalEmbed = () => openModal('embed');

  const renderIconAlign = ([type, icon]) => <IconButton type={type} icon={icon} onPress={setAlign} />;
  const renderIconMark = ([type, icon]) => <IconButton type={type} icon={icon} onPress={toggleMark} />;
  const renderIconList = ([type, icon]) => <IconButton type={type} icon={icon} onPress={toggleList} />;
  const renderIconHeading = ([type, icon]) => <IconButton type={type} icon={icon} onPress={toggleHeading} />;

  const renderFormatHeading = () => {
    if (!ovelayType) return null;

    if (ovelayType === 'text') {
      return (
        <Animated.View
          testID="article_format_toolbar.format_heading_text"
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
          testID="article_format_toolbar.format_heading_paragraph"
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
    <Animated.View entering={FadeInUp} testID="article_format_toolbar">
      <View style={styles.container}>
        <Button testID="article_format_toolbar.btn_icon" style={styles.iconButton} onPress={onTextIconPress}>
          <Icon icon="Text" />
        </Button>
        <Divider horizontal style={styles.divider} />
        <Button testID="article_format_toolbar.btn_paragraph" style={styles.iconButton} onPress={onParagraphIconPress}>
          <Icon icon="Bold" />
          <Icon icon="Italic" />
          <Icon icon="Underline" />
        </Button>
        <Divider horizontal style={styles.divider} />
        <IconButton testID="article_format_toolbar.btn_image" icon="Image" onPress={openGallery} />
        <IconButton testID="article_format_toolbar.btn_embed" icon="CodeSimple" onPress={openModalEmbed} />
        <IconButton icon="iconAddGif" onPress={openGiphy} />
        <Divider horizontal style={styles.divider} />
        <IconButton testID="article_format_toolbar.btn_link" icon="Link" onPress={openModalLink} />
      </View>
      {renderFormatHeading()}
      <StickerView
        fullscreen
        stickerViewRef={stickerViewRef}
        onGiphySelected={onGiphySelected}
        onVisibleChanged={onModalVisbleChanged}
      />
    </Animated.View>
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
