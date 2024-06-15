import { Injectable } from "@nestjs/common";
import { ChatEntity } from "../entities/chat.entity";
import { ChatDto } from "../dto/chat.dto";

@Injectable()
export class ChatService {

    message: ChatEntity[] = [{name: 'valentine', messages: "welcome"}];
    clientToUser = {}


    async create(createMessage: ChatDto) {
        const message = {...createMessage}

        this.message.push(message)

        return message

    }


    findAll(){
        return this.message
    }

    identify(name: string, clientId: string){
        this.clientToUser[clientId] = name

        return Object.values(this.clientToUser)
    }

    getClientName(clientId: string){
        return this.clientToUser[clientId];
    }

}