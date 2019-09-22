import React, { PureComponent } from 'react';
import Uploader from '../index';
import { Button, Icon, Tooltip } from 'antd';
import { getSignedUrl } from './test';
import './antd.css';

class TestDemo extends PureComponent<any, any> {
  state = {
    listPic: [],
  };

  render() {
    const { listPic } = this.state;
    return (
      <Uploader
        fileList={listPic}
        getSignedUrl={getSignedUrl}
        listType="picture"
        callback={data => {
          console.log('upload suc', data);
        }}
        onChange={e => {
          console.log('--------', e);
          let tmpList;
          if (Array.isArray(e)) {
            tmpList = e;
          } else {
            tmpList = e && e.fileList;
          }

          tmpList = tmpList.map(file => {
            const tmp = file;
            if (file.response) {
              // Component will show file.url as link
              tmp.url = file.response.url;
              if (tmp.url) {
                tmp.name = tmp.url.substring(tmp.url.lastIndexOf('/') + 1);
              } else {
                tmp.name = '';
              }
            }
            return tmp;
          });
          this.setState({ listPic: tmpList });
        }}
      >
        <Button style={{ marginRight: 6 }}>
          <Icon type="upload" /> 点击上传
        </Button>
        <Tooltip placement="topLeft" title="确认图片尺寸">
          <Icon type="info-circle" theme="outlined" />
        </Tooltip>
      </Uploader>
    );
  }
}
export default TestDemo;
