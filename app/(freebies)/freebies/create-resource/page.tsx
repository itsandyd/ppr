import CreateResourceForm from "@/components/freebies/CreateResourceForm"

export default function CreateResourcePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Create a New Resource</h1>
        <p className="text-gray-400 mb-6">
          Share valuable content with the community. You can require users to follow you 
          on social media or provide their email address to access your resource.
        </p>
        <CreateResourceForm />
      </div>
    </div>
  )
}

