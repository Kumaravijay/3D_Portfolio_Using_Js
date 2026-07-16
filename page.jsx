import Hero from "@/components/Hero";

export default function Page() {
  return (
    <main>
      <Hero />
      {/* ↓ Port your existing sections (About / Skills / Projects / Experience /
          Certs / Contact) below, or keep this project as the hero and link out. */}
      <section id="projects" className="placeholder">
        <p>Your existing portfolio sections go here.</p>
      </section>
    </main>
  );
}
