import io from 'socket.io-client'

function configuration(options = {}) {
    let reconnection = true;
    if (options.reconnection != null && options.reconnection != undefined) {
        reconnection = options.reconnection;
    }

    const _io = io(options.server, {
        reconnection: reconnection,
        auth: {
            Authorization: `Bearer ${options.token}`,
        },
    });

    _io.on('connect', function() {
        console.log('Client connected to the server');
    });

    _io.on('disconnect', function(){
        console.log('Client disconnected to the server');
    });

    _io.on('reconnect', function(){
        console.log('Client reconnect to the server');
    });

    
    return _io;
}



const socketForJSFramework = {

    SoraVueSocketIO: {
        install(Vue, options) {
            
            const _io = configuration(options)

            const version = Number(Vue.version.split('.')[0])
    
            if (version >= 3) {
                Vue.config.globalProperties.$soraSocketIO = _io
            } else {
                Vue.prototype.$soraSocketIO = _io
            }
    
        }
    }
}

export const {

    SoraVueSocketIO

} = socketForJSFramework;
