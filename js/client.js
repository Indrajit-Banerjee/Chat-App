// const socket = io('http://localhost:8000';

const socket = io('http://localhost:8000',{transports:['websocket']})

//Get DOM elements in respective js variables.
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

//Audio that will play on receiving messages.
var audio = new Audio('files/ting.mp3'); 

//Function which will append event info to the container.
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);

    if(position == 'left'){
        audio.play();
    }

}

//Ask new user for name and let the server know.
const name = prompt("Enter Your Name To Join Chat:");
socket.emit('new-user-joined', name);

//If a new user joins, receive name from the server.
socket.on('user-joined', name=>{
    append(`${name} Joined The Chat`, `right`);
})

//If server sends a message receive it.
socket.on('receive', data=>{
    append(`${data.name}: ${data.message}`, `left`);
})


//If an user leaves chat, append the info to the container.
socket.on('left', name=>{
    append(`${name} Left The Chat`, `right`);
})


//If the form gets submitted, send the server the message.
form.addEventListener('submit', (e)=>{
    e.preventDefault();                                 //It prevents reloding of page.
    const message = messageInput.value;
    append(`You: ${message}`, `right`);                 //Template literals(` `) - allow variables in strings:
    socket.emit('send', message);
    messageInput.value = '';
})
