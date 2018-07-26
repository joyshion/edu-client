import React from 'react'
import ReactDOM from 'react-dom'

class Dialog extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="modal fade show" tabIndex="-1" role="dialog" style={{display: 'block'}}>
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.props.title}</h5>
                            <button type="button" className="close" data-dismiss="modal" onClick={this.props.closeHandle}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {this.props.content}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.props.closeHandle}>确定</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// 正在显示的message
let dialogs = [];

Dialog.show = (options) => {
    Dialog.closeAll();
    let div = document.createElement('div');
    // 如果有指定节点，则插入该节点下，否则插入到body节点下
    if (options.container) {
        options.container.appendChild(div);
    } else {
        document.body.appendChild(div);
    }
    let closeHandle = () => {
        let index = dialogs.findIndex(n => {
            return n == div;
        });
        if (index > -1) {
            dialogs.splice(index, 1);
        }
        ReactDOM.unmountComponentAtNode(div);
        div.parentNode.removeChild(div);
    };
    ReactDOM.render(<Dialog title={options.title} content={options.content} closeHandle={closeHandle}/>, div);
}

Dialog.close = dialog => {
    try {
        ReactDOM.unmountComponentAtNode(dialog);
        dialog.parentNode.removeChild(dialog);
    } catch (e) {
        console.log(e);
    }
}

Dialog.closeAll = () => {
    dialogs.map((n, i) => {
        dialogs.splice(i, 1);
        Dialog.close(n);
    });
}

export default Dialog;