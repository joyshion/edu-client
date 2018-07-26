import { ipcMain } from 'electron'

export default class EventListener {
    constructor(app, windownsManager) {
        this.app = app;
        this.windownsManager = windownsManager;
    }

    invoke() {
        ipcMain.on('login', (event, args) => this.login(event, args));
        ipcMain.on('logout', (event, args) => this.logout(event, args));
        ipcMain.on('startClass', (event, args) => this.startClass(event, args));
        ipcMain.on('endClass', (event, args) => this.endClass(event, args));
    }
    
    login(event, args) {
        this.app.isLogin = true;
        this.windownsManager.open('dashboard');
        this.windownsManager.close('login');
    }

    logout(event, args) {
        this.windownsManager.close('dashboard');
        this.windownsManager.close('classroom');
        this.windownsManager.open('login');
    }

    startClass(event, args) {
        this.windownsManager.open('classroom');
    }

    endClass(event, args) {
        this.windownsManager.close('classroom');
    }
}