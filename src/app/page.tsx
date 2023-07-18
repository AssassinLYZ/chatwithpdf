import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
import { checkSubscription } from "@/lib/subscription";
import SubscriptionButton from "@/components/SubscriptionButton";
import FileUpload from "@/components/FileUpload";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { FreePdfCount } from "@/lib/enum";
export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;
  const isPro = await checkSubscription();
  let chatItems = [],
    firstChat;
  if (userId) {
    chatItems = await db.select().from(chats).where(eq(chats.userId, userId));
    if (chatItems) {
      firstChat = chatItems[0];
    }
  }
  return (
    <div className="w-screen min-h-screen ">
      <div className="absolute right-10 top-10 ">
        <UserButton afterSignOutUrl="/" />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center mb-10 justify-between ">
            <h1 className="ml-3 text-3xl font-semibold md:text-5xl">
              Chat with PDF
            </h1>
          </div>
          <p className="max-w-xl mt-1 text-lg text-slate-600">
            ChatPDF is an AI-powered app that will make reading journal articles
            easier and faster.
          </p>
          {!isPro && (
            <p className="max-w-xl mt-1 text-lg text-slate-600 font-bold">
              Note: You have a Free Trial for Three Files to Use.
              <br />
              You have&nbsp;
              {chatItems?.length > FreePdfCount.number
                ? 0
                : FreePdfCount.number - chatItems?.length}{" "}
              Files Left!
            </p>
          )}
          {isPro && (
            <p className="max-w-xl mt-1 text-lg text-green-600 font-bold">
              You are a Pro Now!
            </p>
          )}
          <div className="w-full mt-10 ">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href="/sign-in">
                <Button>
                  Login to get Started!
                  <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
          <div className="flex mt-2 mt-10">
            {isAuth && firstChat && (
              <>
                <Link href={`/chat/${firstChat.id}`}>
                  <Button>
                    Go to Chats <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                <div className="ml-3">
                  <SubscriptionButton isPro={isPro} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
