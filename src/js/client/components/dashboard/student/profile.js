import React from 'react'
import Layer from 'Common/components/layer'
import API from 'Common/libs/api'

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            mobile: '',
            data: null
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
                                <input ref={username => {this.username = username}} type="text" className="form-control" placeholder="用户名" value={this.state.name} onChange={this.handleChange.bind(this, 'name')}/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-md-2 col-form-label text-right">手机号码</label>
                            <div className="col-md-6">
                                <input ref={mobile => {this.mobile = mobile}} type="text" className="form-control" placeholder="手机号码" value={this.state.mobile} onChange={this.handleChange.bind(this, 'mobile')}/>
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
    handleChange(name, event) {
        this.state[name] = event.target.value;
        this.setState(this.state);
    }
    onClick() {
        if (this.username.value == '') {
            Layer.info('用户名不能为空');
            return;
        }
        if (this.mobile.value == '') {
            Layer.info('手机号码不能为空');
            return;
        }
        if (/^[1][3,4,5,7,8][0-9]{9}$/.test(this.mobile.value) == false) {
            Layer.info('手机号码格式不正确');
            return;
        }
        if (this.password.value != '') {
            if (this.repassword.value == '') {
                Layer.info('请再输入一次确认密码');
                return;
            }
            if (this.repassword.value != this.password.value) {
                Layer.info('两次密码输入不一致');
                return;
            }
        }
        let data = {
            name: this.username.value,
            mobile: this.mobile.value,
            password: this.password.value
        };

        this.api.post('/student/profile', data).then(data => {
            if (data.status) {
                Layer.info('账号设置修改成功');
            } else {
                Layer.info('网络通讯错误');
            }
        }).catch(error => {
            Layer.info('网络通讯错误');
        });
    }
}