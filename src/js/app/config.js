let config = {
    name: '辅导+',
    url: 'edu',
    base_url: 'app.local',
    windows: {
        login: {
            url: 'login.html',
            options: {
                width: 300,
                height: 500,
                maximizable: false,
                titleBarStyle: 'hidden',
                frame: false
            }
        },
        dashboard: {
            url: 'dashboard.html',
            options: {
                width: 900,
                height: 600,
                titleBarStyle: 'hidden',
                frame: false
            }
        },
        classroom: {
            url: 'classroom.html',
            options: {
                titleBarStyle: 'hidden',
                frame: false
            },
            onShow: (win) => {
                win.maximizable();
            },
            onClose: (win, event) => {
                
            }
        }
    }
};

export default config;