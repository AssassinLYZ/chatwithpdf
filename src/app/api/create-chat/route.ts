import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { eq, sql } from "drizzle-orm";
import { getS3Url } from "@/lib/s3";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { checkSubscription } from "@/lib/subscription";
import { FreePdfCount } from "@/lib/enum";
// /api/create-chat
export async function POST(req: Request, res: Response) {
  const isPro = await checkSubscription();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { file_key, file_name } = body;
    console.log(file_key, file_name, isPro);
    let pdfNum;
    if (isPro) {
      const number = await db
        .select()
        .from(chats)
        .where(eq(chats.userId, userId));
      pdfNum = number.length;
      console.log(pdfNum);
      if (pdfNum >= FreePdfCount.number) {
        return NextResponse.json(
          {
            isIllegal: false,
          },
          { status: 200 }
        );
      }
    }

    await loadS3IntoPinecone(file_key);
    const chat_id = await db
      .insert(chats)
      .values({
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl: getS3Url(file_key),
        userId,
      })
      .returning({
        insertedId: chats.id,
      });
    // return NextResponse.json(
    //   {
    //     pages,
    //   },
    //   { status: 200 }
    // );

    return NextResponse.json(
      {
        isIllegal: true,
        chat_id: chat_id[0].insertedId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
