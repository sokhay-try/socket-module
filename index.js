const initWebSocket = {
    subscribe: function (url, callBack, onDisconnected) {
        const ws = new WebSocket(url)

        ws.onopen = function() {
            console.log("Connected to Server"); 
        };

        ws.onmessage = function(event) {
            if(callBack) {
                callBack(event)
            }
        } 

        ws.onerror = function(event) {
            console.log('WebSocket error:', event);
        };

        ws.onclose = function() {
            if (onDisconnected) {
                onDisconnected('WebSocket connection closed')
            }
        };
        
        return ws
    },
    unsubscribe: function(ws, callBack) {
        // Disconnect the WebSocket
        const url = ws.url
        if (ws) {
            ws.close()
            if(callBack) {
                callBack(`unsubscribe to ${url}`)
            }
        }
    },
    onSend: function(ws, payload) {
        if(ws) {
            ws.send(JSON.stringify(payload))
        }
    }

}


const socketForJSFramework = {

    VueWebSocket: {
        install(Vue, options) {

            const version = Number(Vue.version.split('.')[0])
    
            if (version >= 3) {
                Vue.config.globalProperties.$soraSocket = initWebSocket
            } else {
                Vue.prototype.$soraSocket= initWebSocket
            }
    
        }
    }
}

export const {

    VueWebSocket

} = socketForJSFramework;