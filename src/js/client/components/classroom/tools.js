import React from 'react'
import PropTypes from 'prop-types'

export default class Tools extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="position-absolute tools">
                <ul className="list-inline d-flex">
                    <li className={'list-inline-item ' + this.getClassName(null)} onClick={this.onClick.bind(this, 'type', null)}>
                        <i className="fa fa-mouse-pointer"></i>
                    </li>
                    <li title="铅笔" className={'list-inline-item ' + this.getClassName('pen')} onClick={this.onClick.bind(this, 'type', 'pen')}>
                        <i className="fa fa-pencil"></i>
                    </li>
                    <li title="直线" className={'list-inline-item ' + this.getClassName('line')} onClick={this.onClick.bind(this, 'type', 'line')}>
                        <i className="fa fa-minus"></i>
                    </li>
                    <li title="四方形" className={'list-inline-item ' + this.getClassName('rectangle')} onClick={this.onClick.bind(this, 'type', 'rectangle')}>
                        <i className="fa fa-square-o"></i>
                    </li>
                    <li title="圆形" className={'list-inline-item ' + this.getClassName('circular')} onClick={this.onClick.bind(this, 'type', 'circular')}>
                        <i className="fa fa-circle-thin"></i>
                    </li>
                    <li title="文字" className={'list-inline-item ' + this.getClassName('fontSize')}>
                        <i className="fa fa-font"></i>
                        <div className="position-absolute selecter">
                            <ul className="list-unstyled">
                                <li onClick={this.onClick.bind(this, 'fontSize', 32)}><span className="font">32</span></li>
                                <li onClick={this.onClick.bind(this, 'fontSize', 28)}><span className="font">28</span></li>
                                <li onClick={this.onClick.bind(this, 'fontSize', 24)}><span className="font">24</span></li>
                                <li onClick={this.onClick.bind(this, 'fontSize', 20)}><span className="font">20</span></li>
                                <li onClick={this.onClick.bind(this, 'fontSize', 16)}><span className="font">16</span></li>
                            </ul>
                        </div>
                    </li>
                    <li title="橡皮擦" className={'list-inline-item ' + this.getClassName('eraser')} onClick={this.onClick.bind(this, 'type', 'eraser')}>
                        <i className="fa fa-eraser"></i>
                    </li>
                    <li title="撤销" className={'list-inline-item ' + this.getClassName('revoke')} onClick={this.onClick.bind(this, 'type', 'revoke')}>
                        <i className="fa fa-reply"></i>
                    </li>
                    <li title="清空" className={'list-inline-item ' + this.getClassName('clear')} onClick={this.onClick.bind(this, 'type', 'clear')}>
                        <i className="fa fa-trash"></i>
                    </li>
                    <li title="画笔粗细" className={'list-inline-item ' + this.getClassName('width')}>
                        <i className="fa fa-circle width-selector" style={this.getWidthStyle()}></i>
                        <div className="position-absolute selecter">
                            <ul className="list-unstyled">
                                <li onClick={this.onClick.bind(this, 'width', 8)}><i className="fa fa-circle w4"></i></li>
                                <li onClick={this.onClick.bind(this, 'width', 6)}><i className="fa fa-circle w3"></i></li>
                                <li onClick={this.onClick.bind(this, 'width', 4)}><i className="fa fa-circle w2"></i></li>
                                <li onClick={this.onClick.bind(this, 'width', 2)}><i className="fa fa-circle w1"></i></li>
                            </ul>
                        </div>
                    </li>
                    <li title="画笔颜色" className={'list-inline-item ' + this.getClassName('color')}>
                        <span className="color-selector" style={this.getColorStyle()}></span>
                        <div className="position-absolute selecter">
                            <ul className="list-unstyled">
                                <li onClick={this.onClick.bind(this, 'color', '#000000')}>
                                    <span className="color c1"></span>
                                </li>
                                <li onClick={this.onClick.bind(this, 'color', '#9acd32')}>
                                    <span className="color c2"></span>
                                </li>
                                <li onClick={this.onClick.bind(this, 'color', '#ff0000')}>
                                    <span className="color c3"></span>
                                </li>
                                <li onClick={this.onClick.bind(this, 'color', '#ffff00')}>
                                    <span className="color c4"></span>
                                </li>
                                <li onClick={this.onClick.bind(this, 'color', '#0000ff')}>
                                    <span className="color c5"></span>
                                </li>
                                <li onClick={this.onClick.bind(this, 'color', '#800080')}>
                                    <span className="color c6"></span>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        )
    }

    // 工具选中
    onClick(type, value) {
        this.props.clickHandle(type, value);
    }

    // 根据选中的工具设置css样式 
    getClassName(type) {
        return this.props.state.type == type ? 'active' : '';
    }

    // 获取画笔粗细的样式
    getWidthStyle() {
        switch (this.props.state.width) {
            case 2:
                return {transform: 'scale(.4)'};
                break;
            case 4:
                return {transform: 'scale(.6)'};
                break;
            case 6:
                return {transform: 'scale(.8)'};
                break;
            case 8:
                return {transform: 'scale(1)'};
                break;
        }
    }

    // 获取画笔颜色的样式
    getColorStyle() {
        return {background: this.props.state.color};
    }
}

Tools.propTypes = {
    clickHandle: PropTypes.func.isRequired,
    state: PropTypes.shape({
        type: PropTypes.string,
        width: PropTypes.number,
        fontSize: PropTypes.number,
        color: PropTypes.string,
    }).isRequired,
}