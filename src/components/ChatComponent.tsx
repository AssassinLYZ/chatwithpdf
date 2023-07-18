"use client";
import React from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { Send, AlignLeft } from "lucide-react";
import MessageList from "./MessageList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";
import { useSlide } from "@/lib/utils";
type Props = { chatId: number };

const ChatComponent = ({ chatId }: Props) => {
  const slide = useSlide();
  // console.log(slide);
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
  });
  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <div
      className="relative h-screen overflow-y-auto md:flex-[3] w-full border-l-4 border-l-slate-200"
      id="message-container"
    >
      {/* header */}
      <div className=" flex items-center sticky top-0 inset-x-0 p-2 bg-white h-fit border-b-2 ">
        <div className="hover:cursor-pointer">
          <AlignLeft onClick={slide.toggle} />
        </div>

        <h3 className="text-xl font-bold ml-2">Chat With Pdf</h3>
      </div>

      {/* message list */}
      <div className="overflow-y-auto  h-[calc(100vh_-_120px)]">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="absolute bottom-0 inset-x-0 px-2 py-4 bg-white"
      >
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full"
          />
          <Button className="bg-black ml-2">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
