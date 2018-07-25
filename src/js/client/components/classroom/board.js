import React from 'react'
import PropTypes from 'prop-types'

export default class Board extends React.Component {
    constructor(props) {
        super(props);
        this.initCanvas = this.initCanvas.bind(this);
        this.drawFromBase64 = this.drawFromBase64.bind(this);
        this.drawFromImage = this.drawFromImage.bind(this);
        this.drawImage = this.drawImage.bind(this);
        this.saveHistory = this.saveHistory.bind(this);
        this.clearContext = this.clearContext.bind(this);
        this.onChange = null;
    }

    render() {
        return (
            <div className="board" ref={(board) => {this.board = board}}>
                <canvas ref={(canvas) => {this.canvas = canvas}}></canvas>
            </div>
        )
    }

    componentDidMount() {
        this.initCanvas();
    }

    componentDidUpdate() {
        this.resizeHandle();
    }

    // 初始化画板
    initCanvas() {
        // 显示层
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.canvas_context = this.canvas.getContext('2d');
        this.canvas_top = this.board.offsetTop;
        this.canvas_left = this.board.offsetLeft;
        // 绘制层
        this.canvas_bak =  this.canvas.cloneNode();
        this.canvas_bak.style = 'z-index: 999;position: absolute;top: 0;left: 0;';
        this.canvas_bak.width = this.canvas.clientWidth;
        this.canvas_bak.height = this.canvas.clientHeight;
        this.canvas_bak_context = this.canvas_bak.getContext('2d');
        this.board.appendChild(this.canvas_bak);
        // 鼠标事件
        this.canvas_bak.addEventListener('mousedown', this.startDraw.bind(this), false);
        this.canvas_bak.addEventListener('mousemove', this.onDraw.bind(this), false);
        this.canvas_bak.addEventListener('mouseup', this.stopDraw.bind(this), false);
        this.canvas_bak.addEventListener('mouseout', this.clearDraw.bind(this), false);
        // 窗口大小调整事件
        window.addEventListener('resize', this.resizeHandle.bind(this), false);
    }

    // 开始画图（鼠标按下）
    startDraw(e) {
        e.stopPropagation();
        this.startX = e.pageX - this.canvas_left;
        this.startY = e.pageY - this.canvas_top;
        if (this.props.tools.type != null) {
            this.isDraw = true;
            this.canvas_bak_context.strokeStyle = this.props.tools.color;
            this.canvas_bak_context.lineWidth = this.props.tools.width;
            
            switch(this.props.tools.type) {
                case 'pen':
                    this.canvas_bak_context.beginPath();
                    break;
                case 'text':
                    let els = document.getElementById('text-input');
                    if (els) {
                        // 输入文字后的绘制
                        if (els.value != '') {
                            this.canvas_context.fillStyle = this.props.tools.color;
                            this.canvas_context.font = this.props.tools.fontSize + 'px "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial';
                            this.canvas_context.fillText(els.value, els.offsetLeft - this.canvas_left, els.offsetTop - this.canvas_top + els.offsetHeight);
                            this.saveHistory();
                            if (this.onChange) {
                                this.onChange();
                            }
                        }
                        document.body.removeChild(els);
                        this.props.toolsHandle('type', null);
                    } else {
                        // 没输入文字前的输入框
                        let textbox = document.createElement('input');
                        textbox.id = 'text-input';
                        textbox.style = 'position:absolute;top:' + e.pageY  + 'px;left:' + e.pageX + 'px;z-index:99;font-size:' + this.props.tools.fontSize + 'px;color:' + this.props.tools.color + ';border:none;border-bottom:1px solid #333;';
                        document.body.appendChild(textbox);
                        window.setTimeout("document.getElementById('text-input').focus();", 50);
                    }
                    break;
            }
        }
    }

