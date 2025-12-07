"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Briefcase, GraduationCap, Code2, Smartphone, Server } from "lucide-react";

const stats = [
  { label: "Years Experience", value: "3+", icon: Briefcase },
  { label: "Projects Completed", value: "15+", icon: Code2 },
  { label: "Apps Published", value: "7+", icon: Smartphone },
  { label: "Technologies", value: "20+", icon: Server },
];

const highlights = [
  {
    icon: Smartphone,
    title: "Mobile Development",
    description: "Expert in Flutter, React Native, and native Android development with Java/Kotlin.",
  },
  {
    icon: Code2,
    title: "Frontend Engineering",
    description: "Building responsive, performant web applications with React.js and modern frameworks.",
  },
  {
    icon: Server,
    title: "Backend Integration",
    description: "Proficient in Node.js, RESTful APIs, Firebase, and MongoDB for full-stack solutions.",
  },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="about" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-6xl mx-auto px-6 relative z-10"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-full mb-4">
            About Me
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Turning Ideas Into{" "}
            <span className="gradient-text">Reality</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Passionate developer with a love for creating beautiful, functional applications
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left: Bio */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="glass rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                  F
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Mohammad Faizan Shaikh</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin size={14} />
                    India
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                As a <span className="text-foreground font-medium">M.E. Computer Science graduate</span> and{" "}
                <span className="text-primary font-medium">Frontend Engineer at Khedmah Delivery</span>, 
                I specialize in crafting seamless mobile and web applications using modern technologies.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With over 3 years of experience, I&apos;ve led projects from concept to deployment, 
                working with cross-functional teams to deliver high-quality products that exceed 
                client expectations. I&apos;m passionate about clean code, intuitive UI/UX, and 
                staying current with emerging technologies.
              </p>
            </div>

            {/* Education */}
            <motion.div variants={itemVariants} className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="text-primary" size={24} />
                <h3 className="font-semibold">Education</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">M.E. Computer Science & Engineering</p>
                    <p className="text-sm text-muted-foreground">Everest College of Engineering</p>
                  </div>
                  <span className="text-sm text-primary">2024</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">B.E. Computer Science & Engineering</p>
                    <p className="text-sm text-muted-foreground">Everest College of Engineering</p>
                  </div>
                  <span className="text-sm text-primary">2022</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Stats & Highlights */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="glass rounded-2xl p-6 text-center group cursor-default"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Highlights */}
            <div className="space-y-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  className="glass rounded-xl p-5 flex gap-4 items-start group cursor-default"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

