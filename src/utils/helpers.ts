import path from 'path';

export const imageFileNameParser = (
  fullFileName: string,
  width: number | null,
  height: number | null,
): string => {
  const extractedFileName = getExtractedFileName(fullFileName);

  return `${extractedFileName.name}-${width ? 'w' + width : ''}${
    height && width ? 'x' : ''
  }${height ? 'h' + height : ''}${extractedFileName.ext}`;
};

export const getExtractedFileName = (
  fullFileName: string,
  ext: string | undefined = undefined,
): { name: string; ext: string } => {
  let _ext = ext ? ext : getFileExtension(fullFileName);
  return { name: fullFileName.replace(_ext, ''), ext: _ext };
};

export const getFileExtension = (fullFileName: string): string => {
  return path.extname(fullFileName);
};
