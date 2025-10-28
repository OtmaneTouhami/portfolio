import { profile } from "../../data/profile";

export default function About() {
  return (
    <section id="about" className="section-full bg-neutral-950">
      <div className="container-px mx-auto max-w-3xl">
        <div className="card p-6 sm:p-8">
          <h2 className="section-heading">About</h2>
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {profile.bio}
          </p>
        </div>
      </div>
    </section>
  );
}
