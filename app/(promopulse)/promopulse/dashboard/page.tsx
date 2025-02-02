import { Metadata } from "next"
import Image from "next/image"
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { CalendarDateRangePicker } from "./_components/date-range-picker"
import TeamSwitcher from "./_components/team-switcher"
import { Search } from "./_components/search"
import { Overview } from "./_components/overview"
import { RecentSales } from "./_components/recent-sales"
import { EmailTemplateEditor } from "./_components/email-template-editor"
import { CampaignScheduler } from "./_components/campaign-scheduler"
import { RecipientDatabase } from "./_components/recipient-database"
import { MusicProfileIntegration } from "./_components/music-profile-integration"
import { CampaignMetricsCard } from "./_components/dashboard/campaign-metrics-card"
import { db } from "@/lib/db"
import { getCampaignCount } from "@/actions/promo-pulse/get-campaign-count"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
}

export default async function DashboardPage() {
    const { userId } = auth();
    const campaigns = await db.campaign.findMany();
    const emailTemplates = await db.emailTemplate.findMany();
    const totalCampaigns = await getCampaignCount();
  
    if (!userId) {
      redirect('/');
    }
  
    return (
      <>
        <div className="md:hidden">
          <Image
            src="/examples/dashboard-light.png"
            width={1280}
            height={866}
            alt="Dashboard"
            className="block dark:hidden"
          />
          <Image
            src="/examples/dashboard-dark.png"
            width={1280}
            height={866}
            alt="Dashboard"
            className="hidden dark:block"
          />
        </div>
        <div className="hidden flex-col md:flex">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <TeamSwitcher />
              {/* <MainNav className="mx-6" /> */}
              <div className="ml-auto flex items-center space-x-4">
                <Search />
                {/* <UserNav /> */}
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <div className="flex items-center space-x-2">
                <CalendarDateRangePicker />
                <Button>Download</Button>
              </div>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                <TabsTrigger value="recipients">Recipients</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {/* <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Campaigns
                      </CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">15</div>
                      <p className="text-xs text-muted-foreground">
                        +2 from last month
                      </p>
                    </CardContent>
                  </Card> */}
                       <CampaignMetricsCard totalCampaigns={totalCampaigns} />
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Recipients
                      </CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"

                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+2,350</div>
                      <p className="text-xs text-muted-foreground">
                        +180 from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <path d="M2 10h20" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">32.5%</div>
                      <p className="text-xs text-muted-foreground">
                        +2.5% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Click-through Rate
                      </CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">24.3%</div>
                      <p className="text-xs text-muted-foreground">
                        +5.1% from last month
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Campaign Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <Overview />
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Recent Campaigns</CardTitle>
                      <CardDescription>
                        You sent 10 campaigns this month.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecentSales />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="analytics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics</CardTitle>
                    <CardDescription>Detailed campaign analytics coming soon.</CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
              <TabsContent value="campaigns" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <EmailTemplateEditor emailTemplates={emailTemplates} />
                  <CampaignScheduler campaigns={campaigns} />
                </div>
              </TabsContent>
              <TabsContent value="recipients" className="space-y-4">
                <RecipientDatabase />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </>
    )
  }
  

