import PropTypes from 'prop-types';
import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { makeStyleSheetFromTheme } from '../utils/utils';
import { CODE_FONT_FAMILY } from '../utils/config';

export default class CodeDetail extends React.PureComponent {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    content: PropTypes.string.isRequired,
  };

  countLines = (content) => content.split('\n').length;

  render() {
    const style = getStyleSheet(this.props.theme);

    const numberOfLines = this.countLines(this.props.content);
    let lineNumbers = '1';
    for (let i = 1; i < numberOfLines; i++) {
      const line = (i + 1).toString();

      lineNumbers += `\n${line}`;
    }

    let lineNumbersStyle;
    if (numberOfLines >= 10) {
      lineNumbersStyle = [style.lineNumbers, style.lineNumbersRight];
    } else {
      lineNumbersStyle = style.lineNumbers;
    }

    let textComponent;
    if (Platform.OS === 'ios') {
      textComponent = (
        <TextInput
          allowFontScaling
          editable={false}
          multiline
          value={this.props.content}
          style={[style.codeText]}
          // keyboardAppearance={getKeyboardAppearanceFromTheme(this.props.theme)}
        />
      );
    } else {
      textComponent = (
        <Text selectable style={style.codeText}>
          {this.props.content}
        </Text>
      );
    }

    return (
      <View edges={['bottom', 'left', 'right']} style={style.scrollContainer}>
        <ScrollView
          style={[style.scrollContainer]}
          contentContainerStyle={style.container}
        >
          <View style={lineNumbersStyle}>
            <Text style={style.lineNumbersText}>{lineNumbers}</Text>
          </View>
          <ScrollView
            style={style.codeContainer}
            contentContainerStyle={style.code}
            horizontal
          >
            <TouchableOpacity activeOpacity={1}>
              {textComponent}
            </TouchableOpacity>
          </ScrollView>
        </ScrollView>
      </View>
    );
  }
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => ({
  scrollContainer: {
    flex: 1,
  },
  container: {
    minHeight: '100%',
    flexDirection: 'row',
  },
  lineNumbers: {
    alignItems: 'center',
    backgroundColor: theme.gray5,
    borderRightColor: theme.gray50,
    borderRightWidth: StyleSheet.hairlineWidth,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  lineNumbersRight: {
    alignItems: 'flex-end',
  },
  lineNumbersText: {
    color: theme.gray50,
    fontSize: 12,
    lineHeight: 18,
  },
  codeContainer: {
    flexGrow: 0,
    flexShrink: 1,
    width: '100%',
  },
  code: {
    paddingHorizontal: 6,
    ...Platform.select({
      android: {
        paddingVertical: 4,
      },
      ios: {
        top: -4,
      },
    }),
  },
  codeText: {
    color: theme.gray50,
    fontFamily: CODE_FONT_FAMILY,
    fontSize: 12,
    lineHeight: 18,
    ...Platform.select({
      ios: {
        margin: 0,
        padding: 0,
      },
    }),
  },
}));
