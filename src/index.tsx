import React from 'react';
import { Upload } from 'antd';
import { UploadderProps } from './type';
import { customSignRequestFactor } from './util/req';

const Uploader: React.FC<UploadderProps> = function(props) {
  const { children, callback } = props;
  return (
    <Upload customRequest={customSignRequestFactor(props, callback)} {...props}>
      {children}
    </Upload>
  );
};

export default Uploader;
