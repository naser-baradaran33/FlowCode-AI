import { z } from "zod";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { inngest } from "@/inngest/client";


import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const requestSchema = z.object({
  conversationId: z.string(),
  message: z.string(),
});

export async function POST(request: Request) {
  const { convex } = await import("@/lib/convex-client");
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const internalKey = process.env.FLOWCODEAI_CONVEX_INTERNAL_KEY;

  if (!internalKey) {
    return NextResponse.json(
      { error: "Internal key not configured" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const parsedBody = requestSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { conversationId, message } = parsedBody.data;

  try {
    // Call convex mutation, query
    const conversation = await convex.query(api.system.getConversationById, {
      internalKey,
      conversationId: conversationId as Id<"conversations">,
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const projectId = conversation.projectId;

    // Find all processing messages in this project
    const processingMessages = await convex.query(
      api.system.getProcessingMessages,
      {
        internalKey,
        projectId,
      }
    );

    if (processingMessages.length > 0) {
      // Cancel all processing messages
      await Promise.all(
        processingMessages.map(async (msg) => {
          await inngest.send({
            name: "message/cancel",
            data: {
              messageId: msg._id,
            },
          });

          await convex.mutation(api.system.updateMessageStatus, {
            internalKey,
            messageId: msg._id,
            status: "cancelled",
          });
        })
      );
    }

    // Create user message
    await convex.mutation(api.system.createMessage, {
      internalKey,
      conversationId: conversationId as Id<"conversations">,
      projectId,
      role: "user",
      content: message,
    });

    // Create assistant message placeholder with processing status
    const assistantMessageId = await convex.mutation(
      api.system.createMessage,
      {
        internalKey,
        conversationId: conversationId as Id<"conversations">,
        projectId,
        role: "assistant",
        content: "",
        status: "processing",
      }
    );

    // Trigger Inngest to process the message
    const event = await inngest.send({
      name: "message/sent",
      data: {
        messageId: assistantMessageId,
        conversationId,
        projectId,
        message,
      },
    });

    return NextResponse.json({
      success: true,
      eventId: event.ids[0],
      messageId: assistantMessageId,
    });
  } catch (error) {
    console.error("Failed to process message", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown server error";

    if (
      errorMessage.includes("Invalid internal key") ||
      errorMessage.includes("FLOWCODEAI_CONVEX_INTERNAL_KEY is not configured")
    ) {
      return NextResponse.json(
        {
          error:
            "Server configuration mismatch between Vercel and Convex (FLOWCODEAI_CONVEX_INTERNAL_KEY).",
        },
        { status: 500 }
      );
    }

    if (errorMessage.includes("Missing Convex deployment URL")) {
      return NextResponse.json(
        { error: "Convex URL is missing in server environment variables." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Unable to process message." },
      { status: 500 }
    );
  }
};
