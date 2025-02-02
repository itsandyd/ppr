"use client"

import { VectorSetup } from "@/app/(admin)/admin/vector-setup/_components/vector-setup";


export default function VectorSetupPage() {
  return (
    <div className="h-full p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Vector Setup</h1>
        <p className="text-sm text-muted-foreground">
          Set up vector columns for AI-powered search functionality
        </p>
      </div>
      <VectorSetup />
    </div>
  );
} 