const getFileIcons = (extension: string) => {
  const ext = extension.toLowerCase();
  switch (ext) {
    case 'html':
    case 'htm':
      return 'FileCode';
    case 'doc':
    case 'docx':
    case 'odt':
      return 'FileWord';
    case 'pdf':
      return 'FilePdf';
    case 'xls':
    case 'xlsx':
    case 'ods':
      return 'FileExcel';
    case 'ppt':
    case 'pptx':
      return 'FilePowerpoint';
    case 'txt':
      return 'FileLines';
    case 'mp3':
    case 'wav':
      return 'FileAudio';
    case 'mov':
    case 'mp4':
      return 'FileVideo';
    case 'zip':
      return 'FileZipper';
    case 'csv':
      return 'FileCsv';
    default:
      return 'File';
  }
};

export default getFileIcons;
