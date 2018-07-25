import React from 'react'
import WhiteBoard from './whiteboard'
import Video from './video'
import Chat from './chat'
import Statusbar from './status'
import Modal from 'Common/components/modal'
import RTC from 'Common/libs/rtc'
import querystring from 'querystring'

export default class Classroom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: null,
            rtc: null,
            status: '正在连接服务器'
        };
    }

    render() {
        return (
            <div className="container-fluid d-flex flex-column classroom">
                <div className="d-flex flex-row main">
                    <WhiteBoard changeHandle={this.boardOnChange.bind(this)} clearHandle={this.boardOnClear.bind(this)}/>
                    <div className="d-flex flex-column sidebar">
                        <Video />
                        <Chat ref={chat => this.chat = chat} sendHandle={this.chatOnSend.bind(this)}/>
                    </div>
                </div>
                <Statusbar startShareHandle={this.shareOnStart.bind(this)} stopShareHandle={this.shareOnStop.bind(this)} videoHandle={this.videoHandle.bind(this)} micHandle={this.micHandle.bind(this)} sideHandle={this.sideHandle.bind(this)} classHandle={this.classHandle.bind(this)} status={this.state.status}/>
            </div>
        )
    }

    componentDidMount() {
        let data = JSON.parse(localStorage.getItem('room'));
        data.token = localStorage.getItem('auth_token');
        data.type = 'teacher';
        this.initRoom(data);
    }

    // 初始化教室
    initRoom(options) {
        let params = querystring.stringify(options);
        this.rtc = new RTC({
            url: 'http://edu.com:10800?' + params,
            video: {
                local: document.getElementById('local'),
                remote: document.getElementById('remote')
            },
            isCaller: true
        });

        // 事件处理
        this.rtc.eventHandle = (event, data) => {
            switch (event) {
                case 'chat':
                    this.chat.receiveMessage(data);
                    break;
                case 'socket_ready':
                    this.state.status = '等待学生加入';
                    break;
                case 'join':
                    this.state.status = '学生进入教室';
                    break;
                case 'reconnect_attempt':
                    this.state.status = '正在进行第' + data + '次重新连接';
                    break;
                case 'disconnect':
                    this.state.status = '学生断开连接';
                    break;
                case 'iceConnectionStateChange':
                    if (data == 'connected' || data == 'completed') {
                        this.state.status = '学生进入教室';
                    }
                    break;
            }
            this.setState(this.state);
        };

        // 错误信息处理
        this.rtc.errorHandle = (name, error) => {
            let message;
            switch (name) {
                case 'socket_error':
                    message = <div>连接服务器失败！<br/><br/>错误信息：{error}</div>;
                    break;
                case 'connect_error':
                    message = <div>连接服务器失败！<br/><br/>错误信息：{error.message}</div>;
                    break;
                case 'create_room_error':
                    message = <div>创建教室失败!<br/><br/>错误信息：{error.message}</div>;
                    break;
            }
            this.state.status = '发生错误';
            this.setState(this.state);
            Modal.confirm({
                title: '提示',
                content: message,
            });
        };
    }

    // 画板内容改变
    boardOnChange(data) {
        this.rtc.send('draw', data);
    }

    // 画板内容清除
    boardOnClear() {
        this.rtc.send('event', 'clear');
    }

    // 聊天内容发送
    chatOnSend(message) {
        this.rtc.send('chat', message);
    }

    // 开始共享窗口/屏幕
    shareOnStart(stream) {
        this.rtc.send('event', {type: 'share', id: stream.id});
        this.rtc.addStream(stream);
    }

    // 停止共享窗口/屏幕
    shareOnStop() {
        this.rtc.removeStream();
        this.rtc.send('event', 'stop-share');
    }

    // 开始/暂停/结束上课
    classHandle(type) {
        switch (type) {
            case 'start':
                this.state.status = '正在上课';
                break;
            case 'pause':
                this.state.status = '暂停休息';
                break;
            case 'stop':
                this.state.status = '上课结束';
                break;
        }
        this.setState(this.state);
        this.rtc.send('event', {type: 'class', event: type});
    }

    // 开启/关闭视频
    videoHandle(status) {
        this.rtc.videoSwitch();
    }

    // 开启/关闭麦克风
    micHandle(status) {
        this.rtc.audioSwitch();
    }

    // 显示/隐藏侧边栏
    sideHandle(status) {
        console.log(status);
    }
}