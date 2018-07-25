import React from 'react'
import Message from 'Components/message';
import API from 'Lib/api'
import {ipcRenderer} from 'electron'

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            disabled: true,
            showLayer: false,
            layerText: '',
        }
        this.api = new API();
    }
    render() {
        let type = process.env.BUILD_TYPE == 'teacher' ? '教师端' : '学生端';
        let label = this.state.loading ? '正在登陆' : '登陆';
        return (
            <div className="container-fluid login">
                <div className="text-center logo">
                    <img src="/images/logo.png"/>
                </div>
                <div className="text-center name">{type}</div>
                <form>
                    <div className="form-group">
                        <label>账号</label>
                        <input ref={(username) => {this.username = username}} type="text" className="form-control" placeholder="用户名/手机号码"/>
                    </div>
                    <div className="form-group">
                        <label>密码</label>
                        <input ref={(password) => {this.password = password}} type="password" className="form-control" placeholder="登录密码"/>
                    </div>
                    <button type="button" className="btn btn-primary btn-block" disabled={this.state.disabled} onClick={this.doLogin.bind(this)}>{label}</button>
                </form>
            </div>
        )
    }
    componentDidMount() {
        this.username.oninput = () => this.checkInput();
        this.password.oninput = () => this.checkInput();
    }
    checkInput() {
        let disabled = true;
        if (this.username.value != '' && this.password.value != '') {
            disabled = false;
        }
        this.setState({
            disabled: disabled
        });
    }
    doLogin() {
        this.state.loading = true;
        this.state.disabled = true;
        this.setState(this.state);

        let data = {
            name: this.username.value,
            password: this.password.value,
        }

        this.api.post('/login', data).then(data => {
            if (data.status) {
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('uid', data.uid);
                this.getData();
            } else {
                Message.error({
                    content: data.error,
                    duration: 3000
                });
                this.state.loading = false;
                this.state.disabled = false;
                this.setState(this.state);
            }
        }).catch(error => {
            console.log(error);
            this.state.loading = false;
            this.state.disabled = false;
            this.setState(this.state);
            Message.warning({
                content: '网络通讯错误',
                duration: 3000
            });
        });
    }

    getData() {
        this.api.get('/data').then(data => {
            this.state.loading = false;
            this.setState(this.state);
            localStorage.setItem('data', JSON.stringify(data));
            ipcRenderer.send('login');
        }).catch(error => {
            console.log(error);
            this.state.loading = false;
            this.state.disabled = false;
            this.setState(this.state);
            Message.warning({
                content: '网络通讯错误',
                duration: 3000
            });
        });
    }
}
