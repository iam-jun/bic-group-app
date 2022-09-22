import React from 'react';
import { Dimensions, Platform, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import Md from './Md';

import Header from '~/beinComponents/Header';
import modalActions from '~/storeRedux/modal/actions';
import { fontFamilies } from '~/theme/fonts';
import { sizes } from '~/theme/dimension';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

const DeviceHeight = Dimensions.get('window').height;

const Markdown = ({ value, ...rest }) => {
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const {colors} = theme;

  const baseTextStyle = {
    color: colors.neutral70,
    fontFamily: fontFamilies.BeVietnamProLight,
    fontSize: sizes.paragraphM,
  };
  const textStyles = {
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
      fontSize: sizes.h5,
      fontFamily: fontFamilies.BeVietnamProMedium,
    },
    heading5Text: {
      paddingBottom: 8,
    },
    heading6: {
      fontSize: sizes.h5,
      fontFamily: fontFamilies.BeVietnamProMedium,
    },
    heading6Text: {
      paddingBottom: 8,
    },
    link: {
      color: colors.blue50,
    },
    mention: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: sizes.bodyM,
      color: colors.purple50,
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
  };
  const blockStyles = {
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
  };

  const hideModal = () => dispatch(modalActions.hideModal());

  const showModal = (Component, title = '') => {
    dispatch(
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
      }),
    );
  };

  return (
    <Md
      autolinkedUrlSchemes={['http', 'https', 'ftp', 'mailto', 'tel']}
      mentionKeys={[]}
      minimumHashtagLength={10}
      theme={colors}
      value={value}
      baseTextStyle={baseTextStyle}
      blockStyles={blockStyles}
      textStyles={textStyles}
      showModal={showModal}
      {...rest}
    />
  );
};
Markdown.propTypes = {
  value: PropTypes.string,
};

export default Markdown;
