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
        let row = `${data.timestamp}` + ' - ' + `${data.user}` + ':  ' + `${data.msg}`
        document.querySelector('#chat').value += row + '\n'

    })

    
});