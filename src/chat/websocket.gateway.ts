import { OnModuleInit } from '@nestjs/common';
import {
    ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './service/chat.service';
import { ChatDto } from './dto/chat.dto';

@WebSocketGateway(8081, {})
export class ChatGateWay {
  // export class ChatGateWay implements OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: ChatService) {}

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: ChatDto) {
    const message = await this.messageService.create(createMessageDto);
    this.server.emit('message', message);

    return message;
  }

  @SubscribeMessage('findAllMessages')
  findAllMessages() {
    return this.messageService.findAll();
  }

  @SubscribeMessage("join")
  joinRoom(@MessageBody() name: string, @ConnectedSocket() client: Socket) {
     this.messageService.identify(name, client.id)
     client.broadcast.emit('join', {
        message: `${name} Joined the chat`
     })
    
  }

  @SubscribeMessage('typing')
  async typing(@MessageBody('isTyping') isTyping: boolean, @ConnectedSocket() client: Socket){

    const name = await this.messageService.getClientName(client.id)

    client.broadcast.emit('typing', {name, isTyping})
  }

  // onModuleInit() {
  //     this.server.on('connection', (client)=>{
  //     client.broadcast.emit("user-join",{
  //         message: `The following user ${client.id} Joined the chat`
  //     }

  //     )
  //     })

  //     this.server.off('connection', (client)=>{
  //         this.server.emit("user-left",{
  //             message: `The following user ${client.id} left the chat`
  //         })
  //     })

  // }

  // handleConnection(client: Socket, ...args: any[]) {

  //         // console.log(`User with following ID ${client.id} connected `)
  // }

  // handleDisconnect(client: any) {
  //     console.log("disconnected")

  // }

  // @SubscribeMessage("chat")
  // handleChatEvent(@MessageBody() data: unknown): WsResponse<unknown>{
  //     const event = "chat"
  //     this.server.emit('room 1', {
  //             type: "New message",
  //             message: data
  //     })

  //     return {event, data}
  // }
}
