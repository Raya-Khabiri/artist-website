import OrderManager from "@/components/studio/OrderManager";

export default function StudioOrdersPage() {
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
      <div className="mx-auto max-w-5xl">
        <header className="border-b border-black/10 pb-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#9b1c1c]">
            Sales management
          </p>

          <h1 className="mt-4 font-serif text-4xl font-light sm:text-5xl">
            Orders
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-black/55">
            Review customer purchases, inspect ordered artworks and update
            fulfilment status.
          </p>
        </header>

        <div className="mt-10">
          <OrderManager />
        </div>
      </div>
    </main>
  );
}
