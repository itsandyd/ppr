import { redirect } from "next/navigation";
import { auth, redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";

import { CompanionForm } from "./components/companion-form";
import { checkSubscription } from "@/lib/subscriptions";

interface CompanionIdPageProps {
  params: {
    companionId: string;
  };
};

const CompanionIdPage = async ({
  params
}: CompanionIdPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  // const validSubscription = await checkSubscription();

  // if (!validSubscription) {
  //   return redirect("/");
  // }

  const companion = await db.companion.findUnique({
    where: {
      id: params.companionId,
      userId,
    }
  });

  const categories = await db.category.findMany();

  return ( 
    <CompanionForm initialData={companion} categories={categories} />
  );
}
 
export default CompanionIdPage;