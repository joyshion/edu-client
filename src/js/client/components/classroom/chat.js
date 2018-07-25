import React from 'react'
import PropTypes from 'prop-types'

export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    render() {
        return (
            <div className="d-flex flex-column chat">
                <div ref={list => this.list = list} className="list">
                    <ul className="list-unstyled">
                        {this.state.data.map(message =>
                        <li key={message.id} className={message.type}>
                            <span className="name">{message.type == 'local' ? '我' : message.user}</span>
                            <p>{message.text}</p>
                            <em>{message.time}</em>
                        </li>
                        )}
                    </ul>
                </div>
                <div className="input-group send">
                    <input ref={input => this.input = input} type="text" className="form-control" placeholder="文字消息"/>
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" onClick={this.sendMessage.bind(this)}>发送</button>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        // 取登录数据
        this.data = JSON.parse(localStorage.getItem('data'));
        // 发送消息
        this.input.addEventListener('keyup', this.keyHandle.bind(this), false);
    }

    componentDidUpdate() {
        // 消息列表滚动永远在最下面
        this.list.scrollTop = this.list.scrollHeight;
    }

    // 接收消息
    receiveMessage(message) {
        message.type = 'remote';
        this.state.data.push(message);
        this.setState(this.state);
    }

    // 发送消息
    sendMessage() {
        if (this.input.value != '') {
            let message = {
                id: this.getTimestamp(),
                type: 'local',
                user: this.data.profile.name,
                text: this.input.value,
                time: this.getTime(),
            };
            this.props.sendHandle(message);
            this.input.value = '';
            this.state.data.push(message);
            this.setState(this.state);
        }
    }

    // 获取当前时间(时:分:秒)
    getTime() {
        let date = new Date();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        if (hour < 10) {
            hour = '0' + hour;
        }
        if (minute < 10) {
            minute = '0' + minute;
        }
        if (second < 10) {
            second = '0' + second;
        }
        return hour + ':' + minute + ':' + second;
    }

    // 获取当前时间戳
    getTimestamp() {
        return new Date().getTime();
    }

    // 回车按键发送消息
    keyHandle(e) {
        if (e.keyCode == 13) {
            this.sendMessage();
        }
    }
}

Chat.propTypes = {
    sendHandle: PropTypes.func.isRequired
}