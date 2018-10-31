/**
 *这是图片上传组件
 *添加日期:2018.01.04
 *添加人:shaw
 **/
import { Upload, Icon, message } from 'antd';
import React, { Component } from 'react';
import { TPostData,urlBase } from '../../utils/TAjax';


function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
    // console.log('文件file',file);
  const isJPG = file.type === 'image/jpeg'||file.type === 'image/png';
  if (!isJPG) {
    message.error('只支持jpg、png格式的图片!');
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
            imageUrl:'',
            // defaultUrl:this.props.defaultUrl
        }
    }
    componentWillReceiveProps(){
        this.setState?this.setState({imageUrl:''}):''
    }

    handleChange = (info) => {
        console.log('文件info',info);
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
              getBase64(info.file.originFileObj, imageUrl => {
                  // console.log("imageUrl",imageUrl);
                  this.setState({
                    imageUrl,
                    loading: false,
                  })
              }
            );
        }
        //修改后台接口后的更改
        let response=info.file.response;
        // console.log("onPathChange",this.props.onPathChange);
        if(response.obj&&response.obj.length&&this.props.onPathChange){
            this.props.onPathChange(response.obj[0]);
        }
        if(response.obj&&response.obj.length&&this.props.savePath){
            this.props.savePath(response.obj[0]);
        }
    }

    render(){
        // console.log('defaultUrl',this.props.defaultUrl);

        let defaultUrl=this.props.defaultUrl;
        const uploadButton = (
          <div>
            <Icon type={this.state.loading ? 'loading' : 'plus'} />
            <div className="ant-upload-text">Upload</div>
          </div>
        );
        const imageUrl = this.state.imageUrl;
        let Url = this.props.actionUrl;
        return (
            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action={urlBase+Url}
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
                onPreview={()=>console.log('预览')}
            >
                {
                    imageUrl!=''?<img height="200" src={imageUrl} alt="" />:
                    defaultUrl?<img height="200" src={urlBase+defaultUrl} alt="" /> :
                    uploadButton
                }
            </Upload>
        );
    }
}
