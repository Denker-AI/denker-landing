"use client";

import { Minus, Plus } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { BlurText } from "@/components/ui/BlurText";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { DOWNLOAD_URL } from "@/lib/links";

const faqs = [
  {
    question: "What is Denker?",
    answer:
      "Denker is an AI coworker designed for founders and product builders. It helps you research, analyze, automate, and complete everyday work through natural voice or text interactions.",
  },
  {
    question: "How is Denker different from ChatGPT or other AI assistants?",
    answer:
      "Unlike traditional AI assistants that mainly answer questions, Denker is built to help you get work done. It understands context, works across your tools, and assists with research, analysis, and task execution.",
  },
  {
    question: "What kind of tasks can Denker help with?",
    answer:
      "Denker can help with competitor research, product planning, SEO analysis, documentation, workflow automation, and many other day-to-day tasks that founders and builders perform.",
  },
  {
    question: "Can I interact with Denker using voice?",
    answer:
      "Absolutely. You can communicate with Denker using either voice or text, making it easy to switch between conversations and hands-free workflows.",
  },
  {
    question: "Does Denker work with my existing tools?",
    answer:
      "Yes. Denker integrates with the tools you already use, helping you stay in your existing workflow instead of forcing you to learn a new one.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. Your privacy and security are a priority. Denker is designed to work with your tasks while giving you control over your data and permissions. You decide what Denker can access and how it assists your workflow.",
    cta: { label: "Learn more at privacy Page", href: "https://www.denker.ai/privacy" },
  },
  {
    question: "Is Denker free to use?",
    answer:
      "Yes. You can get started with Denker for free and explore its core capabilities. As your needs grow, premium plans unlock more advanced features, higher usage limits, and additional integrations.",
    cta: { label: "View Pricing Plan", href: "#pricing" },
  },
  {
    question: "How do I get started?",
    answer:
      "Getting started is simple. Download Denker, sign in, and start giving tasks using voice or text. Within minutes, Denker is ready to help you research, analyze, and execute work.",
    cta: { label: "Download Denker", href: DOWNLOAD_URL },
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="flex w-full flex-col items-center bg-white px-6 py-16 sm:px-10 md:px-20 md:py-20"
      data-name="Section - FAQ's"
      data-theme="light"
    >
      <Container className="faq-layout flex items-start gap-12">
        <BlurText
          as="h2"
          className="max-w-[320px] font-heading text-3xl font-bold text-grey-950 md:text-[40px] md:leading-[48px]"
          text="Frequently Asked Questions"
        />

        {/* max-w only applies once .faq-layout switches to a row (1080px+,
            see globals.css) to leave room for the heading beside it — below
            that it stacks under the heading, so it should fill the full
            width instead of staying capped at 720px. */}
        <FadeIn delay={0.1} className="flex w-full min-[1080px]:max-w-[720px] flex-col gap-2">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.question}
                className={`group w-full rounded-[20px] sm:rounded-[24px] md:rounded-[32px] border p-8 transition-colors ${
                  isOpen
                    ? "border-primary-200 bg-gradient-to-br from-white to-primary-50"
                    : "border-grey-150 bg-white hover:border-primary-200 hover:bg-gradient-to-br hover:from-white hover:to-primary-50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-6 text-left"
                >
                  <p
                    className={`font-heading text-2xl font-bold transition-colors ${
                      isOpen ? "text-primary-600" : "text-grey-950 group-hover:text-primary-600"
                    }`}
                  >
                    {faq.question}
                  </p>
                  {isOpen ? (
                    <Minus className="size-8 shrink-0 text-primary-600" />
                  ) : (
                    <Plus className="size-8 shrink-0 text-primary-600" />
                  )}
                </button>

                {/* Collapsible answer — height animates via the grid
                    0fr → 1fr trick; the inner content fades in with it. */}
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div
                    className={`overflow-hidden transition-opacity duration-300 ease-out ${
                      isOpen ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {faq.answer && (
                      <p className="pt-2 font-heading text-base font-medium leading-6 text-grey-950">
                        {faq.answer}
                      </p>
                    )}
                    {faq.cta && (
                      <Button
                        variant="primary"
                        href={faq.cta.href}
                        tabIndex={isOpen ? 0 : -1}
                        className="mt-6 h-10 px-4 text-base"
                      >
                        {faq.cta.label}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </FadeIn>
      </Container>
    </section>
  );
}
