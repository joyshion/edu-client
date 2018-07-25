import React from 'react'

export default class Video extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="position-relative video">
                <div className="remote">
                    <video id="remote" width="260" height="200" autoPlay playsInline></video>
                </div>
                <div className="position-absolute local">
                    <video id="local" width="130" height="100" autoPlay playsInline muted></video>
                </div>
            </div>
        )
    }
}