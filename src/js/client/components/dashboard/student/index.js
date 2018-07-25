import React from 'react'
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom"
import Home from './home'
import Course from './course'
import History from './history'
import Setting from './setting'
import Profile from './profile'
import {ipcRenderer} from 'electron'
import API from 'Common/libs/api'

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        };
        this.api = new API();
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
                                <NavLink to="/course" activeClassName="active">我的课程</NavLink>
                            </li>
                            <li>
                                <NavLink to="/history" activeClassName="active">上课记录</NavLink>
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
                <Route path="/course" component={Course} />
                <Route path="/history" component={History} />
                <Route path="/profile" component={Profile} />
                <Route path="/setting" component={Setting} />
            </div>
        </Router>)
    }
    logout() {
        localStorage.clear();
        ipcRenderer.send('logout');
    }
    componentDidMount() {
        let data = localStorage.getItem('data');
        this.state.data = JSON.parse(data);
        this.setState(this.state);
        console.log(this.state.data);
        this.timer = setInterval(() => {
            // 未加入教室则轮询是否有新教室
            if (!this.joined) {
                this.api.get('/student/getroom').then(result => {
                    if (result) {
                        localStorage.setItem('room', JSON.stringify({
                            teacher_id: result.teacher_id,
                            student_id: result.student_id,
                            course_id: result.course_id,
                        }));
                        this.showNotification();
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        }, 5000);
    }
    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
    showNotification() {
        if (!this.notification) {
           this.notification = Notification.show(
                '上课通知',
                '课堂已就绪，请您立即上课',
                0,
                () => {
                    Notification.close(this.notification);
                    this.notification = null;
                    this.joined = true;
                    ipcRenderer.send('startClass');
                    console.log('notification onclick');
                }
            );
        }
        /* if (!this.class_notification) {
            this.class_notification = new Notification('上课通知', {
                body: '课堂已就绪，请您立即上课'
            });
            this.class_notification.onclick = () => {
                this.class_notification = null;
                this.joined = true;
                ipcRenderer.send('startClass');
            };
            setTimeout(() => {
                if (this.class_notification) {
                    this.class_notification.close();
                    this.class_notification = null;
                }
            }, 10000);
        } */
    }
}
