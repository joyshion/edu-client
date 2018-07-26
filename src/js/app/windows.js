import electron from 'electron'
import config from './config'

let { BrowserWindow } = electron;

/**
 * 窗口管理器
 */
export default class Windows {
    constructor(app) {
        this.app = app;
        this.config = config;
        // 所有窗口
        this.windows = [],
        // 默认窗口配置
        this.default_options = {
            show: false,
            titleBarStyle: 'hidden',
            title: config.name + '_' + process.env.BUILD_TYPE == 'student' ? '学生端' : '教师端',
        };
    }

    /**
     * 打开窗口
     * @param {string} name
     */
    open(name) {
        let config = this.config.windows[name];
        if (!config) {
            // 目标窗口未配置
            return;
        }

        // 创建窗口
        let options = Object.assign(this.default_options, config.options);
        let win = new BrowserWindow(options);
        // 开发模式下打开开发工具
        if (process.env.NODE_ENV == 'development') {
            win.webContents.openDevTools({
                mode: 'detach'
            });
        }
        let url = this.config.schemes + '://' + this.config.base_url + '/' + config.url;
        win.loadURL(url);
        this.windows.push({name: name, window: win});

        // 窗口将要显示
        win.once('ready-to-show', event => {
            win.show();
        });
        // 窗口已经显示
        win.once('show', event => {
            if (config.onShow) {
                config.onShow(win, event);
            }
        });
        //窗口将要关闭
        win.on('close', event => {
            if (config.onClose) {
                config.onClose(win, event);
            }
        });
        // 窗口已经关闭
        win.once('closed', () => {
            win = null;

            // 窗口已关闭，删除缓存的实例
            let index = this.windows.findIndex(n => {
                return n.name == name;
            });
            if (index >= 0) {
                this.windows.splice(index, 1);
            }

            if (config.onClosed) {
                config.onClosed();
            }
        });

        return win;
    }

    close(name) {
        let index = this.windows.findIndex(n => {
            return n.name == name;
        });
        if (index >= 0) {
            this.windows[index].window.close();
        }
    }

    /**
     * 应用被激活(macOS only)
     */
    activate() {
        if (this.app.isLogin) {
            let index = this.windows.findIndex(n => {
                return n.name == 'dashboard';
            });
            if (index >= 0) {
                this.windows[index].window.show();
            } else {
                this.open('dashboard');
            }
        } else {
            let index = this.windows.findIndex(n => {
                return n.name == 'login';
            });
            if (index >= 0) {
                this.windows[index].window.show();
            } else {
                this.open('login');
            }
        }
    }
}
