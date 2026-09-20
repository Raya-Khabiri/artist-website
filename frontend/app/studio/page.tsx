import Link from "next/link";

const dashboardItems = [
  {
    title: "Artworks",
    description:
      "Add new artworks and manage images, prices, dimensions and availability.",
    href: "/studio/artworks",
  },
  {
    title: "Messages",
    description: "Read customer enquiries and continue private conversations.",
    href: "/account/messages",
  },
  {
    title: "Site content",
    description:
      "Update the homepage, artist profile, contact details and process video.",
    href: "/studio/site-content",
  },
  {
    title: "Orders",
    description: "Review and manage customer orders.",
    href: "/studio/orders",
  },
];

export default function StudioPage() {
  return (
    <main
      className="
        min-h-screen
        bg-[#f4f1eb]
        px-6
        py-10
        text-[#171717]

        sm:px-10
        lg:px-16
        lg:py-14
      "
    >
      <div className="mx-auto max-w-[1400px]">
        <header
          className="
            flex
            flex-col
            gap-8
            border-b
            border-black/10
            pb-10

            md:flex-row
            md:items-end
            md:justify-between
          "
        >
          <div>
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.35em]
                text-[#9b1c1c]
              "
            >
              EAMORA Studio
            </p>

            <h1
              className="
                mt-4
                font-serif
                text-4xl
                font-light

                sm:text-5xl
              "
            >
              Artist dashboard
            </h1>

            <p
              className="
                mt-5
                max-w-xl
                text-sm
                leading-6
                text-black/55
              "
            >
              Manage artworks, conversations, website content and orders from
              one place.
            </p>
          </div>

          <Link
            href="/"
            className="
              w-fit
              border-b
              border-black/25
              pb-2
              text-[10px]
              uppercase
              tracking-[0.25em]
              text-black/55
              transition

              hover:border-[#9b1c1c]
              hover:text-[#9b1c1c]
            "
          >
            View website ↗
          </Link>
        </header>

        <section
          className="
            grid
            gap-px
            overflow-hidden
            border
            border-black/10
            bg-black/10

            md:grid-cols-2
          "
        >
          {dashboardItems.map((item, index) => {
            const isAvailable =
              item.href === "/account/messages" ||
              item.href === "/studio/artworks" ||
              item.href === "/studio/site-content";
            const content = (
              <>
                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-6
                  "
                >
                  <span
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.3em]
                      text-black/35
                    "
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span
                    className={`
                      text-[9px]
                      uppercase
                      tracking-[0.2em]

                      ${isAvailable ? "text-[#9b1c1c]" : "text-black/30"}
                    `}
                  >
                    {isAvailable ? "Open" : "Coming soon"}
                  </span>
                </div>

                <h2
                  className="
                    mt-12
                    font-serif
                    text-3xl
                    font-light
                  "
                >
                  {item.title}
                </h2>

                <p
                  className="
                    mt-4
                    max-w-sm
                    text-sm
                    leading-6
                    text-black/55
                  "
                >
                  {item.description}
                </p>
              </>
            );

            if (isAvailable) {
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="
                    min-h-64
                    bg-[#f4f1eb]
                    p-8
                    transition
                    duration-300

                    hover:bg-[#ede9e1]
                  "
                >
                  {content}
                </Link>
              );
            }

            return (
              <div
                key={item.title}
                className="
                  min-h-64
                  bg-[#f4f1eb]
                  p-8
                "
              >
                {content}
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
