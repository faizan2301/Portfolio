"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export default function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const skillCategories = [
    {
      name: "Programming Languages",
      skills: ["Java", "JavaScript", "TypeScript", "Dart"],
    },
    {
      name: "Frameworks & Libraries",
      skills: ["React Native", "Flutter", "React.js", "Node.js"],
    },
    {
      name: "Tools & Technologies",
      skills: ["Git & GitHub", "RESTful APIs", "Firebase", "MongoDB", "Redux & Redux Toolkit"],
    },
    {
      name: "Mobile Development",
      skills: ["React Native CLI", "Expo", "State Management", "Push Notifications", "Google Maps"],
    },
    {
      name: "Architecture & Design",
      skills: ["MVVM", "MVC", "MVP", "System Architecture", "Product Designing"],
    },
    {
      name: "Other Skills",
      skills: ["Tailwind CSS", "Socket.io", "CI/CD", "Agile Environment", "Teamwork"],
    },
  ]

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Skills & Expertise</h2>
            <div className="h-1 w-20 bg-primary mx-auto mb-6"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A comprehensive set of technical skills and expertise gained through years of experience in mobile
              application development and software engineering.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {skillCategories.map((category, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-medium mb-4">{category.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

