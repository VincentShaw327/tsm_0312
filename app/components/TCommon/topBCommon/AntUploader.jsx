/**
 *这是图片上传组件
 *添加日期:2018.01.04
 *添加人:shaw
 **/
import { Upload, Icon, message } from 'antd';
import React, { Component } from 'react';
import { DoPost} from '../../server';


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
            // imageUrl:this.props.defaultUrl
            // filepathname:'//'
        }
    }
    setPath(){
        let dat={
            UUID : 0,
            Path : "-"
        }
        DoPost(this.url, "UpdateImage", dat, function(res) {
            /*var list = [];
            // console.log( "查询到工作学习类别", res );
            var workstation_list = res.obj.objectlist || [];
            var totalCount = res.obj.totalcount;
            callback(list, {
                total: totalCount,
                nPageSize: 10
            })*/
        }, function(error) {
            message.info(error);
        })
    }
    handleChange = (info) => {
        console.log('文件info',info);
        // let str= eval("("+info.file.response+")");
        let response= eval(`(${info.file.response})`);
        console.log('res-result', response);

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
        // response:"{result:'TRUE',filepathname:'/images/636506818748799700_20151111090240_46206.jpg'}"
        if(response.result === 'TRUE'){
            // message.success( '更新成功!' );
            this.props.onPathChange(response.filepathname);
            /*let dat={
                UUID : 0,
                Path : response.filepathname
            }
            DoPost('http://demo.sc.mes.top-link.me/service/Handler_MoldModel_V1.ashx', "UpdateImage", dat, function(res) {
                console.log('路径设置成功',res);
            }, function(error) {
                message.info(error);
            })*/
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
                action={Url}
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
            >
                {imageUrl ? <img height="200" src={imageUrl} alt="" /> : uploadButton}
            </Upload>
        );
    }
}
