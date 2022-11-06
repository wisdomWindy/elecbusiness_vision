
const ws = new WebSocket('ws://localhost:9998');
ws.onopen = () => {
}
ws.onmessage = (msg) => {
    // console.log(msg);
}


ws.onclose = () => {

}

export default {
    install(app) {
        app.config.globalProperties.$ws = ws;
    }
}