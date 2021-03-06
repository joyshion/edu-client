import React from 'react'
import ReactDOM from 'react-dom'

class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            class: 'message ' + this.props.enter
        };
        this.count = 0;
    }
    render() {
        return (
            <div ref={div => this.div = div}
                className={this.state.class}
                onAnimationEnd={this.onAnimationEnd.bind(this)}>
                <div className={'message_content message_' + this.props.type}>
                    {this.props.children}
                </div>
            </div>
        );
    }
    componentDidMount() {
        this.state.count = document.querySelectorAll('.message').length;
        this.setState(this.state);
    }
    componentWillUnmount() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }
    onAnimationEnd(e) {
        // 如果是进场动画结束
        if (this.div.classList.contains(this.props.enter)) {
            // 如果指定了持续时间，倒计时后执行出场动画
            if (this.props.duration > 0) {
                this.timeout = setTimeout(() => {
                    this.state.class = 'message ' + this.props.leave;
                    this.setState(this.state);
                }, this.props.duration);
            }
        }
        // 如果是出场动画结束
        if (this.div.classList.contains(this.props.leave)) {
            this.props.closeHandle();
        }
    }
}

// 正在显示的message
let messages = [];

Message.show = (type, options) => {
    Message.closeAll();
    let div = document.createElement('div');
    // 如果有指定节点，则插入该节点下，否则插入到body节点下
    if (options.container) {
        options.container.appendChild(div);
    } else {
        document.body.appendChild(div);
    }
    let closeHandle = () => {
        let index = messages.findIndex(n => {
            return n == div;
        });
        if (index > -1) {
            messages.splice(index, 1);
        }
        ReactDOM.unmountComponentAtNode(div);
        div.parentNode.removeChild(div);
    };
    let icon;
    switch(type) {
        case 'success':
            icon = 'check_circle';
            break;
        case 'info':
            icon = 'info';
            break;
        case 'warning':
            icon = 'warning';
            break;
        case 'error':
            icon = 'error';
            break;
    }
    ReactDOM.render(
        <Message type={type} enter="sidein" leave="sideout" duration={options.duration} closeHandle={closeHandle}>
            <i className="material-icons">{icon}</i>
            <span>{options.content}</span>
        </Message>
    , div);
}

Message.success = options => {
    Message.show('success', options);
}

Message.info = options => {
    Message.show('info', options);
}

Message.warning = options => {
    Message.show('warning', options);
}

Message.error = options => {
    Message.show('error', options);
}

Message.close = message => {
    try {
        ReactDOM.unmountComponentAtNode(message);
        message.parentNode.removeChild(message);
    } catch (e) {
        console.log(e);
    }
}

Message.closeAll = () => {
    messages.map((n, i) => {
        messages.splice(i, 1);
        Message.close(n);
    });
}

export default Message;