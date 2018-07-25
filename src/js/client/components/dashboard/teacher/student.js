import React from 'react'
import {ipcRenderer} from 'electron'

export default class Student extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        };
    }
    render() {
        let data;
        if (this.state.data) {
            data = this.getData();
        }
        return (
            <div className="right d-flex flex-column">
                <div className="content">
                    <div className="title">学生管理</div>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">姓名</th>
                                    <th scope="col">性别</th>
                                    <th scope="col">年龄</th>
                                    <th scope="col">年级</th>
                                    <th scope="col">城市</th>
                                    <th scope="col">课程</th>
                                    <th scope="col">剩余课时</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
    componentDidMount() {
        let data= localStorage.getItem('data');
        this.state.data = JSON.parse(data);
        this.setState(this.state);
    }
    getData() {
        let trs = [];
        let tid = localStorage.getItem('uid');
        this.state.data.student.map(n => {
            trs.push(
                <tr key={n.id}>
                    <td>{n.student_name}</td>
                    <td>{n.sex}</td>
                    <td>{n.age} 岁</td>
                    <td>{n.stage + n.grade}</td>
                    <td>{n.city}</td>
                    <td>{n.course_name}</td>
                    <td>{n.course_count} 节</td>
                    <td className="ctrl">
                        <a href="javascript:;" onClick={this.startClass.bind(this, tid, n.student_id, n.course_id)}>开始上课</a>
                    </td>
                </tr>
            );
        });
        return trs;
    }
    startClass(teacher_id, student_id, course_id) {
        let data = {
            teacher_id: teacher_id,
            student_id: student_id,
            course_id: course_id
        };
        localStorage.setItem('room', JSON.stringify(data));
        ipcRenderer.send('startClass');
    }
}