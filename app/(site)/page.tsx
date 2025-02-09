'use client';

import { LandingHero } from "@/components/landing/landing-hero";
import { LandingContent } from "@/components/landing/landing-content";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Music2, Bot, GraduationCap, Users, 
  Headphones, Radio, PlayCircle, ArrowRight,
  Shield, Award, CheckCircle, Sparkles,
  Zap, Wand2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const LandingPage = () => {
  return (
    <div className="h-full bg-background">
      {/* Hero Section */}
      <LandingHero />

      {/* Social Proof Section with Improved Animation */}
      <motion.div 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="w-full border-t border-b border-muted/20 bg-gradient-to-b from-muted/10 to-transparent py-6 mb-20"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {/* {[
              { src: "/logos/ableton.svg", alt: "Ableton" },
              { src: "/logos/logic.svg", alt: "Logic Pro" },
              { src: "/logos/fl-studio.svg", alt: "FL Studio" },
              { src: "/logos/pro-tools.svg", alt: "Pro Tools" }
            ].map((logo) => (
              <motion.div
                key={logo.alt}
                variants={fadeInUp}
                className="relative w-[120px] h-[40px]"
              >
                <Image 
                  src={logo.src} 
                  alt={logo.alt} 
                  fill
                  className="object-contain opacity-50 hover:opacity-100 transition-opacity duration-300"
                />
              </motion.div>
            ))} */}
          </div>
        </div>
      </motion.div>

      {/* Value Proposition with Enhanced Stats */}
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">Why Choose PausePlayRepeat?</Badge>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Everything You Need to Succeed in Music
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From creation to promotion, we provide the tools and resources modern musicians need to thrive in today&apos;s industry.
          </p>
        </motion.div>

        {/* Stats Section with Animation */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20"
        >
          {[
            { number: "10K+", label: "Active Musicians", subtext: "Growing community", gradient: "from-sky-300 to-pink-400" },
            { number: "500+", label: "Expert Courses", subtext: "Industry-led training", gradient: "from-purple-400 to-pink-600" },
            { number: "1M+", label: "Tracks Created", subtext: "On our platform", gradient: "from-sky-300 to-pink-400" },
            { number: "98%", label: "Satisfaction", subtext: "User rating", gradient: "from-purple-400 to-pink-600" }
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              className="bg-muted/5 backdrop-blur-sm border border-muted/10 p-6 rounded-xl text-center hover:bg-muted/10 transition-colors duration-300"
            >
              <h3 className={`text-5xl font-bold bg-gradient-to-r ${stat.gradient} text-transparent bg-clip-text mb-2`}>
                {stat.number}
              </h3>
              <p className="text-muted-foreground">{stat.label}</p>
              <span className="text-xs mt-2 block">{stat.subtext}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* AI Features Section */}
        <div className="relative py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/5 via-muted/10 to-muted/5 rounded-3xl" />
          <div className="relative">
            <LandingContent />
          </div>
        </div>

        {/* Feature Cards with Enhanced UI */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32"
        >
          {/* Music Production */}
          <Card className="group p-6 hover:shadow-xl transition-all duration-300 border border-muted/20 bg-muted/5 backdrop-blur-sm hover:bg-muted/10">
            <div className="relative h-40 mb-6 rounded-lg overflow-hidden">
              {/* <Image src="/features/studio.jpg" alt="Music Studio" fill className="object-cover group-hover:scale-105 transition duration-300" /> */}
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
            <Music2 className="w-12 h-12 text-sky-400 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Music Studio</h3>
            <p className="text-muted-foreground mb-4">
              Professional-grade production tools integrated with leading DAWs.
            </p>
            <Button variant="link" className="group-hover:text-sky-400 transition-colors">
              Explore Studio <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Card>
          
          {/* AI Assistant */}
          <Card className="group p-6 hover:shadow-xl transition-all duration-300 border border-muted/20 bg-muted/5 backdrop-blur-sm hover:bg-muted/10">
            <div className="relative h-40 mb-6 rounded-lg overflow-hidden">
              {/* <Image src="/features/ai.jpg" alt="AI Assistant" fill className="object-cover group-hover:scale-105 transition duration-300" /> */}
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
            <Bot className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">AI Assistant</h3>
            <p className="text-muted-foreground mb-4">
              AI-powered composition and mixing tools at your fingertips.
            </p>
            <Button variant="link" className="group-hover:text-purple-400 transition-colors">
              Try AI Tools <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Card>

          {/* Academy */}
          <Card className="group p-6 hover:shadow-xl transition-all duration-300 border border-muted/20 bg-muted/5 backdrop-blur-sm hover:bg-muted/10">
            <div className="relative h-40 mb-6 rounded-lg overflow-hidden">
              {/* <Image src="/features/academy.jpg" alt="Academy" fill className="object-cover group-hover:scale-105 transition duration-300" /> */}
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
            <GraduationCap className="w-12 h-12 text-pink-400 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Academy</h3>
            <p className="text-muted-foreground mb-4">
              Learn from industry experts with hands-on courses.
            </p>
            <Button variant="link" className="group-hover:text-pink-400 transition-colors">
              Start Learning <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Card>

          {/* Community */}
          <Card className="group p-6 hover:shadow-xl transition-all duration-300 border border-muted/20 bg-muted/5 backdrop-blur-sm hover:bg-muted/10">
            <div className="relative h-40 mb-6 rounded-lg overflow-hidden">
              {/* <Image src="/features/community.jpg" alt="Community" fill className="object-cover group-hover:scale-105 transition duration-300" /> */}
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
            <Users className="w-12 h-12 text-sky-400 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Community</h3>
            <p className="text-muted-foreground mb-4">
              Connect and collaborate with fellow musicians worldwide.
            </p>
            <Button variant="link" className="group-hover:text-sky-400 transition-colors">
              Join Community <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Card>

          {/* Coaching */}
          <Card className="group p-6 hover:shadow-xl transition-all duration-300 border border-muted/20 bg-muted/5 backdrop-blur-sm hover:bg-muted/10">
            <div className="relative h-40 mb-6 rounded-lg overflow-hidden">
              {/* <Image src="/features/coaching.jpg" alt="Coaching" fill className="object-cover group-hover:scale-105 transition duration-300" /> */}
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
            <Headphones className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Coaching</h3>
            <p className="text-muted-foreground mb-4">
              Get personalized guidance from industry professionals.
            </p>
            <Button variant="link" className="group-hover:text-purple-400 transition-colors">
              Find a Coach <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Card>

          {/* PromoPulse */}
          <Card className="group p-6 hover:shadow-xl transition-all duration-300 border border-muted/20 bg-muted/5 backdrop-blur-sm hover:bg-muted/10">
            <div className="relative h-40 mb-6 rounded-lg overflow-hidden">
              {/* <Image src="/features/promo.jpg" alt="PromoPulse" fill className="object-cover group-hover:scale-105 transition duration-300" /> */}
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
            <Radio className="w-12 h-12 text-pink-400 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">PromoPulse</h3>
            <p className="text-muted-foreground mb-4">
              Powerful tools to promote your music and grow your audience.
            </p>
            <Button variant="link" className="group-hover:text-pink-400 transition-colors">
              Start Promoting <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Card>
        </motion.div>

        {/* Feature Experience Sections */}
        <div className="space-y-20">
          {/* Music Studio Experience */}
          <div className="relative py-20 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-300/5 via-purple-400/5 to-pink-400/5" />
            <div className="absolute inset-0 backdrop-blur-3xl opacity-30" />
            <div className="relative max-w-7xl mx-auto px-6">
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-4">Music Studio</Badge>
                <h2 className="text-4xl font-bold mb-4">Your Music, Your Way</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Professional-grade music production tools integrated with leading DAWs.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-muted">
                  {/* <Image
                    src="/features/studio.jpg"
                    alt="Music Studio"
                    fill
                    className="object-cover"
                  /> */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold mb-2">Professional Music Studio</h3>
                    <p className="text-muted-foreground">
                      Create, record, and mix your music with professional tools.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 hover:bg-muted/50 transition">
                      <h4 className="font-semibold mb-2">DAW Integration</h4>
                      <p className="text-sm text-muted-foreground">Seamlessly connect with your favorite DAW.</p>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition">
                      <h4 className="font-semibold mb-2">Virtual Instruments</h4>
                      <p className="text-sm text-muted-foreground">Access a wide range of professional VSTs.</p>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition">
                      <h4 className="font-semibold mb-2">Effects Suite</h4>
                      <p className="text-sm text-muted-foreground">Professional mixing and mastering tools.</p>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition">
                      <h4 className="font-semibold mb-2">Cloud Storage</h4>
                      <p className="text-sm text-muted-foreground">Secure cloud backup for your projects.</p>
                    </Card>
                  </div>

                  <div className="flex justify-center md:justify-start gap-4">
                    <Link href="/music">
                      <Button size="lg" className="bg-gradient-to-r from-sky-300 to-pink-400 hover:opacity-90">
                        Open Studio
                      </Button>
                    </Link>
                    <Link href="/plugins">
                      <Button size="lg" variant="outline">
                        Browse Plugins
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Assistant Experience */}
          <div className="py-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-4">AI Assistant</Badge>
                <h2 className="text-4xl font-bold mb-4">Create with AI</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Harness the power of AI to enhance your music production workflow.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-muted">
                  {/* <Image
                    src="/features/ai.jpg"
                    alt="AI Assistant"
                    fill
                    className="object-cover"
                  /> */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold mb-2">AI-Powered Creation</h3>
                    <p className="text-muted-foreground">
                      Let AI assist you in composition, mixing, and mastering.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 hover:bg-muted/50 transition">
                      <h4 className="font-semibold mb-2">Smart Composition</h4>
                      <p className="text-sm text-muted-foreground">Generate melodies and chord progressions.</p>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition">
                      <h4 className="font-semibold mb-2">Auto Mixing</h4>
                      <p className="text-sm text-muted-foreground">AI-powered mixing suggestions.</p>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition">
                      <h4 className="font-semibold mb-2">Style Transfer</h4>
                      <p className="text-sm text-muted-foreground">Apply different musical styles to your tracks.</p>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition">
                      <h4 className="font-semibold mb-2">Lyric Generation</h4>
                      <p className="text-sm text-muted-foreground">Get AI assistance for songwriting.</p>
                    </Card>
                  </div>

                  <div className="flex justify-center md:justify-start gap-4">
                    <Link href="/ai">
                      <Button size="lg" className="bg-gradient-to-r from-sky-300 to-pink-400 hover:opacity-90">
                        Try AI Tools
                      </Button>
                    </Link>
                    <Link href="/ai/examples">
                      <Button size="lg" variant="outline">
                        View Examples
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Academy Experience */}
          <div className="bg-gradient-to-r from-sky-300/5 via-purple-400/5 to-pink-400/5 py-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-4">Academy</Badge>
                <h2 className="text-4xl font-bold mb-4">Learn from the Best</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Master music production with comprehensive courses from industry experts.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-muted">
                  {/* <Image
                    src="/features/academy.jpg"
                    alt="Academy"
                    fill
                    className="object-cover"
                  /> */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold mb-2">Expert-Led Training</h3>
                    <p className="text-muted-foreground">
                      Learn production techniques from Grammy-winning producers.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 hover:bg-muted/50 transition">
                      <h4 className="font-semibold mb-2">Video Courses</h4>
                      <p className="text-sm text-muted-foreground">High-quality production tutorials.</p>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition">
                      <h4 className="font-semibold mb-2">Live Workshops</h4>
                      <p className="text-sm text-muted-foreground">Interactive sessions with experts.</p>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition">
                      <h4 className="font-semibold mb-2">Project Files</h4>
                      <p className="text-sm text-muted-foreground">Download and study real projects.</p>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition">
                      <h4 className="font-semibold mb-2">Certifications</h4>
                      <p className="text-sm text-muted-foreground">Earn industry-recognized certificates.</p>
                    </Card>
                  </div>

                  <div className="flex justify-center md:justify-start gap-4">
                    <Link href="/academy">
                      <Button size="lg" className="bg-gradient-to-r from-sky-300 to-pink-400 hover:opacity-90">
                        Start Learning
                      </Button>
                    </Link>
                    <Link href="/academy/courses">
                      <Button size="lg" variant="outline">
                        Browse Courses
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PromoPulse Experience */}
          <div className="py-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-4">PromoPulse</Badge>
                <h2 className="text-4xl font-bold mb-4">Grow Your Audience</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Powerful promotion tools to help you reach and engage your audience.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-muted">
                  {/* <Image
                    src="/features/promo.jpg"
                    alt="PromoPulse"
                    fill
                    className="object-cover"
                  /> */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold mb-2">Marketing Automation</h3>
                    <p className="text-muted-foreground">
                      Automate your promotion and reach more fans.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 hover:bg-muted/50 transition">
                      <h4 className="font-semibold mb-2">Email Campaigns</h4>
                      <p className="text-sm text-muted-foreground">Build and engage your mailing list.</p>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition">
                      <h4 className="font-semibold mb-2">Social Media</h4>
                      <p className="text-sm text-muted-foreground">Schedule and analyze your posts.</p>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition">
                      <h4 className="font-semibold mb-2">Release Planning</h4>
                      <p className="text-sm text-muted-foreground">Plan and execute your music releases.</p>
                    </Card>
                    <Card className="p-4 hover:bg-muted/50 transition">
                      <h4 className="font-semibold mb-2">Fan Analytics</h4>
                      <p className="text-sm text-muted-foreground">Track and analyze your audience growth.</p>
                    </Card>
                  </div>

                  <div className="flex justify-center md:justify-start gap-4">
                    <Link href="/promopulse">
                      <Button size="lg" className="bg-gradient-to-r from-sky-300 to-pink-400 hover:opacity-90">
                        Start Promoting
                      </Button>
                    </Link>
                    <Link href="/promopulse/templates">
                      <Button size="lg" variant="outline">
                        View Templates
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-muted/50 py-20 mb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Success Stories</Badge>
              <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6">
                <p className="text-muted-foreground mb-4">&ldquo;PausePlayRepeat transformed my workflow. The AI tools saved me countless hours in production.&rdquo;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted" />
                  <div>
                    <p className="font-semibold">Alex Thompson</p>
                    <p className="text-sm text-muted-foreground">Electronic Producer</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <p className="text-muted-foreground mb-4">&ldquo;The academy courses helped me level up my mixing skills. Now I&apos;m working with major artists.&rdquo;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted" />
                  <div>
                    <p className="font-semibold">Sarah Chen</p>
                    <p className="text-sm text-muted-foreground">Mixing Engineer</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <p className="text-muted-foreground mb-4">&ldquo;PromoPulse helped me grow my audience from 100 to 10,000 followers in just 3 months.&rdquo;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted" />
                  <div>
                    <p className="font-semibold">Marcus Rodriguez</p>
                    <p className="text-sm text-muted-foreground">Independent Artist</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="relative py-20 rounded-3xl overflow-hidden mb-20">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-300/5 via-purple-400/5 to-pink-400/5" />
          <div className="absolute inset-0 backdrop-blur-3xl opacity-30" />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <Shield className="w-12 h-12 text-sky-400 mb-4" />
                <h3 className="font-semibold mb-2">Enterprise-Grade Security</h3>
                <p className="text-sm text-muted-foreground">Your data is protected with industry-leading encryption</p>
              </div>
              <div className="flex flex-col items-center">
                <Award className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="font-semibold mb-2">Award-Winning Platform</h3>
                <p className="text-sm text-muted-foreground">Recognized by leading music industry experts</p>
              </div>
              <div className="flex flex-col items-center">
                <CheckCircle className="w-12 h-12 text-pink-400 mb-4" />
                <h3 className="font-semibold mb-2">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">Our team is always here to help you succeed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Final CTA */}
        <div className="relative py-20 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-300/10 via-purple-400/10 to-pink-400/10" />
          <div className="absolute inset-0 backdrop-blur-3xl opacity-30" />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative max-w-7xl mx-auto px-6 text-center"
          >
            <Badge variant="secondary" className="mb-4">Join the Revolution</Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
              Ready to Start Your Journey?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of musicians who are already creating, learning, and growing with PausePlayRepeat.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-sky-300 to-pink-400 hover:opacity-90 rounded-full px-8"
              >
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full px-8 gap-2 hover:bg-muted/10"
              >
                <PlayCircle className="w-5 h-5" /> Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;