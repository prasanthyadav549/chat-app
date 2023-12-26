const express = require('express');
const app = express();
const http = require('http');
const { SocketAddress } = require('net');
const server = http.createServer(app);
const {Server} = require('socket.io')
const io = new Server(server)
const {Connect} = require('./config')
const {Group,Chat} = require('./models')

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/',express.static(__dirname + '/public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


let users = [
  {
     id: 'prasanth@1',
    name: 'prasanth'
  },

  {
    id: 'smarty@1',
    name: 'smarty'
  },
  {
    id: 'hero@1',
    name: 'hero'
  }
 ]

io.on('connection', (socket) => {
    console.log('a user connected',socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected',socket.id);
      });
      // socket.on('from_client',()=> {
      //      console.log('from_client connected',socket.id);
      // })

      // setInterval(function f(){
      //    socket.emit('from_server')
      // },3000)

      socket.on('join_room', (data) => {
            console.log('Room id', data.roomid);
            socket.join(data.roomid)
      })

      socket.on('new_msg', async (data)=> {
          console.log('new msg', data)
          const chat = await Chat.create({
            content: data.message,
            roomid: data.roomid,
            sender: data.sender
          })
          io.to(data.roomid).emit('msg_recvd', data);
      })

      socket.on('oneToOneChat', async (data)=> {
            console.log('oneTo',data)
            let sender = 'yadav@123'
            let ids = [sender,data.receiverId]
            ids.sort()
            let groupName = ids.join(',')
            let group = await Group.findOne({
                name: groupName,
            })
            if(group) {
                console.log(group)  
            }
            else {
               group = await Group.create({
                 name: groupName,
               })
               console.log('new group created', group)
            }
            socket.emit('groupId',{
              groupId: group.id,
              sender: sender,
            })
      })
  });

  app.get('/chat/:roomid/:user', async (req,res) => {
        const group =  await Group.findById(req.params.roomid);
        const chats = await Chat.find({
            roomid: req.params.roomid
        })
        res.render('index', {
           roomid: req.params.roomid,
           user: req.params.user,
           groupName: group.name,
           previousMessages: chats
        })
  })

  app.get('/group', async (req,res)=> {
      res.render('group');
  })

  app.post('/group', async (req,res)=> {
         console.log('group id created', req.body);
         await Group.create({
            name: req.body.name,
         })
         res.redirect('/group')
  })

  app.get('/one-to-one', async (req,res)=> {
       console.log('users are ',users);
        res.render('oneToOne',
          {
            users: users
          }
         )
  })
server.listen(3000, () => {
  console.log('listening on *:3000');
  Connect();
  console.log('db connected ');
});

// basic change