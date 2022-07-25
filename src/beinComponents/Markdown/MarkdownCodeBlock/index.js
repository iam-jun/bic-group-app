import React from 'react';
import MdCodeBlock from './MdCodeBlock';
import { mmTheme } from '../utils/config';

const MarkdownCodeBlock = (props) => <MdCodeBlock theme={mmTheme} {...props} />;

export default MarkdownCodeBlock;
