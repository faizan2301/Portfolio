"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"

export default function About() {
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

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">About Me</h2>
            <div className="h-1 w-20 bg-primary mx-auto"></div>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants} className="relative">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-4 border-primary/20 transform hover:rotate-3 transition-transform duration-300 hover-effect">
                <Image
                  src="/Profile.jpeg?height=400&width=400"
                  alt="Faizan Shaikh"
                  fill
                  className="object-cover"
                />
              </div>
              <motion.div
                className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-2xl -z-10"
                animate={{
                  rotate: [0, 90, 180, 270, 360],
                  transition: {
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  },
                }}
              ></motion.div>
              <motion.div
                className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-2xl -z-10"
                animate={{
                  rotate: [360, 270, 180, 90, 0],
                  transition: {
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  },
                }}
              ></motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-semibold mb-4">
                Mobile Application Developer
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                As a ME Computer Science graduate and mobile application
                developer at Moksha Solutions, I specialize in crafting
                applications using Java, Flutter, Dart, and React Native. My
                experience extends to backend development with Node.js,
                underpinned by a solid foundation in JavaScript and TypeScript.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                I am eager to leverage my technical skills and innovative
                approach to contribute to the growth and success of a
                forward-thinking organization.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Name:</p>
                  <p className="text-muted-foreground">
                    Mohammad Faizan Shaikh
                  </p>
                </div>
                <div>
                  <p className="font-medium">Email:</p>
                  <p className="text-muted-foreground">
                    skfaizan2301@gmail.com
                  </p>
                </div>
                <div>
                  <p className="font-medium">Phone:</p>
                  <p className="text-muted-foreground">+91 7755953765</p>
                </div>
                <div>
                  <p className="font-medium">Location:</p>
                  <p className="text-muted-foreground">India</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

