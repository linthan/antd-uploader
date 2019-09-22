import { UploadProps } from 'antd/es/upload';
export interface UploadderProps extends UploadProps {
  getSignedUrl: (file: File, callback?: (signedResult: signedResultType) => void) => {};
  callback?: (data: any) => void;
}

export interface signedResultType {
  url: string;
  ut: string;
  headers?: any;
}