    // 画图过程（鼠标移动）
    onDraw(e) {
        e.stopPropagation();
        let x = e.pageX - this.canvas_left;
        let y = e.pageY - this.canvas_top;

        switch(this.props.tools.type) {
            case 'pen':
                if (this.isDraw) {
                    this.canvas_bak_context.lineTo(x, y);
                    this.canvas_bak_context.stroke();
                }
                break;
            case 'line':
                if (this.isDraw) {
                    this.canvas_bak_context.beginPath();
                    this.clearContext();
                    this.canvas_bak_context.moveTo(this.startX , this.startY);
                    this.canvas_bak_context.lineTo(x, y);
                    this.canvas_bak_context.stroke();
                }
                break;
            case 'rectangle':
                if (this.isDraw) {
                    this.canvas_bak_context.beginPath();
                    this.clearContext();
                    this.canvas_bak_context.moveTo(this.startX , this.startY);
                    this.canvas_bak_context.lineTo(x, this.startY);
                    this.canvas_bak_context.lineTo(x, y);
                    this.canvas_bak_context.lineTo(this.startX, y);
                    this.canvas_bak_context.lineTo(this.startX, this.startY);
                    this.canvas_bak_context.stroke();
                }
                break;
            case 'circular':
                if (this.isDraw) {
                    this.canvas_bak_context.beginPath();
                    this.clearContext();
                    this.canvas_bak_context.save();
                    // 椭圆横向中心坐标
                    let x1 = (x - this.startX) / 2 + this.startX;
                    // 椭圆纵向中心坐标
                    let y1 = (y - this.startY) / 2 + this.startY;
                    // 半径
                    let a = Math.abs((x - this.startX) / 2);
                    let b = Math.abs((y - this.startY) / 2);
                    let r = (a > b) ? a : b;
                    let ratioX = a / r; //横轴缩放比率
                    let ratioY = b / r; //纵轴缩放比率
                    this.canvas_bak_context.scale(ratioX, ratioY); //进行缩放（均匀压缩）
                    this.canvas_bak_context.beginPath();
                    this.canvas_bak_context.moveTo((x1 + a) / ratioX, y1 / ratioY);
                    //从椭圆的左端点开始逆时针绘制
                    this.canvas_bak_context.arc(x1 / ratioX, y1 / ratioY, r, 0, 2 * Math.PI);
                    this.canvas_bak_context.closePath();
                    this.canvas_bak_context.restore();
                    this.canvas_bak_context.stroke();
                }
                break;
            case 'eraser':
                this.clearContext();
                this.canvas_bak_context.lineWidth = 1;
                this.canvas_bak_context.fillStyle = '#c5c5c5';
                this.canvas_bak_context.beginPath();
                this.canvas_bak_context.fillRect(x - 10, y - 10, 20, 20);
                if (this.isDraw) {
                    this.canvas_context.clearRect(x - 10, y - 10, 20, 20);
                }
                break;
        }
    }

    // 停止画图（鼠标弹起）
    stopDraw(e) {
        e.stopPropagation();
        if (this.isDraw) {
            this.isDraw = false;
            if (this.props.tools.type != 'eraser'  && this.props.tools.type != 'text' && this.props.tools.type != null) {
                let data = this.canvas_bak.toDataURL();
                this.drawFromBase64(data, true);
            }
            if (this.props.tools.type == 'eraser') {
                this.saveHistory();
                if (this.onChange) {
                    this.onChange();
                }
            }
            this.clearContext();
        }
    }

    // 清除画笔内容（鼠标移出）
    clearDraw(e) {
        e.stopPropagation();
        this.isDraw = false;
        this.clearContext();
    }

    // 把img元素内容画到显示层
    drawFromImg(image, savable = true) {
        this.drawImage(image, savable);
    }

    // 把Image对象画到显示层
    drawFromImage(image, savable = true) {
        image.onload = this.imageOnLoad.bind(this, image, savable);
    }

    // 把base64图片数据画到显示层
    drawFromBase64(base64Str, savable = true) {
        let image = new Image();
        image.src = base64Str;
        this.drawFromImage(image, savable);
    }

    // Image对象加载处理
    imageOnLoad(image, savable) {
        this.drawImage(image, savable);
    }

    // 把图片画到显示层画板上
    drawImage(image, savable) {
        let width = this.canvas.clientWidth;
        let height = this.canvas.clientHeight;
        let x = 0;
        let y = 0;
        // 小于画板的图片局中
        if (image.width < this.canvas.clientWidth) {
            width = image.width;
            x = (this.canvas.clientWidth - image.width) / 2;
        }
        if (image.height < this.canvas.clientHeight) {
            height = image.height;
            y = (this.canvas.clientHeight - image.height) / 2;
        }
        this.canvas_context.drawImage(image, 0, 0, image.width, image.height, x, y, width, height);
        if (savable) {
            this.saveHistory();
        }
        if (this.onChange) {
            this.onChange();
        }
    }

    // 保存到历史记录
    saveHistory() {
        let data = this.canvas.toDataURL();
        this.props.historyHandle(data);
    }

    // 清空画板
    clearContext(both = false) {
        this.canvas_bak_context.clearRect(0, 0, this.canvas_bak.clientWidth, this.canvas_bak.clientHeight);
        if (both) {
            this.canvas_context.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        }
    }

    //窗口大小变化时，调整画板大小及位置偏移量
    resizeHandle() {
        let data = this.canvas.toDataURL();
        this.clearContext(true);
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.canvas_top = this.board.offsetTop;
        this.canvas_left = this.board.offsetLeft;
        this.canvas_bak.width = this.canvas.clientWidth;
        this.canvas_bak.height = this.canvas.clientHeight;
        this.drawFromBase64(data, false);
    }

    //获取当前画板内容
    getImage() {
        return this.canvas.toDataURL();
    }
}

Board.propTypes = {
    historyHandle: PropTypes.func.isRequired,
    tools: PropTypes.shape({
        type: PropTypes.string,
        width: PropTypes.number,
        fontSize: PropTypes.number,
        color: PropTypes.string,
    }).isRequired,
    toolsHandle: PropTypes.func.isRequired,
}