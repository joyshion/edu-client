let config = {
    name: '辅导+',
    schemes: 'edu',
    base_url: 'app.local',
    windows: {
        login: {
            url: 'login.html',
            options: {
                width: 300,
                height: 450,
                maximizable: false,
                titleBarStyle: 'hidden'
            }
        },
        dashboard: {
            url: 'dashboard.html',
            options: {
                width: 900,
                height: 600,
                titleBarStyle: 'hidden'
            }
        },
        classroom: {
            url: 'classroom.html',
            options: {
                titleBarStyle: 'hidden',
                frame: false
            },
            onShow: (win) => {
                console.log('on show');
                win.maximize();
            },
            onClose: (win, event) => {
                
            }
        }
    }
};

export default config;