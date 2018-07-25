import React from 'react'
import 'webrtc-adapter'
import Message from 'Components/message'

export default class Setting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            audioInput: [],
            audioOutput: [],
            videoInput: [],
        }
    }
    render() {
        return (
            <div className="right d-flex flex-column">
                <div className="content">
                    <div className="title">系统设置</div>
                    <form>
                        <div className="form-group row">
                            <label className="col-md-2 col-form-label text-right">音频输入设备</label>
                            <div className="col-md-6">
                                <select className="form-control" ref={(audioInput) => {this.audioInput = audioInput}}>
                                    {this.state.audioInput.map(device => 
                                        <option key={device.id} value={device.id}>{device.name}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-md-2 col-form-label text-right">音频输出设备</label>
                            <div className="col-md-6">
                                <select className="form-control" ref={(audioOutput) => {this.audioOutput = audioOutput}}>
                                    {this.state.audioOutput.map(device => 
                                        <option key={device.id} value={device.id}>{device.name}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-md-2 col-form-label text-right">视频输入设备</label>
                            <div className="col-md-6">
                                <select className="form-control" ref={(videoInput) => {this.videoInput = videoInput}}>
                                    {this.state.videoInput.map(device => 
                                        (<option key={device.id} value={device.id}>{device.name}</option>)
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="offset-md-2 col-md-4">
                                <button className="btn btn-primary" type="button" onClick={this.onClick.bind(this)}>保存设置</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
    componentDidMount() {
        this.getDevices();
    }
    getDevices() {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            this.devices = devices;
            devices.forEach((device) => {
                switch (device.kind) {
                    case 'audioinput':
                        this.state.audioInput.push({
                            id: device.deviceId,
                            name: device.label
                        });
                        break;
                    case 'audiooutput':
                        this.state.audioOutput.push({
                            id: device.deviceId,
                            name: device.label
                        });
                        break;
                    case 'videoinput':
                        this.state.videoInput.push({
                            id: device.deviceId,
                            name: device.label
                        });
                        break;
                }
            });
            this.setState(this.state);
        }).catch((error) => {
            console.log('Devices Error:' + err.name + ": " + err.message);
        });
    }
    onClick() {
        let audioInput = this.audioInput.selectedOptions[0];
        if (audioInput) {
            localStorage.setItem('audioInput', audioInput.value);
        }

        let audioOutput = this.audioOutput.selectedOptions[0];
        if (audioOutput) {
            localStorage.setItem('audioOutput', audioOutput.value);
        }

        let videoInput = this.videoInput.selectedOptions[0];
        if (videoInput) {
            localStorage.setItem('videoInput', videoInput.value);
        }
        Message.success({
            content: '系统设置保存成功',
            duration: 3000
        });
    }
}