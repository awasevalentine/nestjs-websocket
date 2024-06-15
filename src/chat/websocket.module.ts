import { Module } from "@nestjs/common";
import { ChatGateWay } from "./websocket.gateway";
import { ChatService } from "./service/chat.service";

@Module({
    imports: [],
    providers: [ChatGateWay, ChatService]
})

export class ChatModule{}