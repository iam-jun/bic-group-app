import React, { memo, useMemo } from 'react';
import { Dimensions, Platform, StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import Md from './Md';

import Header from '~/beinComponents/Header';
import { fontFamilies } from '~/theme/fonts';
import { sizes } from '~/theme/dimension';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { isEqual } from 'lodash';
import useModalStore from '~/store/modal';

const DeviceHeight = Dimensions.get('window').height;

interface Props {
  value?: string;
  limitMarkdownTypes?: boolean;
  [x: string]: any;
  paragraphStyles?: StyleProp<ViewStyle>;
}

const _Markdown = ({ value, limitMarkdownTypes, ...rest }: Props) => {
  const theme: ExtendedTheme = useTheme();
  const {colors} = theme;
  const styles = useMemo(()=> createStyles(theme), [theme]);
  const modalActions = useModalStore((state) => state.actions);

  const hideModal = () => modalActions.hideModal();

  const showModal = (Component, title = '') => {
    modalActions.showModal({
      isOpen: true,
      ContentComponent: (
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flex: 1,
            backgroundColor: colors.white,
            maxHeight: DeviceHeight,
          }}
        >
          <Header
            disableInsetTop={Platform.OS === 'android'}
            onPressBack={hideModal}
            title={title}
          />
          {Component}
        </TouchableOpacity>
      ),
      useAppBottomSheet: false,
    });
  };

  const _textStyles = limitMarkdownTypes ? styles.texts : {...styles.texts, ...styles.headings};

  return (
    <Md
      autolinkedUrlSchemes={['http', 'https', 'ftp', 'mailto', 'tel']}
      mentionKeys={[]}
      minimumHashtagLength={10}
      theme={colors}
      value={value}
      baseTextStyle={styles.baseText}
      blockStyles={styles.blocks}
      textStyles={_textStyles}
      limitMarkdownTypes={limitMarkdownTypes}
      showModal={showModal}
      {...rest}
    />
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const {colors } = theme;
  return {
    baseText: {
      color: colors.neutral70,
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.mdParagraph,
    },
    headings: {
      heading1: {
        fontSize: sizes.mdH1,
        fontFamily: fontFamilies.BeVietnamProMedium,
      },
      heading1Text: {
        paddingBottom: 8,
      },
      heading2: {
        fontSize: sizes.mdH2,
        fontFamily: fontFamilies.BeVietnamProMedium,
      },
      heading2Text: {
        paddingBottom: 8,
      },
      heading3: {
        fontSize: sizes.mdH3,
        fontFamily: fontFamilies.BeVietnamProMedium,
      },
      heading3Text: {
        paddingBottom: 8,
      },
      heading4: {
        fontSize: sizes.mdH4,
        fontFamily: fontFamilies.BeVietnamProMedium,
      },
      heading4Text: {
        paddingBottom: 8,
      },
      heading5: {
        fontSize: sizes.mdParagraph,
        fontFamily: fontFamilies.BeVietnamProMedium,
      },
      heading5Text: {
        paddingBottom: 8,
      },
      heading6: {
        fontSize: sizes.mdParagraph,
        fontFamily: fontFamilies.BeVietnamProMedium,
      },
      heading6Text: {
        paddingBottom: 8,
      },
    },
    texts: {
      code: {
        alignSelf: 'center',
        backgroundColor: colors.gray1,
        fontFamily: fontFamilies.JetBrainsMono,
      },
      codeBlock: {
        fontFamily: fontFamilies.JetBrainsMono,
      },
      del: {
        textDecorationLine: 'line-through',
      },
      emph: {
        fontFamily: fontFamilies.BeVietnamProLightItalic,
      },
      error: {
        color: colors.danger,
      },
    
      link: {
        color: colors.blue50,
      },
      mention: {
        fontFamily: fontFamilies.BeVietnamProLight,
        fontSize: sizes.mdParagraph,
        color: colors.blue50,
      },
      mention_highlight: {
        backgroundColor: '#ffd470',
        color: '#1b1d22',
      },
      strong: {
        fontWeight: 'bold',
      },
      table_header_row: {
        fontWeight: '700',
      },
    },
    blocks: {
      adjacentParagraph: {
        marginTop: 6,
      },
      horizontalRule: {
        backgroundColor: '#3f4350',
        height: 0.2857142857142857,
        marginVertical: 10,
      },
      quoteBlockIcon: {
        color: 'rgba(63,67,80,0.5)',
      },
    }
  };
}

function propsAreEqual(
  prev: any, next: any,
) {
  return isEqual(
    prev, next,
  );
}

const Markdown = memo(_Markdown, propsAreEqual);
Markdown.whyDidYouRender = true;
export default Markdown;
