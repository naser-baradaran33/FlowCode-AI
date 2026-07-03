"use client";

import { Allotment } from "allotment";

import { ConversationSidebar } from "@/features/conversations/components/converstation-sidebar";

import { Navbar } from "./navbar";
import { Id } from "../../../../convex/_generated/dataModel";

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 800;
const DEFAULT_CONVERSATION_SIDEBAR_WIDTH = 400;
const DEFAULT_MAIN_SIZE = 1000;

export const ProjectIdLayout = ({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: Id<"projects">;
}) => {
  return (
    <div className="w-full h-screen min-h-0 flex flex-col">
      <Navbar projectId={projectId} />
      <div className="flex-1 min-h-0 flex overflow-hidden">
        <Allotment
          className="flex-1 min-h-0"
          defaultSizes={[
            DEFAULT_CONVERSATION_SIDEBAR_WIDTH,
            DEFAULT_MAIN_SIZE
          ]}
        >
          <Allotment.Pane
            snap
            minSize={MIN_SIDEBAR_WIDTH}
            maxSize={MAX_SIDEBAR_WIDTH}
            preferredSize={DEFAULT_CONVERSATION_SIDEBAR_WIDTH}
          >
            <div className="h-full min-h-0">
              <ConversationSidebar projectId={projectId} />
            </div>
          </Allotment.Pane>
          <Allotment.Pane>
            <div className="h-full min-h-0">
              {children}
            </div>
          </Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
};
