import React from 'react'
import PropTypes from 'prop-types'
import Board from './board'
import Tools from './tools'

export default class WhiteBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tools: {
                type: null,
                width: 2,
                fontSize: 16,
                color: '#000000',
            },
            board: {
                history: []
            },
        };
    }

    render() {
        return (
            <div className="position-relative whiteboard">
                <Board ref={(whiteboard) => {this.whiteboard = whiteboard}} tools={this.state.tools} historyHandle={this.saveBoardHistory.bind(this)} toolsHandle={this.toolsHandle.bind(this)}/>
                <Tools state={this.state.tools} clickHandle={this.toolsHandle.bind(this)}/>
            </div>
        )
    }
    componentDidMount() {
        this.whiteboard.onChange = () => {
            this.boardChange({data: this.whiteboard.getImage()});
        };
    }
    // 工具条监听
    toolsHandle(name, value) {
        if (name == 'type' && value == 'revoke') {
            // 撤销
            this.doRevoke();
        } else if(name == 'type' && value == 'clear') {
            // 清空操作
            this.whiteboard.clearContext(true);
            this.state.board.history.splice(0, this.state.board.history.length);
            this.props.clearHandle();
        } else {
            this.state.tools[name] = value;
            if (name == 'fontSize') {
                this.state.tools.type = 'text';
            }
            this.setState(this.state);
        }
    }
    // 保存白板记录
    saveBoardHistory(data) {
        // 只保存10步内的记录
        if (this.state.board.history.length > 10) {
            this.state.board.history.shift();
        }
        this.state.board.history.push(data);
    }
    // 撤销操作
    doRevoke() {
        // 画出上次的图片
        if (this.state.board.history.length > 0) {
            this.state.board.history.pop();
            let index = this.state.board.history.length - 1;
            if (this.state.board.history.length >= 0) {
                // 清空画板
                this.whiteboard.clearContext(true);
                if (this.state.board.history.length > 0) {
                    this.whiteboard.drawFromBase64(this.state.board.history[index], false);
                }
            }
        }
    }
    // 白板绘画事件
    boardChange(data) {
        this.props.changeHandle(data);
    }
}

WhiteBoard.propTypes = {
    clearHandle: PropTypes.func.isRequired,
    changeHandle: PropTypes.func.isRequired,
}