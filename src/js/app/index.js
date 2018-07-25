import {app, protocol, Menu, globalShortcut, BrowserWindow} from 'electron'
import fs from 'fs'
import mime from 'mime'
import path from 'path'
import config from './config';
import WindowsManager from './windows'

export default class App {
    constructor() {
        this.app = app;
        this.protocol = protocol;
        this.windownsManager = new WindowsManager(this);
    }
    
    // 运行程序
    run(window) {
        // 注册自定义协议
        this.registerStandardSchemes();

        // 初始化完成
        this.app.on('ready', () => {
            // 注册自定义协议的请求响应
            this.registerStreamProtocol();
            // 清空菜单
            Menu.setApplicationMenu(null);
            // 开发模式启用刷新热键
            if (process.env.NODE_ENV == 'dev') {
                switch (process.platform) {
                    // macOS 刷新热键
                    case 'darwin':
                        globalShortcut.register('CommandOrControl+R', function() {
                            let window = BrowserWindow.getFocusedWindow();
                            if (window) {
                                window.reload();
                            }
                        });
                        break;
                    // windows刷新热键
                    case 'win32':
                        globalShortcut.register('f5', function() {
                            let window = BrowserWindow.getFocusedWindow();
                            if (window) {
                                window.reload();
                            }
                        });
                        break;
                }
            }
            // 创建窗口
            this.windownsManager.open(window);
        });

        // 当所有的窗口都被关闭
        this.app.on('window-all-closed', () => {
            // 非macOS程序直接退出
            if (process.platform != 'darwin') {
                this.app.quit();
            }
        });

        // 程序将要退出
        this.app.on('will-quit', () => {
            // 清空所有快捷键
            globalShortcut.unregisterAll()
        });

        // 当应用被激活时(macOS only)
        this.app.on('activate', () => {
            this.windownsManager.activate();
        });

        // 业务事件处理
        if (this.eventListener) {
            this.eventListener.invoke();
        }
    }

    // 注册业务事件处理
    registerEventListener(listenner) {
        this.eventListener = new listenner(this.app, this.windownsManager);
        return this;
    }

    // 注册自定义协议
    registerStandardSchemes() {
        this.protocol.registerStandardSchemes([config.schemes], {secure: true});
    }

    // 注册自定义协议的处理器
    registerStreamProtocol() {
        this.protocol.registerStreamProtocol(this.schemes, (request, callback) => {
            let filepath = this.getRequestFilePath(request);
            let data = fs.createReadStream(filepath);
            let mime = this.getMimeType(filepath);
            callback({
                statusCode: 200,
                headers: {
                    'content-type': mime
                },
                data: data
            });
        }, error => {
            if (error) console.error('Failed to register protocol');
        });
    }

    // 根据请求url获取本地文件路径
    getRequestFilePath(request) {
        let url = config.schemes + '://' + config.base_url + '/';
        let filename = request.url.replace(url, '');
        return app.getAppPath() + '/' + filename;
    }

    // 根据文件后缀获取文件MIME类型
    getMimeType(file) {
        let ext = path.extname(file)
        return mime.getType(ext)
    }
}