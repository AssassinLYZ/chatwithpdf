"use client";
import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import SubscriptionButton from "./SubscriptionButton";
import { useSlide } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";
type Props = {
  chats: DrizzleChat[];
  chatId: number;
  isPro: boolean;
};

const ChatSideBar = ({ chats, chatId, isPro }: Props) => {
  const slide = useSlide();
  const [loading, setLoading] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const clickLink = () => {
    if (isMobile) slide.onClose();
  };

  return (
    slide.isOpen && (
      <div className="md:max-w-xs w-full h-screen p-4  bg-white ">
        <Link href="/">
          <Button className="w-full border-dashed  border bg-white border-black text-black hover:text-white ">
            <PlusCircle className="mr-2 w-4 h-[10vh]" />
            New Chat
          </Button>
        </Link>

        <div className="flex flex-col gap-2 max-h-[calc(100vh_-_10rem)] overflow-y-auto  ">
          {chats.map((chat) => (
            <Link key={chat.id} href={`/chat/${chat.id}`} onClick={clickLink}>
              <div
                className={cn(" p-3 text-gray-500 flex items-center", {
                  "bg-black text-white": chat.id === chatId,
                  "hover:text-black": chat.id !== chatId,
                })}
              >
                <FileText className="mr-2" />
                <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                  {chat.pdfName}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 absolute bottom-4">
          <SubscriptionButton isPro={isPro} />
        </div>
      </div>
    )
  );
};

export default ChatSideBar;
