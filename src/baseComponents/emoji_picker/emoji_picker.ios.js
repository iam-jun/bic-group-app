// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {
  KeyboardAvoidingView,
  View,
} from 'react-native';
import { KeyboardTrackingView } from 'react-native-keyboard-tracking-view';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmojiPickerBase, { getStyleSheetFromTheme, SCROLLVIEW_NATIVE_ID } from './emoji_picker_base';
import { SearchInput } from '../Input';
import { dimension } from '~/theme';

export default class EmojiPicker extends EmojiPickerBase {
  render() {
    const { testID, isLandscape, theme } = this.props;
    const { searchTerm } = this.state;
    const searchBarTestID = `${testID}.search_bar`;
    const styles = getStyleSheetFromTheme(theme);

    const shorten = dimension.isPhoneWithInsets && isLandscape ? 6 : 2;

    let keyboardOffset = dimension.isPhoneWithInsets ? 80 : 60;
    if (isLandscape) {
      keyboardOffset = dimension.isPhoneWithInsets ? 0 : 10;
    }

    return (
      <SafeAreaView
        style={{ flex: 1 }}
        edges={['left', 'right']}
      >
        <KeyboardAvoidingView
          behavior="padding"
          enabled={Boolean(searchTerm)}
          keyboardVerticalOffset={keyboardOffset}
          style={styles.flex}
        >
          <View
            testID={testID}
            style={styles.searchBar}
          >
            <SearchInput testID={searchBarTestID} value={searchTerm} />
          </View>
          <View style={[styles.container]}>
            {this.renderListComponent(shorten)}
            {!searchTerm
                        && (
                        <KeyboardTrackingView
                          scrollViewNativeID={SCROLLVIEW_NATIVE_ID}
                          normalList
                        >
                          <View style={styles.bottomContentWrapper}>
                            <View style={styles.bottomContent}>
                              {this.renderSectionIcons()}
                            </View>
                          </View>
                        </KeyboardTrackingView>
                        )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}
