import type { Metadata } from "next";
import Link from "next/link";
import { DELIVERY_OPTIONS, FREE_SHIPPING_FROM, PAYMENT_OPTIONS } from "@/lib/shipping";

export const metadata: Metadata = {
  title: "Termeni și condiții — MagOnline",
  description: "Condițiile de utilizare a site-ului MagOnline, comenzi, livrare, retur, garanție și protecția datelor.",
};

/**
 * Company details shown in the legal text.
 * TODO before going live: replace the bracketed placeholders with the real company data.
 * This page is a template, not legal advice; have it reviewed by a lawyer.
 */
const COMPANY = {
  name: "MagOnline SRL",
  cui: "[CUI]",
  regCom: "[nr. Registrul Comerțului]",
  address: "[sediul social]",
  email: "contact@magonline.ro",
  phone: "[telefon]",
};

const LAST_UPDATED = "22 noiembrie 2026";

const SECTIONS = [
  { id: "general", title: "1. Informații generale" },
  { id: "cont", title: "2. Contul de client" },
  { id: "comenzi", title: "3. Comenzi și contract" },
  { id: "preturi", title: "4. Prețuri și plată" },
  { id: "livrare", title: "5. Livrare" },
  { id: "retur", title: "6. Dreptul de retragere și retur" },
  { id: "garantie", title: "7. Garanție" },
  { id: "vanzatori", title: "8. Vânzători parteneri" },
  { id: "raspundere", title: "9. Limitarea răspunderii" },
  { id: "confidentialitate", title: "10. Protecția datelor personale" },
  { id: "litigii", title: "11. Reclamații și litigii" },
];

