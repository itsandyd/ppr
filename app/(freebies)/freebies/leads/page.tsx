"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { format } from "date-fns"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Download } from "lucide-react"

type Lead = {
  id: string;
  name: string;
  email: string;
  resourceId: string;
  createdAt: string;
  resource: {
    title: string;
    slug: string;
  }
}

type ResourceWithLeads = {
  id: string;
  title: string;
  slug: string;
  leads: Lead[];
}

export default function LeadsPage() {
  const [resources, setResources] = useState<ResourceWithLeads[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedResource, setSelectedResource] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchLeads() {
      try {
        const response = await fetch('/api/resources/leads')
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch leads')
        }
        
        setResources(data.resources || [])
      } catch (err) {
        console.error('Error fetching leads:', err)
        setError('Failed to load leads data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [])

  // Get all leads in a flat array
  const allLeads = resources.flatMap(resource => 
    resource.leads.map(lead => ({
      ...lead,
      resourceTitle: resource.title,
      resourceSlug: resource.slug
    }))
  )

  // Filter leads based on selected resource and search query
  const filteredLeads = allLeads.filter(lead => {
    const matchesResource = selectedResource === "all" || lead.resourceId === selectedResource
    const matchesSearch = 
      searchQuery === "" || 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.resourceTitle.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesResource && matchesSearch
  })

  // Export leads to CSV
  const exportLeads = () => {
    const headers = ["Name", "Email", "Resource", "Date"]
    const csvData = filteredLeads.map(lead => [
      lead.name,
      lead.email,
      lead.resourceTitle,
      format(new Date(lead.createdAt), 'yyyy-MM-dd')
    ])
    
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `leads-export-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const totalLeads = allLeads.length

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Resource Leads</h1>
      <p className="text-gray-400 mb-6">View all leads who have downloaded your gated resources.</p>
      
      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-destructive/20 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {!loading && resources.length === 0 && !error && (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium mb-2">No leads found</h3>
          <p className="text-gray-400">
            No one has downloaded your gated resources yet, or you don&apos;t have any gated resources.
          </p>
          <a 
            href="/freebies/create-resource" 
            className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
          >
            Create Resource
          </a>
        </div>
      )}
      
      {!loading && resources.length > 0 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800 rounded-md">
                  <p className="text-gray-400 text-sm">Total Leads</p>
                  <p className="text-3xl font-bold">{totalLeads}</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-md">
                  <p className="text-gray-400 text-sm">Resources with Leads</p>
                  <p className="text-3xl font-bold">{resources.filter(r => r.leads.length > 0).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>All Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="md:w-1/3">
                  <Select 
                    value={selectedResource} 
                    onValueChange={setSelectedResource}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by resource" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Resources</SelectItem>
                      {resources.map(resource => (
                        <SelectItem key={resource.id} value={resource.id}>
                          {resource.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:w-2/3 flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search by name, email or resource"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={exportLeads}
                    title="Export to CSV"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {filteredLeads.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Resource</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.map(lead => (
                        <TableRow key={lead.id}>
                          <TableCell>{lead.name}</TableCell>
                          <TableCell>{lead.email}</TableCell>
                          <TableCell>{lead.resourceTitle}</TableCell>
                          <TableCell>
                            {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No leads match your filters.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 