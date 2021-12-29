import React from 'react';
import {View} from 'react-native';
import AtMention from './AtMention';

export interface AutocompleteProps {
  groupIds: string;
  modalPosition: 'top' | 'bottom' | 'above-keyboard';
  showSpectialItems?: boolean;
  emptyContent?: string;
}

const Autocomplete = (props: AutocompleteProps) => {
  return (
    <View>
      <AtMention {...props} />
    </View>
  );
};

export default Autocomplete;
