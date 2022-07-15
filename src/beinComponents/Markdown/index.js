import React from 'react';
import {Dimensions, Platform, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux';

import Md from './Md';
import colors from '~/theme/theme';
import {mmTheme} from './utils/config';

import Header from '~/beinComponents/Header';
import modalActions from '~/store/modal/actions';
import {fontFamilies} from '~/theme/fonts';
import {sizes} from '~/theme/dimension';

const DeviceHeight = Dimensions.get('window').height;

const Markdown = ({value, ...rest}) => {
  const dispatch = useDispatch();
  const theme = mmTheme;
  const baseTextStyle = {
    color: '#282E53',
    fontFamily: fontFamilies.BeVietnamProLight,
  };
  const textStyles = {
    code: {
      alignSelf: 'center',
      backgroundColor: 'rgba(63,67,80,0.07)',
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
      color: '#d24b4e',
    },
    heading1: {
      fontSize: sizes.h3,
      fontFamily: fontFamilies.BeVietnamProSemiBold,
    },
    heading1Text: {
      paddingBottom: 8,
    },
    heading2: {
      fontSize: sizes.h4,
      fontFamily: fontFamilies.BeVietnamProSemiBold,
    },
    heading2Text: {
      paddingBottom: 8,
    },
    heading3: {
      fontSize: sizes.h5,
      fontFamily: fontFamilies.BeVietnamProSemiBold,
    },
    heading3Text: {
      paddingBottom: 8,
    },
    heading4: {
      fontSize: sizes.h5,
      fontFamily: fontFamilies.BeVietnamProSemiBold,
    },
    heading4Text: {
      paddingBottom: 8,
    },
    heading5: {
      fontSize: sizes.h5,
      fontFamily: fontFamilies.BeVietnamProSemiBold,
    },
    heading5Text: {
      paddingBottom: 8,
    },
    heading6: {
      fontSize: sizes.h5,
      fontFamily: fontFamilies.BeVietnamProSemiBold,
    },
    heading6Text: {
      paddingBottom: 8,
    },
    link: {
      color: '#386fe5',
    },
    mention: {
      color: '#386fe5',
      fontFamily: fontFamilies.BeVietnamProSemiBold,
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
              backgroundColor: theme.centerChannelBg,
              maxHeight: DeviceHeight,
            }}>
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
      theme={theme}
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
