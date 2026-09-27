import { useLocale, type Locale } from "~/i18n";

// The inquiry flow from the Firebase case study, drawn as an ordered list
// (it is a sequence) that ends in a fork: the sender's status page and my inbox.

interface FlowText {
  label: string;
  steps: [string, string][];
  fork: [string, string][];
  caption: string;
}

const TEXT: Record<Locale, FlowText> = {
  en: {
    label: "How an inquiry travels",
    steps: [
      [
        "Your browser",
        "The form checks each field as you type. Firebase loads only when you press Send.",
      ],
      [
        "Anonymous sign-in",
        "Gives this browser an ID so it can follow its own inquiry. You are not asked for anything.",
      ],
      [
        "One batched write",
        "The inquiry and a note of when this browser last sent one. Both are saved, or neither.",
      ],
      [
        "Firestore security rules",
        "Refuse unknown fields, wrong types, text that is too long, and a second send from the same browser within a minute.",
      ],
      [
        "Firestore, in the EU",
        "Kept for 12 months, then deleted by a time-to-live policy. Nobody has to remember.",
      ],
    ],
    fork: [
      ["Your status page", "Changes on its own when I read and answer your inquiry."],
      ["My inbox", "Google sign-in, owner only. New inquiries appear without a reload."],
    ],
    caption:
      "Every rule in the yellow step has a test that runs against the Firebase emulator on each push.",
  },
  de: {
    label: "Der Weg einer Anfrage",
    steps: [
      [
        "Ihr Browser",
        "Das Formular prüft jedes Feld beim Tippen. Firebase lädt erst, wenn Sie auf Senden drücken.",
      ],
      [
        "Anonyme Anmeldung",
        "Gibt diesem Browser eine ID, damit er seine Anfrage verfolgen kann. Sie werden nach nichts gefragt.",
      ],
      [
        "Ein Batch-Schreibvorgang",
        "Die Anfrage und ein Vermerk, wann dieser Browser zuletzt eine gesendet hat. Beides wird gespeichert oder keins.",
      ],
      [
        "Firestore Security Rules",
        "Lehnen unbekannte Felder, falsche Typen, zu lange Texte und ein zweites Senden aus demselben Browser innerhalb einer Minute ab.",
      ],
      [
        "Firestore, in der EU",
        "12 Monate gespeichert, dann per Time-to-live-Regel gelöscht. Niemand muss daran denken.",
      ],
    ],
    fork: [
      ["Ihre Statusseite", "Ändert sich von selbst, wenn ich Ihre Anfrage lese und beantworte."],
      [
        "Mein Posteingang",
        "Google-Anmeldung, nur für mich. Neue Anfragen erscheinen ohne Neuladen.",
      ],
    ],
    caption:
      "Für jede Regel im gelben Schritt gibt es einen Test, der bei jedem Push gegen den Firebase-Emulator läuft.",
  },
  ro: {
    label: "Drumul unei cereri",
    steps: [
      [
        "Browserul dumneavoastră",
        "Formularul verifică fiecare câmp pe măsură ce scrieți. Firebase se încarcă abia când apăsați Trimite.",
      ],
      [
        "Autentificare anonimă",
        "Îi dă acestui browser un ID, ca să-și poată urmări cererea. Nu vi se cere nimic.",
      ],
      [
        "O singură scriere în lot",
        "Cererea și o notă despre când a trimis acest browser ultima cerere. Se salvează amândouă sau niciuna.",
      ],
      [
        "Regulile de securitate Firestore",
        "Refuză câmpurile necunoscute, tipurile greșite, textul prea lung și o a doua trimitere din același browser în mai puțin de un minut.",
      ],
      [
        "Firestore, în UE",
        "Păstrată 12 luni, apoi ștearsă de o regulă time-to-live. Nu trebuie să țină nimeni minte.",
      ],
    ],
    fork: [
      ["Pagina de status", "Se schimbă singură când citesc cererea și când răspund."],
      ["Căsuța mea", "Autentificare Google, doar pentru mine. Cererile noi apar fără reîncărcare."],
    ],
    caption:
      "Fiecare regulă din pasul galben are un test care rulează pe emulatorul Firebase la fiecare push.",
  },
};

const RULES_STEP = 3;

export function Flow() {
  const text = TEXT[useLocale()];
  return (
    <figure className="flow" aria-label={text.label}>
      <ol>
        {text.steps.map(([title, detail], index) => (
          <li
            key={title}
            className={index === RULES_STEP ? "flow__step flow__step--rules" : "flow__step"}
          >
            <span className="flow__number" aria-hidden="true">
              {index + 1}
            </span>
            <span>
              <strong>{title}</strong>
              {detail}
            </span>
          </li>
        ))}
        <li className="flow__fork">
          {text.fork.map(([title, detail]) => (
            <div key={title}>
              <strong>{title}</strong> {detail}
            </div>
          ))}
        </li>
      </ol>
      <figcaption>{text.caption}</figcaption>
    </figure>
  );
}
