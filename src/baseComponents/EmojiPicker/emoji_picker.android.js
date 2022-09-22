// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import { View } from 'react-native';

import EmojiPickerBase, { getStyleSheetFromTheme } from './emoji_picker_base';

export default class EmojiPicker extends EmojiPickerBase {
  render() {
    const { testID, theme } = this.props;
    const { searchTerm } = this.state;
    const searchBarTestID = `${testID}.search_bar`;
    const styles = getStyleSheetFromTheme(theme);

    return (
      <>
        <View
          testID={testID}
          style={styles.searchBar}
        >
          {/* <SearchInput
            testID={searchBarTestID}
            value={searchTerm}
            onChangeText={this.changeSearchTerm}
          /> */}
        </View>
        <View style={styles.container}>
          {this.renderListComponent(2)}
          {/* {!searchTerm
            && (
            <View style={styles.bottomContentWrapper}>
              <View style={styles.bottomContent}>
                {this.renderSectionIcons()}
              </View>
            </View>
            )} */}
        </View>
      </>
    );
  }
}
