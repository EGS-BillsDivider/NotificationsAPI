'use strict'
/**
 * import using:
 * <script type="module" src="socket.js"></script>
 */

const apiHost = "http://127.0.0.1:3000"

let socket = null;

export const registerCallback = (event, callback) => {
    socket.on(event, callback);
}

const notificationHandle = notification => {
    console.log(notification)
}

export const createSocket = uid => {
    if (socket) {
        socket.close()
    }
    socket = io(apiHost + '/', {
        transports: ['websocket'],
        auth: {
            token: uid
        }
    });

    registerCallback("connect_error", err => {
        console.log(`socket.io connect_error due to ${err.message}`);
    })

    registerCallback('Notification', notificationHandle);
}

document.getElementById('user_btn').onclick = ev => {
    ev.preventDefault();
    createSocket(document.getElementById('uid').value);
}

document.getElementById('cr_ch_btn').onclick = ev => {
    ev.preventDefault();

    const data = {
        user: document.getElementById("uid").value,
        name: document.getElementById("cr_channel").value
    }

    const myHeaders = new Headers();
    myHeaders.append('Authorization', data.user);
    myHeaders.append("Content-Type", "application/json")

    fetch(apiHost + '/channel', {
        headers: myHeaders,
        method: 'POST',
        body: JSON.stringify(data),
    }).catch(console.error);
}


document.getElementById('jn_ch_btn').onclick = ev => {
    ev.preventDefault();

    const data = {
        user: document.getElementById("uid").value,
        name: document.getElementById("jn_channel").value
    }

    const myHeaders = new Headers();
    myHeaders.append('Authorization', data.user);
    myHeaders.append("Content-Type", "application/json")

    fetch(apiHost + '/channel', {
        headers: myHeaders,
        method: 'PUT',
        body: JSON.stringify(data),
    }).catch(console.error);
}

document.getElementById('submit_bttn').onclick = ev => {
    ev.preventDefault();

    const data = {
        msg: document.getElementById("msg").value,
        channel_name: document.getElementById("nt_channel").value
    }

    const myHeaders = new Headers();
    // myHeaders.append('Authorization', data.user);
    myHeaders.append("Content-Type", "application/json")

    fetch(apiHost + '/notification', {
        headers: myHeaders,
        method: 'POST',
        body: JSON.stringify(data),
    }).catch(console.error);
}