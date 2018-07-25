import React from 'react'
import API from 'Common/libs/api'

export default class Course extends React.Component {
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
                    <div className="title">课程管理</div>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">课程名称</th>
                                <th scope="col">课时</th>
                                <th scope="col">市场价</th>
                                <th scope="col">销售价</th>
                                <th scope="col">创建时间</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data ? 
                                this.state.data.course.map(n => {
                                    return (
                                        <tr>
                                            <td>{n.name}</td>
                                            <td>{n.lessons} 节</td>
                                            <td>&yen; {n.price}</td>
                                            <td>&yen; {n.sale_price}</td>
                                            <td>{n.created_at}</td>
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