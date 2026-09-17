import { EventsList } from "@/components/events/EventsList";
import { getEvents } from "@/lib/api";

export const revalidate = 60;

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="pt-10 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
          Tadbirlar
        </h1>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          Texnoparkda o&apos;tkaziladigan xakatonlar, ideatonlar, ochiq eshiklar kuni va maxsus master-klasslar jadvali bilan tanishing.
        </p>
      </div>
      <EventsList events={events} />
    </div>
  );
}
