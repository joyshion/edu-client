import io from 'socket.io-client'
import 'webrtc-adapter'

export default class RTC {
    constructor(config) {
        this.config = config;
        this.iceServers = null;
        this.stream = {};
        this.isReady;
        // 错误处理
        this.errorHandle = null;
        // 事件监听
        this.eventHandle = null;
        // 初始化
        this.init();
    }

    init() {
        // 获取用户媒体流
        this.getUserMedia();

        this.socket = io(this.config.url);

        // 连接ws服务器成功
        this.socket.on('connect', () => {
            this.onEvent('socket_ready');
        });
        // 连接ws服务器错误
        this.socket.on('connect_error', error => {
            this.onError('connect_error', error);
        });
        // 连接ws服务器超时
        this.socket.on('connect_timeout', timeout => {
            this.onError('connect_timeout', timeout);
        });
        // ws服务器返回错误
        this.socket.on('error', error => {
            this.onError('socket_error', error);
        });
        // 与ws服务器连接断开
        this.socket.on('disconnect', reason => {
            this.onEvent('disconnect', reason);
        });
        // 与ws服务器重连
        this.socket.on('reconnect', attemptNumber => {
            this.onEvent('reconnect', attemptNumber);
        });
        // 与ws服务器第N次重连
        this.socket.on('reconnect_attempt', attemptNumber => {
            this.onEvent('reconnect_attempt', attemptNumber);
        });
        // 正在重连ws服务器
        this.socket.on('reconnecting', attemptNumber => {
            this.onEvent('reconnecting', attemptNumber);
        });
        // 重连ws服务器发生错误
        this.socket.on('reconnect_error', error => {
            this.onError('reconnect_error', error);
        });
        // N次重连ws服务器后失败
        this.socket.on('reconnect_failed', error => {
            this.onError('reconnect_failed', error);
        });
        // 创建房间失败
        this.socket.on('create_room_error', error => {
            this.onError('create_room_error', error);
        });
        // 加入房间失败，房间不存在
        this.socket.on('room_not_exist', error => {
            this.onError('room_not_exist', error);
        });
        // 进入房间后，获取房间ID及webrtc配置信息
        this.socket.on('config', data => {
            this.onEvent('config', data);
            this.room_id = data.room_id;
            this.iceServers = data.iceServers;
        });
        // 对方加入房间
        this.socket.on('join', () => {
            this.onEvent('join');
        });
        // 准备就绪
        this.socket.on('ready', () => {
            this.onEvent('ready');
            // 就绪后才开始
            if (this.isReady) {
                this.createClient();
                if (this.config.isCaller) {
                    console.log(this.config.isCaller);
                    this.createOffer();
                }
            }
        });
        // 信令交换
        this.socket.on('data', (data) => {
            if (data.sdp) {
                this.setRemoteDescription(data.sdp).then(() => {
                    if (this.peerConnection.remoteDescription.type === 'offer') {
                        this.createAnswer();
                    }
                }).catch((e) => this.onError.bind(this, 'setRemoteDescription', e));
            } else if (data.ice) {
                this.addIceCandidate(data.ice);
            }
        });
        // 聊天
        this.socket.on('chat', data => {
            this.onEvent('chat', data);
        });
        // 绘图
        this.socket.on('draw', data => {
            this.onEvent('draw', data);
        });
        // 自定义事件
        this.socket.on('event', data => {
            this.onEvent('event', data);
        });
    }

