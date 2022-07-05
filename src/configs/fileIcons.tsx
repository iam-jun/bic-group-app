const getFileIcons = (extension: string) => {
  const ext = extension.toLowerCase();
  switch (ext) {
    case 'html':
    case 'htm':
      return 'ic_html';
    case 'doc':
    case 'docx':
    case 'odt':
      return 'ic_doc';
    case 'pdf':
      return 'ic_pdf';
    case 'xls':
    case 'xlsx':
    case 'ods':
      return 'ic_xls';
    case 'ppt':
    case 'pptx':
      return 'ic_ppt';
    case 'mov':
    case 'mp4':
      return 'ic_video';
    case 'zip':
      return 'ic_zip';
    default:
      return 'ic_default';
  }
};

export default getFileIcons;
