"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const projects = [
    {
      title: "M-Attendance",
      description:
        "Mobile attendance tracking application with real-time updates and comprehensive reporting features.",
      image: "/placeholder.svg?height=300&width=600",
      techStack: ["JAVA", "XML", "React Native"],
      links: [
        {
          label: "Play Store",
          url: "https://play.google.com/store/apps/details?id=com.attendance.mokshasolutions",
        },
        {
          label: "App Store",
          url: "https://apps.apple.com/bn/app/m-attendance/id6443842046",
        },
      ],
      highlights: [
        "Code Refactoring: Implemented extensive code cleanup initiatives, resulting in improved code readability and maintainability.",
        "Bug Resolution: Identified and resolved numerous bugs, ensuring a smoother and glitch-free user experience.",
        "Feature Enhancement: Collaborated with the development team to introduce new features, such as real-time attendance tracking.",
        "Team Collaboration: Worked closely with the development team to align project goals and requirements.",
      ],
    },
    {
      title: "JJM Monitoring App",
      description:
        "Project monitoring application enabling real-time tracking of construction progress through media uploads.",
      image: "/placeholder.svg?height=300&width=600",
      techStack: ["JAVA", "XML"],
      links: [
        {
          label: "Play Store",
          url: "https://play.google.com/store/apps/details?id=com.jjmaurangabad",
        },
      ],
      highlights: [
        "Streamlined Media Upload: Facilitated seamless photo and video uploads for real-time project monitoring.",
        "Ensured Data Authenticity: Implemented a robust validation system with multi-level approval process.",
        "Intuitive Dashboard Design: Engineered a user-friendly dashboard with comprehensive project status overview.",
        "User-Centric App Design: Designed an intuitive interface accessible to all users regardless of technical expertise.",
      ],
    },
    {
      title: "Olive ProHealth",
      description:
        "Healthcare application connecting users with medical professionals and nearby healthcare facilities.",
      image: "/placeholder.svg?height=300&width=600",
      techStack: ["Flutter", "Dart", "Node.js"],
      links: [
        {
          label: "Play Store (ProHealth)",
          url: "https://play.google.com/store/apps/details?id=com.olive.olive",
        },
        {
          label: "Play Store (Delta)",
          url: "https://play.google.com/store/apps/details?id=com.olive.prohealth.delta.olive_prohealth_delta",
        },
      ],
      highlights: [
        "Find Nearby Healthcare Facilities: Dynamic map functionality to locate hospitals and healthcare centers.",
        "Expert Q&A Forum: Engagement with specialized doctors across various categories.",
        "Prescription Management: Seamless prescription uploads for pharmacists' review.",
        "MVVM Architecture: Implemented a scalable and maintainable codebase.",
      ],
    },
    {
      title: "MGS Delivery",
      description:
        "Delivery management system with barcode scanning, order assignment, and credit authorization features.",
      image: "/placeholder.svg?height=300&width=600",
      techStack: ["React Native", "JavaScript", "Node.js"],
      links: [
        {
          label: "Play Store",
          url: "https://play.google.com/store/apps/details?id=com.mgsdelivery",
        },
      ],
      highlights: [
        "Barcode Scanner Integration: Implemented sophisticated barcode scanner for accurate order processing.",
        "Order Assignment: Facilitated seamless assignment of orders to delivery personnel.",
        "Credit Authorization System: Implemented system to manage outstanding bills for financial transparency.",
        "Firebase Notifications: Implemented notifications for real-time updates to admins and delivery personnel.",
      ],
    },
  ]

  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
            <div className="h-1 w-20 bg-primary mx-auto mb-6"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              I've created multiple applications for both Android and iOS at Moksha Solutions, integrating RESTful APIs
              and implementing Firebase notifications using FCM tokens.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {projects.map((project, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full overflow-hidden group hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 hover-effect">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.map((tech, i) => (
                        <Badge key={i} variant="secondary" className="hover-effect">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {project.highlights.slice(0, 2).map((highlight, i) => (
                        <p key={i} className="text-sm text-muted-foreground">
                          • {highlight}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2">
                    {project.links.map((link, i) => (
                      <Button key={i} variant="outline" size="sm" asChild className="hover-effect">
                        <Link href={link.url} target="_blank" className="flex items-center gap-1">
                          {link.label}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
                    ))}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

