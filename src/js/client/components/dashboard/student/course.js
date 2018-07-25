import React from 'react'

export default class Course extends React.Component {
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
                    <div className="title">我的课程</div>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">课程名称</th>
                                <th scope="col">授课教师</th>
                                <th scope="col">购买课时</th>
                                <th scope="col">剩余课时</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data ? 
                                this.state.data.course.map((n, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{n.course_name}</td>
                                            <td>{n.teacher_name}</td>
                                            <td>{n.course_count} 节</td>
                                            <td>{n.course_count - n.course_used} 节</td>
                                        </tr>
                                    );
                                })
                             : 
                                <tr>
                                    <td colSpan="6">暂无课程</td>
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