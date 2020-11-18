document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // Configure button
    socket.on('connect', () => {

        // User join
        socket.emit('joined');

        // Forget user's last channel
        document.querySelector('#newChannel').addEventListener('click', () => {
            localStorage.removeItem('last_channel');
        });

        // When user leaves channel redirect to '/'
        document.querySelector('#leave').addEventListener('click', () => {

            // User has left
            socket.emit('left');

            localStorage.removeItem('last_channel');
            window.location.replace('/');
        })

        // 'Enter' key on textarea also sends a message
        document.querySelector('#comment').addEventListener("keydown", event => {
            if (event.key == "Enter") {
                document.getElementById("send-button").click();
            }
        });
        
        // Send button emits a "send message" event
        document.querySelector('#send-button').addEventListener("click", () => {
            
            let timestamp = new Date;
            timestamp = timestamp.toLocaleTimeString();

            // Save user message
            let msg = document.getElementById("comment").value;
            socket.emit('send message', msg, timestamp);
            
            // Clear input
            document.getElementById("comment").value = '';
        });
    });
    
    // When user joins a channel
    socket.on('status', data => {

        // Joined user
        let row = '> ' + `${data.msg}` + ' <'
        document.querySelector('#chat').value += row + '\n';

        // Save user current channel on localStorage
        localStorage.setItem('last_channel', data.channel)

    })

    socket.on('announce message', data => {

        // Format message
        let timestamp = data.timestamp
        let userMessage = data.user
        let message = data.msg
        
        createMessage(timestamp, userMessage, message)
    })

    function createMessage(timestamp, user, msg) {
        let ul = document.querySelector('#chat')
        let userConect = ul.getAttribute('data-user')
        let li = document.createElement('li')
        let p = document.createElement('p')

        let pUser = createElement('p', 'user', user)
        let pMsg = createElement('p', 'msg', msg)
        let pTimestamp = createElement('p', 'timestamp', timestamp)

        li.appendChild(pUser)
        li.appendChild(pMsg)
        li.appendChild(pTimestamp)


        li.setAttribute("class", "messageBox")
        
        ul.append(li)
    }

    function createElement(element, cls, text){
        let el = document.createElement(element)
        el.appendChild(document.createTextNode(text))
        el.setAttribute("class", cls)

        return el
    }

    
});