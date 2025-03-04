import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { BulkAccessForm } from "./components/bulk-access-form";

const ADMIN_USER_IDS = ["user_2Oy4M1qbxPKHdE3yGcQxJXxJQQJ"]; // Replace with your admin user IDs

export default async function BulkAccessPage() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  // Check if user is admin
  // if (!ADMIN_USER_IDS.includes(userId)) {
  //   return redirect("/academy/dashboard");
  // }

  // Fetch all published courses
  const courses = await db.course.findMany({
    where: {
      isPublished: true,
    },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      price: true,
    },
    orderBy: {
      title: "asc",
    },
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">User Migration & Course Access</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Import users from your old platform and grant them course access. Upload a CSV file containing user details.
        </p>
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h2 className="text-sm font-semibold mb-2">CSV Format Requirements:</h2>
          <p className="text-sm text-muted-foreground">
            Your CSV file should include the following columns:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-1">
            <li>Email (required)</li>
            <li>Name (optional)</li>
            <li>Purchase Date (optional, format: YYYY-MM-DD)</li>
            <li>Original Purchase ID (optional)</li>
          </ul>
        </div>
      </div>
      <BulkAccessForm courses={courses} />
    </div>
  );
} 