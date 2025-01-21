import { Body, Controller, Post, Res } from "routing-controllers";
import { messageService, MessageService } from "./message.service";
import { Response } from "express";
import { CreateMessageDTO } from "./dtos";

@Controller("/messages")
export class MessageController {
  messageService: MessageService;

  constructor() {
    this.messageService = messageService;
  }

  @Post("/")
  async createMessage(
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } })
    createMessageDTO: CreateMessageDTO,
    @Res() response: Response
  ) {
    try {
      await this.messageService.createMessage(createMessageDTO);
      return response.status(201).send({ message: "Message sent." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }
}
