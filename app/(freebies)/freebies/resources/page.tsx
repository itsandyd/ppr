import { ResourceCard } from "@/components/freebies/ResourceCard"

// This would typically come from an API or database
const resources = [
  {
    id: "1",
    title: "Ultimate Mixing Cheat Sheet",
    description: "Unlock the secrets to professional-sounding mixes with our comprehensive cheat sheet.",
    type: "Cheat Sheet",
    downloads: 1234,
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "2",
    title: "Lo-Fi Hip Hop Sample Pack",
    description: "Get that perfect lo-fi vibe with our curated collection of samples and loops.",
    type: "Sample Pack",
    downloads: 2345,
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "3",
    title: "EDM Drop Project File",
    description: "Dissect and learn from a professionally crafted EDM drop in Ableton Live.",
    type: "Project File",
    downloads: 3456,
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "4",
    title: "Vocal Processing Techniques",
    description: "Learn advanced vocal processing techniques used in top-charting tracks.",
    type: "Tutorial",
    downloads: 1789,
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "5",
    title: "Synthesizer Presets Collection",
    description: "A comprehensive collection of synthesizer presets for various genres.",
    type: "Preset Pack",
    downloads: 2890,
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
]

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Production Resources</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  )
}

