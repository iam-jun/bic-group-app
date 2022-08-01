import Clipboard from '@react-native-clipboard/clipboard';

import PropTypes from 'prop-types';
import React from 'react';
import {
  Keyboard, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import {
  changeOpacity,
  getDisplayNameForLanguage,
  makeStyleSheetFromTheme,
  preventDoubleTap,
} from '../utils/utils';
import CodeDetail from './CodeDetail';

const MAX_LINES = 5;

export default class MdCodeBlock extends React.PureComponent {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    language: PropTypes.string,
    content: PropTypes.string.isRequired,
    textStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
    showModal: PropTypes.func,
  };

  static defaultProps = {
    language: '',
  };

  handlePress = preventDoubleTap(() => {
    const { language, content } = this.props;
    const languageDisplayName = getDisplayNameForLanguage(language);
    let title;
    if (languageDisplayName) {
      title = `${languageDisplayName} Code`;
    } else {
      title = 'Code';
    }

    Keyboard.dismiss();

    this.props.showModal(
      <CodeDetail theme={this.props.theme} content={this.props.content} />,
      title,
    );
  });

  handleLongPress = async () => {
    Clipboard.setString(this.props.content);
    // const {formatMessage} = this.context.intl;
    //
    // const config = mattermostManaged.getCachedConfig();
    //
    // if (config?.copyAndPasteProtection !== 'true') {
    //   const cancelText = formatMessage({id: 'mobile.post.cancel', defaultMessage: 'Cancel'});
    //   const actionText = formatMessage({id: 'mobile.markdown.code.copy_code', defaultMessage: 'Copy Code'});
    //   BottomSheet.showBottomSheetWithOptions({
    //     options: [actionText, cancelText],
    //   }, (value) => {
    //     if (value !== 1) {
    //       this.handleCopyCode();
    //     }
    //   });
    // }
  };

  trimContent = (content) => {
    const lines = content.split('\n');
    const numberOfLines = lines.length;

    if (numberOfLines > MAX_LINES) {
      return {
        content: lines.slice(0, MAX_LINES).join('\n'),
        numberOfLines,
      };
    }

    return {
      content,
      numberOfLines,
    };
  };

  render() {
    const style = getStyleSheet(this.props.theme);

    let language = null;
    if (this.props.language) {
      const languageDisplayName = getDisplayNameForLanguage(
        this.props.language,
      );

      if (languageDisplayName) {
        language = (
          <View style={style.language}>
            <Text style={style.languageText}>{languageDisplayName}</Text>
          </View>
        );
      }
    }

    const { content, numberOfLines } = this.trimContent(this.props.content);

    let lineNumbers = '1';
    for (let i = 1; i < Math.min(numberOfLines, MAX_LINES); i++) {
      const line = (i + 1).toString();

      lineNumbers += `\n${line}`;
    }

    let plusMoreLines = null;
    if (numberOfLines > MAX_LINES) {
      plusMoreLines = (
        <Text style={style.plusMoreLinesText}>
          {`+${numberOfLines - MAX_LINES} more`}
        </Text>
      );
    }

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={this.handlePress}
        onLongPress={this.handleLongPress}
        type="opacity"
      >
        <View style={style.container}>
          <View style={style.lineNumbers}>
            <Text style={style.lineNumbersText}>{lineNumbers}</Text>
          </View>
          <View style={style.rightColumn}>
            <View style={style.code}>
              <Text style={[style.codeText, this.props.textStyle]}>
                {content}
              </Text>
            </View>
            {plusMoreLines}
          </View>
          {language}
        </View>
      </TouchableOpacity>
    );
  }
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => ({
  container: {
    overflow: 'hidden',
    borderColor: changeOpacity(theme.centerChannelColor, 0.15),
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
  },
  lineNumbers: {
    alignItems: 'center',
    backgroundColor: changeOpacity(theme.centerChannelColor, 0.05),
    borderRightColor: changeOpacity(theme.centerChannelColor, 0.15),
    borderRightWidth: StyleSheet.hairlineWidth,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingVertical: 4,
    width: 21,
  },
  lineNumbersText: {
    color: changeOpacity(theme.centerChannelColor, 0.5),
    fontSize: 12,
    lineHeight: 18,
  },
  rightColumn: {
    flexDirection: 'column',
    flex: 1,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  code: {
    flexDirection: 'row',
    overflow: 'scroll', // Doesn't actually cause a scrollbar, but stops text from wrapping
  },
  codeText: {
    color: changeOpacity(theme.centerChannelColor, 0.65),
    fontSize: 12,
    lineHeight: 18,
  },
  plusMoreLinesText: {
    color: changeOpacity(theme.centerChannelColor, 0.4),
    fontSize: 11,
    marginTop: 2,
  },
  language: {
    alignItems: 'center',
    backgroundColor: theme.sidebarHeaderBg,
    justifyContent: 'center',
    opacity: 0.8,
    padding: 6,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  languageText: {
    color: theme.sidebarHeaderTextColor,
    fontSize: 12,
  },
}));
