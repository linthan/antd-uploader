import { UploadderProps, signedResultType } from '../type';
import { uploadStorage } from './upload';
export const customSignRequestFactor = (
  props: UploadderProps,
  callbackWrapper?: (res: { url: string }) => void,
) => ({
  action,
  data,
  file,
  filename,
  headers,
  onError,
  onProgress,
  onSuccess,
  withCredentials,
}: any) => {
  const checkInfo = (_file: File) => {
    const { getSignedUrl } = props;
    getSignedUrl(_file, (signedResult: signedResultType) => {
      uploadStorage(
        _file,
        { signedUrl: signedResult.url },
        {
          onError,
          onProgress,
          onSuccess: (res: any) => {
            onSuccess({ url: signedResult.ut });
            if (callbackWrapper) callbackWrapper({ url: signedResult.ut });
          },
          withCredentials,
          uploadRequestHeaders: { ...signedResult.headers },
        },
      );
    });
  };
  checkInfo(file);
};
