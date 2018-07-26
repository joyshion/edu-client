import React from 'react'
import API from 'Lib/api'

export default class ClassRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        };
        this.api = new API();
    }
    render() {
        return (
            <div className="right d-flex flex-column">
                <div className="content">
                    <div className="title">我的课堂</div>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">课程名称</th>
                                <th scope="col">上课学生</th>
                                <th scope="col">开始时间</th>
                                <th scope="col">结束时间</th>
                                <th scope="col">状态</th>
                                <th scope="col">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data ? 
                                this.state.data.history.map((n, i) => {
                                    return (
                                        <tr key={i}>
                                        </tr>
                                    );
                                })
                             : 
                                <tr>
                                    <td colSpan="6">暂无课堂</td>
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