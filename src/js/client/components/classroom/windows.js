import React from 'react'
import PropTypes from 'prop-types'
import 'webrtc-adapter'
import { desktopCapturer } from'electron'

export default class Windows extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sources: [],
            id: ''
        };
    }
    render() {
        return (
            <div className="position-absolute windows">
                <div className="position-relative list">
                    <ul className="list-unstyled">
                        {this.state.sources.map((window) =>
                            <li key={window.id} wid={window.id} onClick={this.windowSelect.bind(this)} onMouseEnter={this.onMouseEnter.bind(this)}>
                                {this.getName(window.name)}
                            </li>
                        )}
                    </ul>
                </div>
                {this.state.id && <img className="preview" src={this.thumbnail()} />}
            </div>
        )
    }
    componentDidMount() {
        this.getSources();
    }
    getSources() {
        desktopCapturer.getSources({
            types: ['window', 'screen'],
            thumbnailSize: {
                width: 200,
                height: 200,
            }
        }, (error, sources) => {
            if (error) {
                console.log(error);
            } else {
                this.state.sources = sources;
                this.setState(this.state);
            }
        });
    }
    onMouseEnter(e) {
        this.state.id = e.target.getAttribute('wid');
        this.setState(this.state);
    }
    windowSelect(e) {
        let id = e.target.getAttribute('wid');
        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: id,
                    minWidth: 1280,
                    maxWidth: 1280,
                    minHeight: 720,
                    maxHeight: 720
                }
            }
        }).then((stream) => {
            this.props.streamHandle(stream);
        }).catch((e) => {
            console.log('get share desktop error' + e);
        });
    }
    getName(name) {
        if (name == 'Entire screen') {
            return '整个屏幕';
        } else {
            return name;
        }
    }
    thumbnail() {
        let window = this.state.sources.find(n => {
            return n.id == this.state.id;
        });
        return window.thumbnail.toDataURL();
    }
}

Windows.propTypes = {
    streamHandle: PropTypes.func.isRequired
}