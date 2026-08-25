import Image from "next/image";
import Link from "next/link";

import { getMediaUrl, getSiteSettings } from "@/lib/api";

const fallbackContent = {
  heroTitle: "EAMORA",
  heroAcronym: "ETERNAL A MOMENT ONCE REMEMBERED AGAIN",
  heroStatement:
    "Art saves fleeting moments from disappearing, transforming them into eternal expressions that endure beyond time.",
  heroImage: "/images/eamora-hero.jpg",
  heroImageAlt: "Featured EAMORA artwork",
  primaryButtonText: "EXPLORE GALLERY",
  primaryButtonLink: "/gallery",
};

function splitAcronym(text: string) {
  const words = text.trim().split(/\s+/);

  return {
    firstWord: words[0] || "",
    remainingText: words.slice(1).join(" "),
  };
}

export default async function Hero() {
  const settings = await getSiteSettings();

  const heroTitle = settings?.hero_title || fallbackContent.heroTitle;

  const heroAcronym = settings?.hero_acronym || fallbackContent.heroAcronym;

  const heroStatement =
    settings?.hero_statement || fallbackContent.heroStatement;

  const heroImage =
    getMediaUrl(settings?.hero_image || null) || fallbackContent.heroImage;

  const heroImageAlt = settings?.hero_image_alt || fallbackContent.heroImageAlt;

  const primaryButtonText =
    settings?.hero_button_text || fallbackContent.primaryButtonText;

  const primaryButtonLink =
    settings?.hero_button_link || fallbackContent.primaryButtonLink;

  const titleLetters = heroTitle.split("");

  const { firstWord, remainingText } = splitAcronym(heroAcronym);

  return (
    <section
      className="
        relative isolate
        min-h-[calc(100svh-72px)]
        overflow-hidden
        bg-[#faf9f6]
        text-[#171717]
      "
    >
      {/* Desktop image area */}
      <div
        className="
          absolute
          inset-y-0
          right-0
          hidden
          w-[66%]
          overflow-hidden
          lg:block
        "
      >
        <Image
          src={heroImage}
          alt={heroImageAlt}
          fill
          priority
          sizes="66vw"
          className="
            object-contain
            object-right
            scale-[1.03]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-1
            inset-y-0
            z-10
            w-[34%]
          "
          style={{
            background: `
              linear-gradient(
                90deg,
                #faf9f6 0%,
                #faf9f6 18%,
                rgba(250, 249, 246, 0.98) 28%,
                rgba(250, 249, 246, 0.90) 42%,
                rgba(250, 249, 246, 0.68) 58%,
                rgba(250, 249, 246, 0.38) 74%,
                rgba(250, 249, 246, 0.14) 88%,
                transparent 100%
              )
            `,
          }}
        />
      </div>

      {/* Mobile image area */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-[48%]
          overflow-hidden
          lg:hidden
        "
      >
        <Image
          src={heroImage}
          alt={heroImageAlt}
          fill
          priority
          sizes="100vw"
          className="
            object-contain
            object-bottom
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            h-[38%]
          "
          style={{
            background: `
              linear-gradient(
                180deg,
                #faf9f6 0%,
                rgba(250, 249, 246, 0.92) 18%,
                rgba(250, 249, 246, 0.58) 48%,
                rgba(250, 249, 246, 0.18) 76%,
                transparent 100%
              )
            `,
          }}
        />
      </div>

      {/* Hero content */}
      <div
        className="
          relative z-10
          flex
          min-h-[calc(100svh-72px)]
          w-full
          items-start
          px-6
          pb-[46vh]
          pt-16

          sm:px-10
          sm:pt-20

          md:px-14

          lg:items-center
          lg:px-0
          lg:py-16
        "
      >
        <div
          className="
            w-full
            max-w-[460px]

            lg:ml-[4vw]
            xl:ml-[4.5vw]
            2xl:ml-[5vw]
          "
        >
          {/* EAMORA title */}
          <h1
            className="
              flex
              w-full
              items-center
              justify-between
              font-serif
              text-[56px]
              font-light
              leading-none

              sm:text-[70px]
              md:text-[82px]
              lg:text-[88px]
              xl:text-[96px]
            "
          >
            {titleLetters.map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                className={index === 0 ? "text-[#9b1c1c]" : "text-[#171717]"}
              >
                {letter}
              </span>
            ))}
          </h1>

          {/* Acronym */}
          <p
            className="
              mt-5
              w-full
              whitespace-nowrap
              text-justify
              [text-align-last:justify]
              text-[10px]
              font-light
              uppercase
              tracking-[0.18em]

              sm:text-[11px]
              sm:tracking-[0.22em]

              md:text-[12px]
              lg:text-[13px]
            "
          >
            <span className="text-[#9b1c1c]">{firstWord}</span>

            {remainingText && (
              <span className="ml-2 text-black/65">{remainingText}</span>
            )}
          </p>

          {/* Hero statement */}
          <p
            className="
              mt-3
              w-full
              text-justify
              font-serif
              text-[17px]
              font-light
              leading-[1.45]
              text-black/80

              sm:text-[18px]
              lg:text-[20px]
            "
          >
            {heroStatement}
          </p>

          {/* Gallery link */}
          <div className="mt-12">
            <Link
              href={primaryButtonLink}
              className="
                group
                inline-flex
                items-center
                gap-7
                border-b
                border-black/70
                pb-2
                text-[10px]
                font-medium
                uppercase
                tracking-[0.24em]
                text-black
                transition-colors
                duration-300

                hover:border-[#9b1c1c]
                hover:text-[#9b1c1c]

                sm:text-[11px]
              "
            >
              <span>{primaryButtonText}</span>

              <span
                aria-hidden="true"
                className="
                  text-base
                  transition-transform
                  duration-300
                  group-hover:translate-x-2
                "
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
