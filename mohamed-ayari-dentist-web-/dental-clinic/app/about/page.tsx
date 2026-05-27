import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, GraduationCap, Award, Users, Building2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'À propos',
  description:
    'Découvrez le parcours du Dr Mohamed Ben Othman Ayari, chirurgien-dentiste spécialisé en orthodontie à Hammam Lif, Ben Arous.',
};

const credentials = [
  {
    icon: GraduationCap,
    title: 'Formation',
    text: 'Diplômé de la Faculté de Médecine Dentaire de Monastir. Formations complémentaires en orthodontie en France.',
  },
  {
    icon: Award,
    title: 'Spécialité',
    text: 'Orthodontie, chirurgie orale, prothèses dentaires fixes et amovibles, soins conservateurs.',
  },
  {
    icon: Users,
    title: 'Patientèle',
    text: 'Patients de tout âge, de la première consultation pédiatrique aux soins pour adultes et seniors.',
  },
  {
    icon: Building2,
    title: 'Cabinet',
    text: 'Équipé en radiologie numérique, détartrage ultrasonique et caméra intra-orale. Désinfection rigoureuse.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-[68px]">

        {/* Page header */}
        <div className="bg-warm-100 border-b border-warm-200 py-10 lg:py-16">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-[12px] text-warm-500 mb-5" aria-label="Fil d'Ariane">
              <Link href="/" className="hover:text-navy-600 transition-colors">Accueil</Link>
              <span aria-hidden="true">/</span>
              <span className="text-warm-700">À propos</span>
            </nav>
            <p className="text-[11px] font-medium uppercase tracking-widest text-navy-600 mb-3">Notre cabinet</p>
            <h1 className="font-display text-[2.5rem] lg:text-[3rem] font-semibold text-navy-800 leading-[1.15]">
              Dr Mohamed Ben Othman Ayari
            </h1>
            <p className="text-warm-600 mt-3 text-[15px] max-w-xl leading-relaxed">
              Chirurgien-dentiste et orthodontiste à Hammam Lif depuis plus de quinze ans.
            </p>
          </div>
        </div>

        {/* Doctor bio */}
        <section className="py-14 lg:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

              {/* Photo + stats */}
              <div>
                <div className="aspect-[3/4] relative rounded overflow-hidden bg-warm-200">
                  <Image
                    src="/doctor-photo.png"
                    alt="Dr Mohamed Ben Othman Ayari, chirurgien-dentiste"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { value: '15+', label: "Années d'expérience" },
                    { value: '2 000+', label: 'Patients traités' },
                    { value: '5', label: 'Spécialités' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-warm-100 rounded p-4 text-center">
                      <p className="font-display text-[1.7rem] font-semibold text-navy-700 leading-none">{stat.value}</p>
                      <p className="text-[11px] text-warm-600 mt-1.5 leading-tight">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div>
                <h2 className="font-display text-2xl lg:text-3xl font-semibold text-navy-800 mb-6 leading-[1.2]">
                  Un médecin engagé dans la qualité des soins
                </h2>
                <div className="space-y-4 text-warm-700 text-[14.5px] leading-[1.75]">
                  <p>
                    Dr Mohamed Ben Othman Ayari a ouvert son cabinet à Hammam Lif après avoir
                    obtenu son diplôme de la Faculté de Médecine Dentaire de Monastir. Il s'est
                    rapidement spécialisé en orthodontie, discipline qu'il exerce pour les enfants
                    dès le stade de la dentition mixte ainsi que pour les adultes.
                  </p>
                  <p>
                    Ses traitements orthodontiques comprennent les appareils fixes traditionnels
                    (bagues métalliques ou céramiques) et les gouttières transparentes, sélectionnés
                    selon l'indication clinique de chaque patient. Il participe régulièrement à des
                    formations continues en France et en Tunisie.
                  </p>
                  <p>
                    Au-delà de l'orthodontie, le cabinet assure l'ensemble des soins courants :
                    bilan annuel, détartrage, soins conservateurs, extractions, prothèses fixes et
                    amovibles. Dr Ayari accorde une importance particulière à l'explication des
                    traitements et à la mise à l'aise des patients anxieux.
                  </p>
                </div>

                <div className="mt-10 grid sm:grid-cols-2 gap-4">
                  {credentials.map(({ icon: Icon, title, text }) => (
                    <div key={title} className="flex gap-3.5">
                      <div className="w-9 h-9 bg-navy-50 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-4.5 h-4.5 text-navy-600 w-[18px] h-[18px]" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-medium text-navy-800 text-sm mb-1">{title}</p>
                        <p className="text-warm-600 text-[13px] leading-relaxed">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clinic section */}
        <section className="py-14 lg:py-24 bg-warm-100">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-widest text-navy-600 mb-4">L'environnement</p>
                <h2 className="font-display text-3xl font-semibold text-navy-800 mb-6 leading-[1.2]">
                  Un espace conçu pour votre confort
                </h2>
                <div className="space-y-4 text-warm-700 text-[14.5px] leading-[1.75]">
                  <p>
                    Le cabinet est équipé de matériel récent : radiologie numérique à faible
                    irradiation, détartrage ultrasonique, caméra intra-orale pour visualiser les
                    zones difficiles d'accès. Les protocoles de stérilisation répondent aux normes
                    en vigueur.
                  </p>
                  <p>
                    La salle d'attente est accueillante, et les délais sont généralement respectés.
                    Pour les patients anxieux, des solutions adaptées sont proposées : explication
                    détaillée avant chaque geste, anesthésie locale de confort, et un rythme
                    adapté à chacun.
                  </p>
                  <p>
                    Le cabinet est accessible en voiture et desservi par les transports en commun.
                    Un parking est disponible à proximité.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] relative rounded overflow-hidden bg-warm-200">
                  <Image
                    src="/clinic-photo.png"
                    alt="Salle de soins du cabinet Dr Ayari, Hammam Lif"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-14 lg:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-[11px] font-medium uppercase tracking-widest text-navy-600 mb-4">Notre approche</p>
              <h2 className="font-display text-3xl font-semibold text-navy-800 mb-8 leading-[1.2]">
                Ce qui guide notre pratique
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Écoute et diagnostic',
                  text: 'Chaque consultation commence par un examen complet et une discussion sur les préoccupations du patient. Aucun traitement n\'est proposé sans explication préalable.',
                },
                {
                  title: 'Rigueur technique',
                  text: 'Les protocoles cliniques suivent les recommandations actuelles. Le matériel est régulièrement mis à jour pour garantir des soins de qualité.',
                },
                {
                  title: 'Continuité du suivi',
                  text: 'Un dossier patient complet est tenu à jour. Les rendez-vous de contrôle sont planifiés et les urgences traitées dans les meilleurs délais.',
                },
              ].map((item) => (
                <div key={item.title} className="border border-warm-200 rounded p-6">
                  <div className="w-1 h-8 bg-navy-600 rounded mb-5" aria-hidden="true" />
                  <h3 className="font-display text-[1.15rem] font-semibold text-navy-800 mb-3">{item.title}</h3>
                  <p className="text-warm-600 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-warm-100 py-14 lg:py-20">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="bg-white border border-warm-200 rounded p-8 lg:p-12 max-w-2xl">
              <h2 className="font-display text-2xl lg:text-3xl font-semibold text-navy-800 mb-4">
                Vous souhaitez prendre rendez-vous ?
              </h2>
              <p className="text-warm-700 text-[14.5px] leading-relaxed mb-8">
                Consultez nos disponibilités et réservez votre consultation en ligne ou par téléphone.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/book-appointment"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-600 text-white text-sm font-medium rounded hover:bg-navy-700 transition-colors"
                >
                  Réserver en ligne
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <a
                  href="tel:+21698302743"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-warm-300 text-warm-800 text-sm font-medium rounded hover:border-navy-400 hover:text-navy-700 transition-colors"
                >
                  Appeler le cabinet
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