    // 获取用户媒体流数据
    getUserMedia() {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            .then(stream => {
                this.stream.local = stream;
                this.config.video.local.srcObject = stream;
                this.isReady = true;
                this.onEvent('media_ready');
                this.socket.emit('ready');
            }).catch(error => {
                this.onError('media_error', error);
            });
    }
    // 发送数据
    send(event, data) {
        this.socket.emit(event, data);
    }
    // 创建RTC连接
    createClient() {
        this.peerConnection = new RTCPeerConnection({
            iceServers: this.config.iceServers,
            //iceTransportPolicy: 'relay',
        });
        this.peerConnection.onicecandidate = this.onICECandidate.bind(this);
        this.peerConnection.oniceconnectionstatechange = this.onIceConnectionStateChange.bind(this);
        this.peerConnection.onsignalingstatechange = this.onSignalingStateChange.bind(this);
        this.peerConnection.ontrack = this.onTrack.bind(this);
        this.peerConnection.onconnectionstatechange = this.onConnectionStateChange.bind(this);
        if (this.stream.local) {
            this.stream.local.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.stream.local);
            });
        }
        this.onEvent('createClient', this.peerConnection);
    }
    // 添加数据流
    addStream(stream) {
        if (this.isReady) {
            this.stream.share = stream;
            this.stream.share.getTracks().forEach(track => {
                this.sender = this.peerConnection.addTrack(track, this.stream.share);
            });
            this.createOffer();
        }
    }
    // 移除数据流
    removeStream() {
        if (this.sender) {
            this.peerConnection.removeTrack(this.sender);
            this.stream.share = null;
            this.createOffer();
        }
    }
    // 创建呼叫
    createOffer() {
        this.peerConnection.createOffer().then(this.setLocalDescription.bind(this)).catch((e) => this.onError.bind(this, 'createOffer', e));
        this.onEvent('createOffer');
    }
    // 创建应答
    createAnswer() {
        this.peerConnection.createAnswer().then(this.setLocalDescription.bind(this)).catch((e) => this.onError.bind(this, 'createAnswer', e));
        this.onEvent('createAnswer');
    }
    // 接收远程媒体流
    onTrack(event) {
        if (event.streams[0].id == this.shareStreamId) {
            this.onEvent('shareStream', event.streams[0]);
        } else {
            this.config.video.remote.srcObject = event.streams[0];
        }
    }
    // 发送交换网络信息
    onICECandidate(event) {
        if (event.candidate) {
            this.socket.emit('data', {'ice': event.candidate});
        }
    }
    // 设置本地描述
    setLocalDescription(offer) {
        this.peerConnection.setLocalDescription(offer).then(() => {
            this.socket.emit('data', {'sdp': this.peerConnection.localDescription});
        }).catch((e) => this.onError.bind(this, 'setLocalDescription', e));
    }
    // 设置远程描述
    setRemoteDescription(sdp) {
        let description = new RTCSessionDescription(sdp);
        return this.peerConnection.setRemoteDescription(description);
    }
    // 添加交换网络信息
    addIceCandidate(ice) {
        let candidate = new RTCIceCandidate(ice);
        this.peerConnection.addIceCandidate(candidate).catch((e) => this.onError.bind(this, 'addIceCandidate', e));
        this.onEvent('addIceCandidate', ice);
    }
    // 信令交换状态
    onSignalingStateChange() {
        this.onEvent('signalingStateChange', this.peerConnection.signalingState);
    }
    // ICE连接状态
    onIceConnectionStateChange(event) {
        this.onEvent('iceConnectionStateChange', this.peerConnection.iceConnectionState);
    }
    // rtc连接状态
    onConnectionStateChange(event) {
        this.onEvent('connectionStateChange', this.peerConnection.connectionState);
    }
    // 视频传输开关
    videoSwitch () {
        if (this.peerConnection) {
            let senders = this.peerConnection.getSenders();
            let sender = senders.find((n) => {
                return n.track.kind == 'video';
            });
            sender.track.enabled = !sender.track.enabled;
        }
    }
    // 音频传输开关
    audioSwitch () {
        if (this.peerConnection) {
            let senders = this.peerConnection.getSenders();
            let sender = senders.find((n) => {
                return n.track.kind == 'audio';
            });
            sender.track.enabled = !sender.track.enabled;
        }
    }

    // 事件订阅
    onEvent(name, data) {
        if (this.eventHandle) {
            this.eventHandle(name, data);
        }
        console.log('Event:' + name + ', Data:' + data);
    }

    // 错误订阅
    onError(name, error) {
        if (this.errorHandle) {
            this.errorHandle(name, error);
        }
        console.log('Error:' + name + ', Message:' + error);
    }
}