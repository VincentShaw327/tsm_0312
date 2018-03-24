/**
 *这是图片上传组件
 *添加日期:2018.01.04
 *添加人:shaw
 **/
import { Upload, Icon, message } from 'antd';
import React, { Component } from 'react';
// import { DoPost} from '../../server';


function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
    // console.log('文件file',file);
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('只能上传图片文件!');
  }
  const isLt2M = file.size / 1024 / 1024 < 1;
  if (!isLt2M) {
    message.error('图片文件必须小于1M');
  }
  return isJPG && isLt2M;
}

export default class Uploader extends Component{
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
        }
    }
/*    setPath(){
        let dat={
            UUID : 0,
            Path : "-"
        }
        DoPost(this.url, "UpdateImage", dat, function(res) {
            console.log('上传成功:',res);
        }, function(error) {
            message.info(error);
        })
    }*/
    handleChange = (info) => {
        console.log('文件info',info);
        // let str= eval("("+info.file.response+")");

        // let response= eval(`(${info.file.response})`);
        // console.log('res-result', response);

        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          getBase64(info.file.originFileObj, imageUrl => this.setState({
            imageUrl,
            loading: false,
          }));
        }
        /*if(response.result&&response.result === 'TRUE'){
            this.props.onPathChange(response.filepathname);
        }*/
        //修改后台接口后的更改
        let response=info.file.response;
        if(response.obj&&response.obj.length){
            this.props.onPathChange(response.obj[0]);
        }
    }

    render(){
        const uploadButton = (
          <div>
            <Icon type={this.state.loading ? 'loading' : 'plus'} />
            <div className="ant-upload-text">Upload</div>
          </div>
        );
        const imageUrl = this.state.imageUrl;
        let Url = this.props.actionUrl;
        // console.log('more tupian',imageUrl)
        return (
            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action={"http://localhost:52383"+Url}
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
            >
                {imageUrl ? <img height="200" src={imageUrl} alt="" /> : uploadButton}
            </Upload>
        );
    }
}
