"use client"

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { InfoIcon } from "lucide-react";
import { useState } from "react";

export default function PromotionGuidePage() {
  const [show, setShow] = useState(false);
  const [url, setUrl] = useState('');
  const [genre, setGenre] = useState('');

  const handleToggle = () => setShow(!show);

  const handleBookNow = () => {
    // Handle the booking here
  };

  return (
    // <Form {...form}>
    // <form onSubmit={handleBookNow}>
    <div className="p-5">
      {/* <h2 className="text-xl">How it works</h2>
      <p className="mt-4">
        This section explains how the fan promotion feature works. It details that the track will get a dedicated promo placement on top of the Top 100 Charts and New Releases pages. There is also a visual example showing where the track will be placed. It allows setting a budget to control the track’s visibility and mentions a high play conversion of 5% - 10%. A bonus feature is offered for campaigns booked for $50 or more, where the track will be reposted on a specified SoundCloud channel.
      </p>
      <Button size="sm" onClick={handleToggle} className="mt-4">
        Show More
      </Button> */}
      {/* <FormField
      control={form.control}
          name="username"
          render={({ field }) => ( */}
        {/* // <FormItem> */}
      <Collapsible>
        <CollapsibleTrigger className="text-lg mt-5">Select music</CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <p>Users are prompted to provide the source URL for their track, suggesting that the service will use this URL to fetch and promote the music.</p>
          <div className="flex items-center mt-4">
            <Input 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              placeholder="Enter the source URL for your track"
              className="mr-2"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant='ghost'>
                    <InfoIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Please only use Fan Promotion if your track shows up in the preview above. If your track does NOT show up, please make it public before launching your campaign.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button className="mt-4">
            Next
          </Button>
        </CollapsibleContent>
      </Collapsible>
      {/* </FormItem> */}
    {/* //   </FormField> */}
    <Collapsible>
        <CollapsibleTrigger className="text-lg mt-5">Genre</CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
        <p>Select the genre of your title.</p>
          <div className="mt-4">
          <Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select Genre" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select>
          </div>
          <Button className="mt-4">
            Next
          </Button>
            </CollapsibleContent>
    </Collapsible>
    <Collapsible>
        <CollapsibleTrigger className="text-lg mt-5">Campaign settings</CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
        {/* <p>Select the genre of your title.</p> */}
          <div className="mt-4">
          <Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Set Budget" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="5">$5 - Reach up to 2,000 fans</SelectItem>
    <SelectItem value="10">$10 - Reach up to 4,000 fans</SelectItem>
    <SelectItem value="20">$20 - Reach up to 8,000 fans</SelectItem>
    <SelectItem value="50">$50 - Reach up to 20,000 fans</SelectItem>
    <SelectItem value="100">$100 - Reach up to 40,000 fans</SelectItem>
  </SelectContent>
</Select>
</div>
<p>Enter URL where fans can get this track (e.g., download gate, store, streaming)</p>
          <div className="flex items-center mt-4">
            <Input 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              placeholder="https://"
              className="mr-2"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant='ghost'>
                    <InfoIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Please only use Fan Promotion if your track shows up in the preview above. If your track does NOT show up, please make it public before launching your campaign.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          <Button className="mt-4">
            Next
          </Button>
          </div>
        </CollapsibleContent>
    </Collapsible>
    <Collapsible>
        <CollapsibleTrigger className="text-lg mt-5">Confirmation</CollapsibleTrigger>
        <CollapsibleContent className="mt-2">Details about confirmation...</CollapsibleContent>
    </Collapsible>
    </div>
    // </form>
    // </Form>
  );
}