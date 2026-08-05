"use client";

import { useCallback, useRef, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Linkedin,
  ExternalLink,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/section-heading";
import CyberCard from "@/components/ui/cyber-card";
import { CyberButton } from "@/components/ui/cyber-button";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

const initialForm = { name: "", email: "", subject: "", message: "", website: "" };

export default function Contact() {
  const t = useTranslations("contact");
  const [formState, setFormState] = useState(initialForm);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const canSubmit = Boolean(siteKey) && Boolean(turnstileToken) && !isSubmitting;

  const contactInfo = [
    { icon: Mail, label: t("email"), value: "hello@faizanshaikh.dev", href: "mailto:hello@faizanshaikh.dev" },
    { icon: Phone, label: t("phone"), value: "+91 7755953765", href: "tel:+917755953765" },
    { icon: MapPin, label: t("location"), value: t("locationValue") },
  ];

  const socialLinks = [
    { icon: Github, label: t("github"), href: "https://github.com/faizan2301", username: "@faizan2301" },
    { icon: Linkedin, label: t("linkedin"), href: "https://linkedin.com/in/engineerfaizanshaikh", username: "engineerfaizanshaikh" },
    { icon: ExternalLink, label: t("portfolio"), href: "https://engineer-faizan-shaikh.vercel.app", username: "engineer-faizan-shaikh" },
  ];

  const resetTurnstile = useCallback(() => {
    setTurnstileToken(null);
    turnstileRef.current?.reset();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!siteKey) {
      setError(t("errorSecurityMissing"));
      return;
    }

    if (!turnstileToken) {
      setError(t("errorSecurityRequired"));
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          subject: formState.subject,
          message: formState.message,
          website: formState.website,
          turnstileToken,
        }),
      });

      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || t("errorSendFailed"));
      }

      setIsSubmitted(true);
      setFormState(initialForm);
      resetTurnstile();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorGeneric"));
      resetTurnstile();
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "cyber-input w-full text-sm";

  return (
    <section id="contact" className="py-20 sm:py-28 md:py-32 relative overflow-hidden">
      <div className="absolute top-0 start-1/4 w-96 h-96 opacity-10 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #00ff88, transparent)" }} />
      <div className="absolute bottom-0 end-1/4 w-96 h-96 opacity-10 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #ff00ff, transparent)" }} />

      <RevealGroup className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10" stagger={100}>
        <RevealItem>
          <SectionHeading
            badge={t("badge")}
            title={
              <>
                {t("titleBefore")}{" "}
                <span className="neon-text">{t("titleAccent")}</span>
              </>
            }
            subtitle={t("subtitle")}
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
                      <span className="text-xs text-muted-foreground ms-auto truncate">{link.username}</span>
                    </a>
                  ))}
                </div>
              </CyberCard>
            </RevealItem>
          </div>

          <RevealItem>
            <CyberCard variant="terminal" terminalTitle="message.exe" className="h-full">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                  <CheckCircle className="w-10 h-10 text-primary" strokeWidth={1.5} />
                  <p className="font-mono text-sm text-foreground">{t("successTitle")}</p>
                  <p className="font-mono text-xs text-muted-foreground max-w-sm">
                    {t("successBody")}
                  </p>
                  <CyberButton
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={() => setIsSubmitted(false)}
                  >
                    {t("sendAnother")}
                  </CyberButton>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div aria-hidden="true" className="absolute -start-[9999px] opacity-0 h-0 overflow-hidden">
                    <label htmlFor="website">Website</label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formState.website}
                      onChange={(e) => setFormState((p) => ({ ...p, website: e.target.value }))}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="font-label text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">{t("name")}</label>
                      <div className="cyber-input-wrap">
                        <input type="text" id="name" name="name" value={formState.name} onChange={(e) => setFormState((p) => ({ ...p, name: e.target.value }))} required minLength={2} maxLength={80} className={inputClass} placeholder={t("namePlaceholder")} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="font-label text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">{t("email")}</label>
                      <div className="cyber-input-wrap">
                        <input type="email" id="email" name="email" value={formState.email} onChange={(e) => setFormState((p) => ({ ...p, email: e.target.value }))} required maxLength={120} className={inputClass} placeholder={t("emailPlaceholder")} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="font-label text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">{t("subject")}</label>
                    <div className="cyber-input-wrap">
                      <input type="text" id="subject" name="subject" value={formState.subject} onChange={(e) => setFormState((p) => ({ ...p, subject: e.target.value }))} required minLength={3} maxLength={120} className={inputClass} placeholder={t("subjectPlaceholder")} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="font-label text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">{t("message")}</label>
                    <div className="cyber-input-wrap cyber-textarea-wrap">
                      <textarea id="message" name="message" value={formState.message} onChange={(e) => setFormState((p) => ({ ...p, message: e.target.value }))} required minLength={10} maxLength={5000} rows={4} className={`${inputClass} cyber-textarea resize-none`} placeholder={t("messagePlaceholder")} />
                    </div>
                  </div>

                  {siteKey ? (
                    <div className="flex justify-start overflow-x-auto">
                      <Turnstile
                        ref={turnstileRef}
                        siteKey={siteKey}
                        onSuccess={setTurnstileToken}
                        onExpire={() => setTurnstileToken(null)}
                        onError={() => {
                          setTurnstileToken(null);
                          setError(t("errorTurnstileLoad"));
                        }}
                        options={{ theme: "dark", size: "flexible" }}
                      />
                    </div>
                  ) : (
                    <p className="font-mono text-xs text-amber-400/90 flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      {t("turnstileMissing")}
                    </p>
                  )}

                  {error && (
                    <p className="font-mono text-xs text-red-400 flex items-start gap-2" role="alert">
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      {error}
                    </p>
                  )}

                  <CyberButton type="submit" variant="glitch" disabled={!canSubmit} className="w-full">
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> {t("sending")}</>
                    ) : (
                      <><Send className="w-4 h-4" strokeWidth={1.5} /> {t("send")}</>
                    )}
                  </CyberButton>
                </form>
              )}
            </CyberCard>
          </RevealItem>
        </div>
      </RevealGroup>
    </section>
  );
}
