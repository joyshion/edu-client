import React from 'react'
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom'
import Home from './home'
import Student from './student'
import Course from './course'
import Setting from './setting'
import Profile from './profile'
import {ipcRenderer} from 'electron'

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        };
    }
    render() {
        let photo = this.state.data ? 'http://edu.com/' + this.state.data.profile.photo : '';
        let name = this.state.data ? this.state.data.profile.name : '';

        return (<Router>
            <div className="d-flex flex-row dashboard">
                <div className="left text-center d-flex flex-column">
                    <div className="face">
                        <img src={photo}/>
                        <p>{name}</p>
                    </div>
                    <div className="nav">
                        <ul>
                            <li>
                                <NavLink to="/dashboard.html" activeClassName="active">管理首页</NavLink>
                            </li>
                            <li>
                                <NavLink to="/student" activeClassName="active">学生管理</NavLink>
                            </li>
                            <li>
                                <NavLink to="/course" activeClassName="active">课程管理</NavLink>
                            </li>
                            <li>
                                <NavLink to="/profile" activeClassName="active">账号设置</NavLink>
                            </li>
                            <li>
                                <NavLink to="/setting" activeClassName="active">系统设置</NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className="logout">
                        <a href="javascript:;" onClick={this.logout.bind(this)}>退出登录</a>
                    </div>
                </div>
                <Route path="/dashboard.html" component={Home} />
                <Route path="/student" component={Student} />
                <Route path="/course" component={Course} />
                <Route path="/profile" component={Profile} />
                <Route path="/setting" component={Setting} />
            </div>
        </Router>)
    }
    componentDidMount() {
        let data= localStorage.getItem('data');
        this.state.data = JSON.parse(data);
        this.setState(this.state);
        console.log(this.state);
    }
    logout() {
        localStorage.clear();
        ipcRenderer.send('logout');
    }
}