const fmt = (n: number) => n.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function TermsPage() {
  return (
    <div className="bg-white">
      <div className="border-b border-mist bg-paper">
        <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-8 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-wider text-crimson">Informații legale</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-navy sm:text-4xl">Termeni și condiții</h1>
          <p className="mt-3 max-w-2xl text-sm text-ink-soft sm:text-base">
            Regulile după care funcționează MagOnline: cum plasezi o comandă, cum livrăm, cum returnezi un produs și ce facem cu datele tale.
          </p>
          <p className="mt-4 text-xs text-ink-soft">Ultima actualizare: {LAST_UPDATED}</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-4 py-10 sm:px-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav aria-label="Cuprins" className="hidden lg:block">
          <div className="sticky top-24">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-soft">Cuprins</p>
            <ol className="flex flex-col gap-1 border-l border-mist">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="-ml-px block border-l-2 border-transparent py-1 pl-4 text-sm text-ink-soft hover:border-crimson hover:text-navy">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <article className="min-w-0 max-w-3xl text-[15px] leading-relaxed text-ink [&_h2]:scroll-mt-28 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-navy [&_li]:mt-1.5 [&_p]:mt-3 [&_section]:border-b [&_section]:border-mist [&_section]:pb-8 [&_section]:pt-8 first:[&_section]:pt-0 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
          <section>
            <h2 id="general">1. Informații generale</h2>
            <p>
              Site-ul MagOnline este operat de {COMPANY.name}, CUI {COMPANY.cui}, înregistrată la {COMPANY.regCom}, cu sediul în {COMPANY.address}
              („MagOnline”, „noi”). Ne poți scrie la <a className="font-medium text-navy underline underline-offset-2" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>{" "}
              sau din <Link href="/contact" className="font-medium text-navy underline underline-offset-2">pagina de contact</Link>.
            </p>
            <p>
              Folosind site-ul sau plasând o comandă, accepți acești termeni. Îi putem actualiza; versiunea aplicabilă unei comenzi este cea în vigoare la data plasării ei.
            </p>
          </section>

          <section>
            <h2 id="cont">2. Contul de client</h2>
            <ul>
              <li>Pentru a plasa o comandă ai nevoie de un cont. Trebuie să ai cel puțin 18 ani și să ne dai date reale.</li>
              <li>Ești responsabil pentru păstrarea parolei. Dacă bănuiești că cineva îți folosește contul, schimbă parola și anunță-ne.</li>
              <li>Putem suspenda conturile folosite pentru fraudă, comenzi false sau încălcarea acestor termeni.</li>
            </ul>
          </section>

          <section>
            <h2 id="comenzi">3. Comenzi și contract</h2>
            <p>
              Când apeși „Plasează comanda” ne trimiți o ofertă de cumpărare. Comanda apare imediat în <Link href="/comenzi" className="font-medium text-navy underline underline-offset-2">Comenzile mele</Link> cu
              statusul „Înregistrată”. Contractul se încheie când confirmăm comanda, iar statusul devine „În procesare”.
            </p>
            <p>
              Putem anula o comandă dacă produsul nu mai este în stoc, dacă prețul afișat a fost evident greșit sau dacă datele de livrare nu pot fi verificate. Te anunțăm, iar dacă ai plătit
              deja ceva îți returnăm banii în cel mult 14 zile.
            </p>
          </section>

          <section>
            <h2 id="preturi">4. Prețuri și plată</h2>
            <ul>
              <li>Prețurile sunt în lei și includ TVA. Costul livrării este afișat separat, înainte de plasarea comenzii.</li>
              <li>Prețul valabil este cel din momentul plasării comenzii. Dacă un preț s-a schimbat de când ai pus produsul în coș, îți arătăm noul preț la finalizarea comenzii.</li>
              <li>
                Metode de plată acceptate:{" "}
                {PAYMENT_OPTIONS.map((p) => p.label.toLowerCase()).join(" sau ")}. Plătești doar când primești coletul. Factura se emite pe numele și adresa din comandă.
              </li>
            </ul>
          </section>

          <section>
            <h2 id="livrare">5. Livrare</h2>
            <ul>
              {DELIVERY_OPTIONS.map((o) => (
                <li key={o.id}>
                  <strong className="font-semibold text-navy">{o.label}</strong>: {fmt(o.price)} lei, {o.description.charAt(0).toLowerCase() + o.description.slice(1)}.
                </li>
              ))}
              <li>Livrarea este gratuită pentru comenzile de cel puțin {FREE_SHIPPING_FROM} lei (valoarea produselor).</li>
              <li>Livrăm doar în România. Termenele sunt estimative și curg de la confirmarea comenzii.</li>
              <li>Verifică coletul la primire. Dacă este deteriorat, notează asta în procesul-verbal al curierului și anunță-ne în 48 de ore.</li>
            </ul>
          </section>

          <section>
            <h2 id="retur">6. Dreptul de retragere și retur</h2>
            <p>
              Conform OUG nr. 34/2014, te poți răzgândi în 14 zile de la primirea produsului, fără să ne spui motivul. MagOnline extinde acest termen la <strong className="font-semibold text-navy">30 de zile</strong>.
            </p>
            <ul>
              <li>Ne anunți din <Link href="/contact" className="font-medium text-navy underline underline-offset-2">pagina de contact</Link> (subiect „Retur”), cu numărul comenzii.</li>
              <li>Produsul trebuie returnat complet, cu accesoriile și documentele primite, fără urme de folosire peste ce era necesar ca să-l verifici.</li>
              <li>Îți returnăm contravaloarea produsului și costul livrării inițiale în cel mult 14 zile de la primirea returului.</li>
              <li>
                Nu se pot returna: produsele sigilate din motive de igienă sau sănătate, dacă au fost desigilate (de exemplu cosmetice și parfumuri), software-ul sau conținutul digital
                desigilat și produsele făcute la comandă.
              </li>
            </ul>
          </section>

          <section>
            <h2 id="garantie">7. Garanție</h2>
            <p>
              Toate produsele beneficiază de garanția legală de conformitate de 2 ani (OUG nr. 140/2021). Dacă un produs nu funcționează cum trebuie, ai dreptul la reparare sau înlocuire, iar
              dacă acestea nu sunt posibile, la reducerea prețului sau la banii înapoi. Unele produse au în plus garanție comercială de la producător, menționată în pagina produsului.
            </p>
          </section>

          <section>
            <h2 id="vanzatori">8. Vânzători parteneri</h2>
            <p>
              Pe MagOnline vând și alte firme, prin programul <Link href="/devino-vanzator" className="font-medium text-navy underline underline-offset-2">Devino vânzător</Link>. Vânzătorul fiecărui
              produs răspunde pentru descrierea, calitatea, garanția și factura produsului. MagOnline intermediază comanda și te ajută dacă apare o problemă cu un vânzător.
            </p>
            <p>Vânzătorii se obligă să publice informații corecte și să nu listeze produse contrafăcute, periculoase sau interzise de lege. Putem șterge orice listare care încalcă aceste reguli.</p>
          </section>

          <section>
            <h2 id="raspundere">9. Limitarea răspunderii</h2>
            <p>
              Ne străduim ca informațiile de pe site să fie corecte, dar pot apărea erori de afișare. Nu răspundem pentru întreruperi cauzate de factori din afara controlului nostru (de exemplu
              defecțiuni ale furnizorilor de internet sau ale curierilor). Nimic din acești termeni nu îți restrânge drepturile pe care le ai prin lege, ca și consumator.
            </p>
          </section>

          <section>
            <h2 id="confidentialitate">10. Protecția datelor personale</h2>
            <p>Prelucrăm datele tale conform Regulamentului (UE) 2016/679 (GDPR). Pe scurt:</p>
            <ul>
              <li>
                <strong className="font-semibold text-navy">Ce date:</strong> nume, email, telefon, adresa de livrare, comenzile și, pentru vânzători, datele firmei și IBAN-ul.
              </li>
              <li>
                <strong className="font-semibold text-navy">De ce:</strong> ca să-ți livrăm comenzile, să emitem facturi, să-ți răspundem la mesaje și să-ți arătăm produsele văzute recent.
              </li>
              <li>
                <strong className="font-semibold text-navy">Cui le dăm:</strong> doar curierului (pentru livrare), vânzătorului produsului comandat și autorităților, când legea o cere. Nu
                vindem datele tale.
              </li>
              <li>
                <strong className="font-semibold text-navy">Cât timp:</strong> cât ai cont, iar datele din facturi cât cere legislația financiar-contabilă.
              </li>
              <li>
                <strong className="font-semibold text-navy">Drepturile tale:</strong> acces, rectificare, ștergere, restricționare, portabilitate și opoziție. Le exerciți scriindu-ne la{" "}
                {COMPANY.email}. Poți depune plângere la ANSPDCP (dataprotection.ro).
              </li>
              <li>
                <strong className="font-semibold text-navy">Stocare locală:</strong> coșul, favoritele și sesiunea de autentificare sunt păstrate în browserul tău (localStorage). Nu folosim cookie-uri de
                publicitate.
              </li>
            </ul>
          </section>

          <section>
            <h2 id="litigii">11. Reclamații și litigii</h2>
            <p>
              Pentru orice nemulțumire, scrie-ne mai întâi din <Link href="/contact" className="font-medium text-navy underline underline-offset-2">pagina de contact</Link>; răspundem în cel mult
              30 de zile. Te poți adresa și Autorității Naționale pentru Protecția Consumatorilor (
              <a href="https://anpc.ro" target="_blank" rel="noreferrer" className="font-medium text-navy underline underline-offset-2">
                anpc.ro
              </a>
              ), procedurii de soluționare alternativă a litigiilor (SAL) sau platformei europene de soluționare online a litigiilor (
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" className="font-medium text-navy underline underline-offset-2">
                SOL
              </a>
              ). Litigiile care nu se rezolvă pe cale amiabilă sunt judecate de instanțele competente din România.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
