import React from 'react'
import { Link } from "react-router-dom"

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        };
    }
    render() {
        let course_count = this.state.data ? this.state.data.course.length : 0;
        let student_count = this.state.data ? this.state.data.student.length : 0;
        return (
            <div className="right d-flex flex-column">
                <div className="state d-flex flex-row">
                    <Link to="/course" className="item d-block course">
                        <i className="fa fa-book"></i>
                        <em className="d-block">{course_count}</em>
                        <span className="d-block">我的课程</span>
                    </Link>
                    <Link to="/student" className="item d-block student">
                        <i className="fa fa-graduation-cap"></i>
                        <em className="d-block">{student_count}</em>
                        <span className="d-block">我的学生</span>
                    </Link>
                </div>
                <div className="news">
                    <div className="title">平台公告</div>
                    <p>暂无公告</p>
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