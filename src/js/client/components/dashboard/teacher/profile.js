import React from 'react'
import Message from 'Components/common/message'
import API from 'Lib/api'

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            mobile: '',
        };
        this.api = new API();
    }
    render() {
        return (
            <div className="right d-flex flex-column">
                <div className="content">
                    <div className="title">账号设置</div>
                    <form>
                        <div className="form-group row">
                            <label className="col-md-2 col-form-label text-right">用户名</label>
                            <div className="col-md-4">
                                <input ref={username => {this.username = username}} type="text" className="form-control" placeholder="用户名" value={this.state.name} onChange={this.onChangeHandle.bind(this, 'name')}/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-md-2 col-form-label text-right">手机号码</label>
                            <div className="col-md-6">
                                <input ref={mobile => {this.mobile = mobile}} type="text" className="form-control" placeholder="手机号码" value={this.state.mobile} onChange={this.onChangeHandle.bind(this, 'mobile')}/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-md-2 col-form-label text-right">新密码</label>
                            <div className="col-md-6">
                                <input ref={password => {this.password = password}} type="password" className="form-control" placeholder="不修改请留空"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-md-2 col-form-label text-right">确认新密码</label>
                            <div className="col-md-6">
                                <input ref={repassword => {this.repassword = repassword}} type="password" className="form-control" placeholder="不修改请留空"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="offset-md-2 col-md-4">
                                <button className="btn btn-primary" type="button" onClick={this.onClick.bind(this)}>保存设置</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
    componentDidMount() {
        let data= JSON.parse(localStorage.getItem('data'));
        this.state.name = data.profile.name;
        this.state.mobile = data.profile.mobile;
        this.setState(this.state);
    }
    onChangeHandle(type, event) {
        this.state[type] = event.target.value;
        this.setState(this.state);
    }
    onClick() {
        if (this.username.value == '') {
            Message.error({
                content: '用户名不能为空',
                duration: 3000
            });
            return;
        }
        if (this.mobile.value == '') {
            Message.error({
                content: '手机号码不能为空',
                duration: 3000
            });
            return;
        }
        if (/^[1][3,4,5,7,8][0-9]{9}$/.test(this.mobile.value) == false) {
            Message.error({
                content: '手机号码格式不正确',
                duration: 3000
            });
            return;
        }
        if (this.password.value != '') {
            if (this.repassword.value == '') {
                Message.error({
                    content: '请再输入一次确认密码',
                    duration: 3000
                });
                return;
            }
            if (this.repassword.value != this.password.value) {
                Message.error({
                    content: '两次密码输入不一致',
                    duration: 3000
                });
                return;
            }
        }
        let data = {
            name: this.username.value,
            mobile: this.mobile.value,
            password: this.password.value
        };

        this.api.post('/profile', data).then(data => {
            if (data.status) {
                Message.success({
                    content: '账号设置修改成功',
                    duration: 3000
                });
            } else {
                Message.warning({
                    content: '网络通讯错误',
                    duration: 3000
                });
            }
        }).catch(error => {
            Message.warning({
                content: '网络通讯错误',
                duration: 3000
            });
        });
    }
}