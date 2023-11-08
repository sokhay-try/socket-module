let websocketClients = new Map() 

let defaultRetry = {
    reconnectAttempt: 3, 
    isUnlimitedReconnect: false, 
    durationReconnect: 3000 //ms
}
const reasonCloseWS = 'unsubscribe'

const initWebSocket = {

    subscribe: function ({url, callBack, onDisconnected, configRetryConnection}) {
        /**
         * check url is already subscribe or not
         * if exist just return object ws
         * if not create new websocket
         * 
        */
        
        if(websocketClients.has(url)) {
            return websocketClients.get(url)
        }

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

        ws.onclose = function(e) {
            console.log('WebSocket is closed');

            websocketClients.delete(url)

            if (e.reason === reasonCloseWS) {
                if (onDisconnected) {
                    onDisconnected('WebSocket connection closed.', e.reason)
                }
            }
            else {
                configRetryConnection = !configRetryConnection ? defaultRetry : configRetryConnection

                const params = {
                    url,
                    callBack,
                    onDisconnected,
                    configRetryConnection
                }

                const configRetry = getConfigRetryConnection(configRetryConnection)

                if (configRetry.isUnlimitedReconnect) {
                    setTimeout(function() {
                        retryConnection(params);
                    }, configRetry.durationReconnect);
                }
                else {
                    if (configRetry.reconnectAttempt > 0) {
                        setTimeout(function() {
                            configRetry.reconnectAttempt--
                            params.configRetryConnection.reconnectAttempt = configRetry.reconnectAttempt
                            retryConnection(params);
                        }, configRetry.durationReconnect);
                    }
                    else {
                        // finished
                        if (onDisconnected) {
                            onDisconnected('WebSocket connection closed.', e.reason)
                        }
                    }
                }
            }

            
        };

        websocketClients.set(url, ws)

        return ws
    },
    unsubscribe: function(ws, callBack) {
        // Disconnect the WebSocket
        const url = ws.url
        if (ws) {
            // Close the connection with a reason
            ws.close(1000, reasonCloseWS)

            websocketClients.delete(url)
            
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

function retryConnection(params) {
    initWebSocket.subscribe(params)
}

function getConfigRetryConnection(configRetryConnection) {
    if (configRetryConnection) {
        if (configRetryConnection.reconnectAttempt === null || configRetryConnection.reconnectAttempt === undefined) {
            configRetryConnection.reconnectAttempt = defaultRetry.reconnectAttempt
        }
        if (configRetryConnection.isUnlimitedReconnect === null || 
            configRetryConnection.isUnlimitedReconnect === undefined) {
            configRetryConnection.isUnlimitedReconnect = defaultRetry.isUnlimitedReconnect
        }
        if (!configRetryConnection.durationReconnect || configRetryConnection.durationReconnect < 0) {
            configRetryConnection.durationReconnect = defaultRetry.durationReconnect
        }
    }
    else {
        configRetryConnection = defaultRetry
    }
    return configRetryConnection
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