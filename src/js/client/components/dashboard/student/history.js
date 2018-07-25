import React from 'react'

export default class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        };
    }
    render() {
        return (
            <div className="right d-flex flex-column">
                <div className="content">
                    <div className="title">上课记录</div>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">课程名称</th>
                                <th scope="col">授课教师</th>
                                <th scope="col">开始时间</th>
                                <th scope="col">结束时间</th>
                                <th scope="col">上课时长</th>
                                <th scope="col">课程回放</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data ? 
                                this.state.data.history.map((n, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{n.course_name}</td>
                                            <td>{n.teacher_name}</td>
                                            <td>{n.start_time}</td>
                                            <td>{n.end_time}</td>
                                            <td>{n.times} 分钟</td>
                                            <td><a href="javascript" data-url={n.video_url}>回放</a></td>
                                        </tr>
                                    );
                                })
                             : 
                                <tr>
                                    <td colSpan="6">暂无记录</td>
                                </tr>
                            }
                            <tr>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
    componentDidMount() {
        let data= localStorage.getItem('data');
        this.state.data = JSON.parse(data);
        this.setState(this.state);
    }
}