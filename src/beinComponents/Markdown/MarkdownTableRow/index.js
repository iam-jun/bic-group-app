import React from 'react';
import MdTableRow from './MdTableRow';
import {mmTheme} from '../utils/config';

const MarkdownTableRow = props => {
  return <MdTableRow theme={mmTheme} {...props} />;
};

export default MarkdownTableRow;
