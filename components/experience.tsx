"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { BriefcaseIcon, GraduationCapIcon } from "lucide-react"

export default function Experience() {
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

  const experiences = [
    {
      title: "Sr. Mobile Application Developer",
      company: "Moksha Solutions",
      period: "2022 - Present",
      description: [
        "Led mobile application development projects, utilizing Java, Flutter, Dart, and React Native to create robust and user-friendly apps.",
        "Collaborate with cross-functional teams to integrate Node.js backend solutions, ensuring seamless functionality and performance.",
        "Actively contribute to the design and implementation of innovative features, focusing on delivering high-quality products to meet client needs.",
        "Interface directly with clients to gather requirements, understand their needs and translate them into actionable development plans.",
        "Serve as a primary point of contact for client communication, addressing inquiries, providing updates, and ensuring alignment between project objectives and client expectations.",
        "Employ a versatile tech stack encompassing Java, Flutter, Dart, React Native, Node.js, JavaScript, and TypeScript to deliver comprehensive mobile app solutions and robust backend infrastructure.",
      ],
      icon: <BriefcaseIcon className="h-5 w-5" />,
    },
  ]

  const education = [
    {
      degree: "M.E. Computer Science & Engineering",
      institution: "Everest College of Engineering",
      year: "2024",
      grade: "73.63%",
      icon: <GraduationCapIcon className="h-5 w-5" />,
    },
    {
      degree: "B.E. Computer Science & Engineering",
      institution: "Everest College of Engineering",
      year: "2022",
      grade: "78.9%",
      icon: <GraduationCapIcon className="h-5 w-5" />,
    },
    {
      degree: "HSC",
      institution: "Maulana Azad College of Arts & Science",
      year: "2018",
      grade: "75%",
      icon: <GraduationCapIcon className="h-5 w-5" />,
    },
    {
      degree: "S.S.C",
      institution: "Little Flower High School",
      year: "2016",
      grade: "79%",
      icon: <GraduationCapIcon className="h-5 w-5" />,
    },
  ]

  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Experience & Education</h2>
            <div className="h-1 w-20 bg-primary mx-auto"></div>
          </motion.div>

          <div className="grid gap-12">
            <div>
              <motion.h3 variants={itemVariants} className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <BriefcaseIcon className="h-6 w-6 text-primary" />
                Professional Experience
              </motion.h3>

              <div className="grid gap-6">
                {experiences.map((exp, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xl font-medium">{exp.title}</h4>
                            <p className="text-muted-foreground">{exp.company}</p>
                          </div>
                          <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                            {exp.period}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                          {exp.description.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <motion.h3 variants={itemVariants} className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <GraduationCapIcon className="h-6 w-6 text-primary" />
                Education
              </motion.h3>

              <div className="grid gap-6 md:grid-cols-2">
                {education.map((edu, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-primary/10 rounded-full text-primary">{edu.icon}</div>
                          <div>
                            <h4 className="font-medium">{edu.degree}</h4>
                            <p className="text-muted-foreground text-sm">{edu.institution}</p>
                            <div className="flex items-center gap-2 mt-2 text-sm">
                              <span className="px-2 py-0.5 bg-muted rounded-full">{edu.year}</span>
                              <span className="px-2 py-0.5 bg-muted rounded-full">{edu.grade}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

