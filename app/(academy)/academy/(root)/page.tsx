import { LandingContent } from "@/components/courses/landing/landing-content";
import { LandingHero } from "@/components/courses/landing/landing-hero";
import React from "react";

const CoursePage = () => {
    return (
        <div className="h-full ">
          <LandingHero />
          {/* <LandingContent /> */}
        </div>
     );
}

export default CoursePage;