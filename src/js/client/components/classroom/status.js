import React from 'react'
import PropTypes from 'prop-types'
import Windows from './windows'

export default class Status extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            windows: {
                show: false,
                status: false,
                text: '屏幕/窗口共享',
            },
            start: false,
            pause: false,
            time: '00:00',
            mic: true,
            video: true,
            side: true
        };
        this.timer = null;
        this.time = 0;
    }

    render() {
        return (
            <div className="fixed-bottom d-flex flex-row status">
                <div className="position-relative content">
                    <span className="d-inline-block" onClick={this.windowsToggle.bind(this)}>
                        <i className="fa fa-desktop"></i> {this.state.windows.text}
                    </span>
                    {(!this.state.start || this.state.pause) && 
                        <span className="d-inline-block" onClick={this.startClass.bind(this)}>
                            <i className="fa fa-play"></i> {this.state.start ? '继续上课' : '开始上课'}
                        </span>
                    }
                    {(this.state.start && !this.state.pause  ) && 
                        <span className="d-inline-block" onClick={this.pauseClass.bind(this)}>
                            <i className="fa fa-pause"></i> 暂停休息
                        </span>
                    }
                    {this.state.start && 
                        <span className="d-inline-block" onClick={this.stopClass.bind(this)}>
                            <i className="fa fa-stop"></i> 上课结束
                        </span>
                    }
                    {this.state.start && 
                        <span className="d-inline-block text">
                        上课计时: {this.state.time}
                        </span>
                    }
                    <span className="d-inline-block text">
                        状态: {this.props.status}
                    </span>
                    {this.state.windows.show && <Windows streamHandle={this.streamHandle.bind(this)}/>}
                </div>
                <div className="text-right ctrl">
                    <span className="d-inline-block" onClick={this.videoToggle.bind(this)}>
                        <i className="material-icons video">{this.state.video ? 'videocam' : 'videocam_off'}</i>
                    </span>
                    <span className="d-inline-block" onClick={this.micToggle.bind(this)}>
                        <i className="material-icons mic">{this.state.mic ? 'mic' : 'mic_off'}</i>
                    </span>
                    <span className="d-inline-block" onClick={this.sideToggle.bind(this)}>
                        <i className="material-icons side">{this.state.side ? 'chevron_right' : 'chevron_left'}</i>
                    </span>
                </div>
            </div>
        )
    }

    // 显示/隐藏/关闭共享
    windowsToggle() {
        this.state.windows.show = !this.state.windows.show;
        // 停止屏幕/窗口共享
        if (this.state.windows.status) {
            this.state.windows.show = false;
            this.state.windows.status = false;
            this.state.windows.text = '屏幕/窗口共享';
            this.props.stopShareHandle();
        }
        this.setState(this.state);
    }

    // 选中共享窗口
    streamHandle(stream) {
        if (stream) {
            // 开始共享
            this.props.startShareHandle(stream);
            this.state.windows.show = false;
            this.state.windows.status = true;
            this.state.windows.text = '关闭屏幕/窗口共享';
            this.setState(this.state);
        }
    }

    // 开始上课
    startClass() {
        if (this.state.pause) {
            // 继续上课
            this.state.pause = false;
        } else {
            // 开始上课
            this.time = 0;
            this.state.start = true;
        }
        this.setState(this.state);
        this.timer = setInterval(() => {
            this.time++;
            let m = Math.floor(this.time / 60);
            let s = this.time - m * 60;
            if (m < 10) {
                m = '0' + m;
            }
            if (s < 10) {
                s = '0' + s;
            }
            this.state.time = m + ':' + s;
            this.setState(this.state);
        }, 1000);
        this.props.classHandle('start');
    }

    // 暂停上课
    pauseClass() {
        clearInterval(this.timer);
        this.state.pause = true;
        this.setState(this.state);
        this.props.classHandle('pause');
    }

    // 结束上课
    stopClass() {
        clearInterval(this.timer);
        this.time = 0;
        this.state.start = false;
        this.state.pause = false;
        this.state.time = '00:00';
        this.setState(this.state);
        this.props.classHandle('stop');
    }

    // 开启/关闭摄像头
    videoToggle() {
        this.state.video = !this.state.video;
        this.setState(this.state);
        this.props.videoHandle(this.state.video);
    }

    // 开启/关闭麦克风
    micToggle() {
        this.state.mic = !this.state.mic;
        this.setState(this.state);
        this.props.micHandle(this.state.mic);
    }

    // 显示/隐藏侧边栏
    sideToggle() {
        this.state.side = !this.state.side;
        this.setState(this.state);
        this.props.sideHandle(this.state.side);
    }
}

Status.propTypes = {
    startShareHandle: PropTypes.func.isRequired,
    stopShareHandle: PropTypes.func.isRequired,
    videoHandle: PropTypes.func.isRequired,
    micHandle: PropTypes.func.isRequired,
    sideHandle: PropTypes.func.isRequired,
    classHandle: PropTypes.func.isRequired,
}