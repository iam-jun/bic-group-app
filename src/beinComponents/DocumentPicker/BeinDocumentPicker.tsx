import DocumentPicker from 'react-native-document-picker';

const BeinDocumentPicker = {
  openPicker: DocumentPicker.pick,
  openPickerSingle: DocumentPicker.pickSingle,
  openPickerMultiple: DocumentPicker.pickMultiple,
};

export const supportedTypes = [
  'ods',
  'odt',
  'htm',
  'html',
  'doc',
  'docx',
  'pdf',
  'txt',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'zip',
];

export default BeinDocumentPicker;
