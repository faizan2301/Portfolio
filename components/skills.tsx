"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Smartphone, 
  Globe, 
  Server, 
  Database, 
  GitBranch, 
  Cloud, 
  Layout, 
  Workflow,
  Layers,
  Zap
} from "lucide-react";

const skillCategories = [
  {
    title: "Mobile Development",
    icon: Smartphone,
    color: "from-cyan-500 to-blue-500",
    skills: ["Flutter", "Dart", "React Native", "Java", "Expo", "React Native CLI"],
  },
  {
    title: "Frontend",
    icon: Globe,
    color: "from-violet-500 to-purple-500",
    skills: ["React.js", "TypeScript", "JavaScript", "Tailwind CSS", "Redux", "Redux Toolkit"],
  },
  {
    title: "Backend",
    icon: Server,
    color: "from-green-500 to-emerald-500",
    skills: ["Node.js", "RESTful APIs", "Express.js", "Socket.io"],
  },
  {
    title: "Database & Cloud",
    icon: Database,
    color: "from-orange-500 to-red-500",
    skills: ["MongoDB", "Firebase", "Firestore", "Cloud Functions"],
  },
  {
    title: "Tools & DevOps",
    icon: GitBranch,
    color: "from-pink-500 to-rose-500",
    skills: ["Git", "GitHub", "Postman", "CI/CD", "Firebase Notifications"],
  },
  {
    title: "Architecture",
    icon: Layers,
    color: "from-amber-500 to-yellow-500",
    skills: ["MVVM", "MVC", "MVP", "System Architecture", "State Management"],
  },
];

const additionalSkills = [
  "Google Maps Integration",
  "Push Notifications",
  "UI/UX Principles",
  "Agile Environment",
  "Product Designing",
  "Responsiveness",
  "Team Collaboration",
];

export default function Skills() {
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
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section id="skills" className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      
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
            Tech Stack
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Skills &{" "}
            <span className="gradient-text">Technologies</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A comprehensive toolkit for building modern applications
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass rounded-2xl p-6 group cursor-default"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                  <category.icon size={20} className="text-white" />
                </div>
                <h3 className="font-semibold">{category.title}</h3>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.3 + index * 0.1 + skillIndex * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1.5 text-sm bg-muted rounded-full text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Skills */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-primary" size={24} />
            <h3 className="font-semibold text-lg">Additional Expertise</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {additionalSkills.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-4 py-2 text-sm font-medium border border-border rounded-full text-muted-foreground hover:text-primary hover:border-primary/50 transition-all cursor-default"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="mt-16 flex justify-center gap-8 text-muted-foreground/30">
          {[Workflow, Cloud, Layout].map((Icon, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              <Icon size={40} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

