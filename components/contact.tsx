"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Github, Linkedin, ExternalLink, CheckCircle, Loader2 } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import CyberCard from "@/components/ui/cyber-card";
import { CyberButton } from "@/components/ui/cyber-button";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

const contactInfo = [
  { icon: Mail, label: "Email", value: "skfaizan2301@gmail.com", href: "mailto:skfaizan2301@gmail.com" },
  { icon: Phone, label: "Phone", value: "+91 7755953765", href: "tel:+917755953765" },
  { icon: MapPin, label: "Location", value: "India" },
];

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com/faizan2301", username: "@faizan2301" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/engineerfaizanshaikh", username: "engineerfaizanshaikh" },
  { icon: ExternalLink, label: "Portfolio", href: "https://engineer-faizan-shaikh.vercel.app", username: "engineer-faizan-shaikh" },
];

export default function Contact() {
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormState({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const inputClass = "cyber-input w-full text-sm";

  return (
    <section id="contact" className="py-20 sm:py-28 md:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 opacity-10 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #00ff88, transparent)" }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 opacity-10 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #ff00ff, transparent)" }} />

      <RevealGroup className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10" stagger={100}>
        <RevealItem>
          <SectionHeading
            badge="// Contact"
            title={
              <>
                Let&apos;s{" "}
                <span className="neon-text">Connect</span>
              </>
            }
            subtitle="Have a project in mind or want to collaborate? Feel free to reach out!"
          />
        </RevealItem>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
          <div className="space-y-4">
            {contactInfo.map((info) => (
              <RevealItem key={info.label}>
                <CyberCard hoverEffect className="flex items-center gap-4 p-4">
                  <div className="w-11 h-11 cyber-chamfer-sm border border-primary/40 flex items-center justify-center shrink-0" style={{ boxShadow: "var(--box-shadow-neon-sm)" }}>
                    <info.icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-label text-[10px] uppercase tracking-widest text-muted-foreground">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} className="font-mono text-sm hover:neon-text transition-all truncate block">
                        {info.value}
                      </a>
                    ) : (
                      <p className="font-mono text-sm">{info.value}</p>
                    )}
                  </div>
                </CyberCard>
              </RevealItem>
            ))}

            <RevealItem>
              <CyberCard variant="terminal" terminalTitle="social.log">
                <div className="space-y-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 hover:bg-primary/5 transition-colors group font-mono text-sm"
                    >
                      <link.icon size={16} className="text-muted-foreground group-hover:text-primary icon-glow" strokeWidth={1.5} />
                      <span className="text-muted-foreground group-hover:text-primary">{link.label}</span>
                      <span className="text-xs text-muted-foreground ml-auto truncate">{link.username}</span>
                    </a>
                  ))}
                </div>
              </CyberCard>
            </RevealItem>
          </div>

          <RevealItem>
            <CyberCard variant="terminal" terminalTitle="message.exe" className="h-full">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="font-label text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Name</label>
                    <div className="cyber-input-wrap">
                      <input type="text" id="name" name="name" value={formState.name} onChange={(e) => setFormState((p) => ({ ...p, name: e.target.value }))} required className={inputClass} placeholder="your_name" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="font-label text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Email</label>
                    <div className="cyber-input-wrap">
                      <input type="email" id="email" name="email" value={formState.email} onChange={(e) => setFormState((p) => ({ ...p, email: e.target.value }))} required className={inputClass} placeholder="your@email.com" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="font-label text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Subject</label>
                  <div className="cyber-input-wrap">
                    <input type="text" id="subject" name="subject" value={formState.subject} onChange={(e) => setFormState((p) => ({ ...p, subject: e.target.value }))} required className={inputClass} placeholder="subject_line" />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="font-label text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Message</label>
                  <div className="cyber-input-wrap cyber-textarea-wrap">
                    <textarea id="message" name="message" value={formState.message} onChange={(e) => setFormState((p) => ({ ...p, message: e.target.value }))} required rows={4} className={`${inputClass} cyber-textarea resize-none`} placeholder="Enter message..." />
                  </div>
                </div>

                <CyberButton type="submit" variant="glitch" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  ) : isSubmitted ? (
                    <><CheckCircle className="w-4 h-4" /> Message Sent!</>
                  ) : (
                    <><Send className="w-4 h-4" strokeWidth={1.5} /> Send Message</>
                  )}
                </CyberButton>
              </form>
            </CyberCard>
          </RevealItem>
        </div>
      </RevealGroup>
    </section>
  );
}
