import React from 'react';
import MdTable from './MdTable';
import {mmTheme} from '../utils/config';

const MarkdownTable = props => {
  return <MdTable theme={mmTheme} {...props} />;
};

export default MarkdownTable;
