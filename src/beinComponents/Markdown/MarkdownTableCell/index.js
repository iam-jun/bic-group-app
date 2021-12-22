import React from 'react';
import MdTableCell from './MdTableCell';
import {mmTheme} from '../utils/config';

const MarkdownTableCell = props => {
  return <MdTableCell theme={mmTheme} {...props} />;
};

export default MarkdownTableCell;
