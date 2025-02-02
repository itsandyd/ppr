"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { scheduleCampaign } from '@/actions/promo-pulse/schedule-campaign'

export function CampaignScheduler({ campaigns }: { campaigns: any[] }) {
  const [selectedCampaign, setSelectedCampaign] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const { toast } = useToast()

  const handleScheduleCampaign = async () => {
    const result = await scheduleCampaign(selectedCampaign, date, time);

    if (result.success) {
      console.log('Scheduling campaign:', result.scheduledCampaign);
      toast({
        title: "Campaign Scheduled",
        description: `Your campaign "${selectedCampaign}" has been scheduled for ${date} at ${time}.`,
      });
    } else {
      console.error('[HANDLE_SCHEDULE_CAMPAIGN]', result.error);
      toast({
        title: "Error",
        description: "Failed to schedule campaign. Please try again.",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Scheduler</CardTitle>
        <CardDescription>Schedule your email campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="campaign">Select Campaign</Label>
            <Select onValueChange={setSelectedCampaign}>
              <SelectTrigger id="campaign">
                <SelectValue placeholder="Select campaign" />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleScheduleCampaign}>Schedule Campaign</Button>
      </CardFooter>
    </Card>
  )
}

