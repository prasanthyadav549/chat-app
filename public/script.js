document.addEventListener('DOMContentLoaded', ()=> {
    console.log('welcome to sockets');
    var socket = io()  // when this line executes this will create the socket connection from client to the (server)
    
    // socket.on('from_server', ()=> {
    //     let div = document.getElementById('from_server');
    //     let p = document.createElement('p');
    //     let btn = document.getElementById('btn');
    //     p.textContent = 'Received an event from the sever';
    //     div.appendChild(p);
    //     btn.addEventListener('click', ()=>{
    //         socket.emit('from_client')
    //     })
    // })
    
    let input = document.getElementById('chat_box');
    let msgList = document.getElementById('msg_list');
    let send = document.getElementById('send');
    send.addEventListener('click',()=> {
        let msg = input.value;
        socket.emit('new_msg', {
            message: msg
        })
    } )
  socket.on('msg_recvd', (data)=> {
       let li = document.createElement('li');
       li.textContent = data.message;
       msgList.appendChild(li);
  })
})