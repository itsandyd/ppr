import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CompanionHistoryClient } from "./components/client";

interface CompanionHistoryPageProps {
  params: {
    companionId: string;
  };
}

const CompanionHistoryPage = async ({ params }: CompanionHistoryPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const companion = await db.companion.findUnique({
    where: {
      id: params.companionId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "desc"
        },
        where: {
          userId: userId
        },
        take: 50,
      },
      _count: {
        select: {
          messages: true
        }
      }
    }
  });

  if (!companion) {
    return redirect("/");
  }

  return <CompanionHistoryClient companion={companion} />;
};

export default CompanionHistoryPage; 