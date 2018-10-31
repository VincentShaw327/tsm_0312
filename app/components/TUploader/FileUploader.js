/*
  作者：Perkin_
  链接：https://www.jianshu.com/p/0d1421df0e0d
  來源：简书
  著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Upload, Icon, Button, Progress,Checkbox, Modal, Spin, Radio, message } from 'antd';
import SparkMD5 from 'spark-md5';
const confirm = Modal.confirm
const Dragger = Upload.Dragger

class FileUpload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      preUploading:false,   //预处理
      chunksSize:0,   // 上传文件分块的总个数
      currentChunks:0,  // 当前上传的队列个数 当前还剩下多少个分片没上传
      uploadPercent:-1,  // 上传率
      preUploadPercent:-1, // 预处理率
      uploadRequest:false, // 上传请求，即进行第一个过程中
      uploaded:false, // 表示文件是否上传成功
      uploading:false, // 上传中状态
    }
  }

  showConfirm = () => {
    const _this = this
    confirm({
      title: '是否提交上传?',
      content: '点击确认进行提交',
      onOk() {
        _this.preUpload()
      },
      onCancel() { },
    })
  }

  preUpload = ()=>{
   // requestUrl,返回可以上传的分片队列
   //...
  }

  handlePartUpload = (uploadList)=>{
   // 分片上传
   // ...
  }
  render() {
    const {preUploading,uploadPercent,preUploadPercent,uploadRequest,uploaded,uploading} = this.state
    const _this = this
    const uploadProp = {
        name: 'file',
        // multiple: true,
        // action: '//jsonplaceholder.typicode.com/posts/',
        // action: '/api/tupload/do',
        action: 'http://localhost:9000/api/tupload/do',
        onRemove: (file) => {
          this.setState(({ fileList }) => {
            const index = fileList.indexOf(file)
            const newFileList = fileList.slice()
            newFileList.splice(index, 1)
            return {
              fileList: newFileList,
            }
          })
        },
        onChange:(info)=>{
            console.log("文件上传中 info",info);
        },
        beforeUpload: (file) => {
            console.log("beforeUpload file",file);

          // 首先清除一下各种上传的状态
          this.setState({
            uploaded:false,   // 上传成功
            uploading:false,  // 上传中
            uploadRequest:false   // 上传预处理
          })
          // 兼容性的处理
          let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
            chunkSize = 1024*1024*5,                             // 切片每次5M
            chunks = Math.ceil(file.size / chunkSize),
            currentChunk = 0, // 当前上传的chunk
            spark = new SparkMD5.ArrayBuffer(),
            // 对arrayBuffer数据进行md5加密，产生一个md5字符串
            chunkFileReader = new FileReader(),  // 用于计算出每个chunkMd5
            totalFileReader = new FileReader()  // 用于计算出总文件的fileMd5

          let params = {chunks: [], file: {}},   // 用于上传所有分片的md5信息
              arrayBufferData = []              // 用于存储每个chunk的arrayBuffer对象,用于分片上传使用
          params.file.fileName = file.name
          params.file.fileSize = file.size

          totalFileReader.readAsArrayBuffer(file)
          totalFileReader.onload = function(e){
              console.log("totalFile成功readAsArrayBuffer",e);
              // 对整个totalFile生成md5
              spark.append(e.target.result)
              params.file.fileMd5 = spark.end() // 计算整个文件的fileMd5
              console.log("totalFile成功生成MD5",params);
            }

          chunkFileReader.onload = function (e) {
              console.log("chunkFile成功readAsArrayBuffer",e);
            // 对每一片分片进行md5加密
            spark.append(e.target.result)
            // 每一个分片需要包含的信息
            let obj = {
              chunk:currentChunk + 1,
              start:currentChunk * chunkSize, // 计算分片的起始位置
              end:((currentChunk * chunkSize + chunkSize) >= file.size) ? file.size : currentChunk * chunkSize + chunkSize, // 计算分片的结束位置
              chunkMd5:spark.end(),
              chunks
            }
            // 每一次分片onload,currentChunk都需要增加，以便来计算分片的次数
            currentChunk++;
            params.chunks.push(obj)

            // 将每一块分片的arrayBuffer存储起来，用来partUpload
            let tmp = {
              chunk:obj.chunk,
              currentBuffer:e.target.result
            }
            arrayBufferData.push(tmp)

            if (currentChunk < chunks) {
              // 当前切片总数没有达到总数时
              loadNext()

              // 计算预处理进度
              _this.setState({
                preUploading:true,
                preUploadPercent:Number((currentChunk / chunks * 100).toFixed(2))
              })
            }
            else {
                console.log("md5加密完成 arrayBufferData",arrayBufferData);
                console.log("解析 看看", arrayBufferData[0].currentBuffer); //JSON.parse()
              //记录所有chunks的长度
              params.file.fileChunks = params.chunks.length
              // 表示预处理结束，将上传的参数，arrayBuffer的数据存储起来
              _this.setState({
                preUploading:false,
                uploadParams:params,
                arrayBufferData,
                chunksSize:chunks,
                preUploadPercent:100
              })
            }
          }

          chunkFileReader.onerror = function () {
            console.warn('oops, something went wrong.');
          };

          function loadNext() {
            var start = currentChunk * chunkSize,
              end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
            // fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
            chunkFileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
          }

          loadNext()

          // 只允许一份文件上传
          this.setState({
            fileList: [file],
            file: file
          })
          return false
        },
        fileList: this.state.fileList,
    }

    return (
      <div className="content-inner">
        <Spin tip={
              <div >
                <h3 style={{margin:'10px auto',color:'#1890ff'}}>文件预处理中...</h3>
                <Progress width={80} percent={preUploadPercent} type="circle" status="active" />
              </div>
              }
              spinning={preUploading}
              style={{ height: 350 }}>
          <div style={{ marginTop: 16, height: 250 }}>
            <Dragger {...uploadProp}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">点击或者拖拽文件进行上传</p>
              <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
            </Dragger>
            {uploadPercent>=0&&!!uploading&&<div style={{marginTop:20,width:'95%'}}>
              <Progress percent={uploadPercent} status="active" />
              <h4>文件上传中，请勿关闭窗口</h4>
            </div>}
            {!!uploadRequest&&<h4 style={{color:'#1890ff'}}>上传请求中...</h4>}
            {!!uploaded&&<h4 style={{color:'#52c41a'}}>文件上传成功</h4>}
            <Button type="primary" onClick={this.showConfirm} disabled={!!(this.state.preUploadPercent <100)}>
                <Icon type="upload" />提交上传
             </Button>
          </div>
        </Spin>
      </div>
    )
  }
}

FileUpload.propTypes = {
  //...
}
export default FileUpload
