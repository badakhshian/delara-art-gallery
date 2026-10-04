// Languages: English at /<path>, French at /fr/<path> (see middleware.js).
// Safe to import from server and client components.

export const LANGS = ["en", "fr"];

export function normalizeLang(lang) {
  return lang === "fr" ? "fr" : "en";
}

// "/timeline" -> "/fr/timeline" for French; English paths are unchanged.
export function localizePath(lang, path) {
  if (normalizeLang(lang) !== "fr") return path;
  return path === "/" ? "/fr" : `/fr${path}`;
}

// "/fr/timeline" -> "/timeline", "/fr" -> "/"; English paths are unchanged.
export function unlocalizePath(pathname) {
  if (pathname === "/fr") return "/";
  if (pathname?.startsWith("/fr/")) return pathname.slice(3);
  return pathname || "/";
}

export function langFromPath(pathname) {
  return pathname === "/fr" || pathname?.startsWith("/fr/") ? "fr" : "en";
}

const plural = (n, one, many) => `${String(n).padStart(2, "0")} ${n === 1 ? one : many}`;

const en = {
  locale: "en-CA",
  ogLocale: "en_CA",
  nav: { home: "Home", collection: "Collection", artist: "Artist", timeline: "Timeline", visit: "Visit" },
  inquire: "Inquire",
  toggleMenu: "Toggle menu",
  languageSwitch: "Language",
  sold: "Sold",
  inquireForPrice: "Inquire for price",
  works: (n) => plural(n, "work", "works"),
  pieces: (n) => plural(n, "piece", "pieces"),
  footer: {
    tagline: "Viewings by appointment · Est. 2003",
    contact: "Contact",
    monogram: "Delara Ahmadi Darani monogram",
    rights: (year) => `© ${year} Delara Art Gallery. All rights reserved.`,
  },
  home: {
    heroTagline:
      "Original mixed-media works by Delara Ahmadi Darani — acrylic and modelling paste built up into raised, textured surfaces. Available directly from the studio, one piece at a time.",
    onTheWall: "Currently on the wall",
    provenance:
      "Every piece ships with its provenance, condition report, and a certificate of authenticity.",
    oneOfOne: "1 of 1",
    noEditions: "no editions, no prints",
    throughTheYears: "Through the years",
    fullTimeline: "Full timeline →",
    exploreTitle: "Explore the collections",
    exploreText: "Every body of work, browsed one collection at a time.",
    viewCollections: "View collections",
    scrollBack: "Scroll back",
    scrollForward: "Scroll forward",
  },
  collections: {
    eyebrow: "Collections",
    title: "Every body of work, one at a time",
    viewFull: "View full collection →",
    collection: "Collection",
    empty: "No pieces in this collection yet.",
  },
  artist: { eyebrow: "The Artist", viewCollection: "View the collection" },
  timeline: {
    eyebrow: "Timeline",
    title: "Every piece, year by year",
    intro: (count, years, first, last) =>
      `${count} ${count === 1 ? "work" : "works"}${
        years > 1 ? ` across ${years} years, from ${first} to ${last}` : ""
      }. Follow the line to see how the work has moved through materials and ideas — select any piece for its full story.`,
    empty: "No pieces yet.",
    undated: "Undated",
  },
  piece: {
    back: "← Back",
    by: "by",
    detail: "detail",
    view: (i) => `view ${i}`,
    originalOneOfOne: "Original, one of one",
    viewCertificate: "View certificate",
    scanToVerify: "Scan to verify",
    price: "Price",
    purchaseConfirmed:
      "✓ PURCHASE CONFIRMED — thank you. A receipt has been sent to your email, and Delara will be in touch about delivery.",
    buyNow: "Buy now",
    redirecting: "Redirecting…",
    inquireAbout: "Inquire about this piece",
    inquirySubject: (title) => `Inquiry: ${title}`,
    error: "Something went wrong. Please try again.",
  },
  certificate: {
    title: "Certificate of Authenticity",
    back: "← Back to piece",
    print: "Print / Save as PDF",
    fields: {
      title: "Title",
      artist: "Artist",
      year: "Year",
      medium: "Medium",
      dims: "Dimensions",
      edition: "Edition",
      id: "Certificate ID",
      issued: "Date issued",
    },
    statement:
      "This certifies that the work described above is an original, one-of-a-kind piece created by Delara Ahmadi Darani. No editions, reproductions, or prints of this piece have been authorized by the artist. This certificate should remain with the artwork as part of its provenance.",
    signature: "Artist signature",
  },
  visit: {
    eyebrow: "Visit",
    title: "Request a viewing",
    intro:
      "Viewings are by appointment. Fill in a few details below and the request is sent directly — no email app needed.",
    name: "Name",
    email: "Email",
    phone: "Phone (optional)",
    whichPiece: "Which piece would you like to see?",
    noPiece: "No specific piece — general visit",
    preferredTime: "Preferred date / time (optional)",
    preferredPlaceholder: "e.g. weekday afternoons",
    message: "Message (optional)",
    send: "Send request",
    sending: "Sending…",
    sentTitle: "Request sent",
    sentText: "Thank you — your viewing request has been sent. You'll hear back directly to confirm a time.",
    error: "Something went wrong. Please try again.",
  },
  meta: {
    homeTitle: "Delara Art Gallery — Original works by Delara Ahmadi Darani",
    homeDescription:
      "Original mixed-media works by Delara Ahmadi Darani — acrylic and modelling paste built up into raised, textured surfaces. Available directly from the studio, one piece at a time.",
    collectionsTitle: "Collections — Delara Art Gallery",
    collectionsDescription:
      "Browse Delara Ahmadi Darani's original artworks by collection — mixed-media paintings and sculpture, each a one-of-a-kind piece with a certificate of authenticity.",
    collectionDescription: (name, n) =>
      `${name}: ${n} original ${n === 1 ? "work" : "works"} by Delara Ahmadi Darani, available directly from the studio.`,
    timelineTitle: "Timeline — Delara Art Gallery",
    timelineDescription:
      "Every original work by Delara Ahmadi Darani, year by year — follow how the work has moved through materials and ideas.",
    artistTitle: "The Artist — Delara Ahmadi Darani",
    artistFallback: "About Delara Ahmadi Darani, the artist behind Delara Art Gallery.",
    visitTitle: "Visit the Studio — Delara Art Gallery",
    visitDescription:
      "Request a private viewing of Delara Ahmadi Darani's original artworks. Viewings by appointment.",
    certificateTitle: (title) => `Certificate of Authenticity — ${title}`,
    imageAlt: (title) => `${title} by Delara Ahmadi Darani`,
  },
};

const fr = {
  locale: "fr-CA",
  ogLocale: "fr_CA",
  nav: { home: "Accueil", collection: "Collections", artist: "Artiste", timeline: "Chronologie", visit: "Visite" },
  inquire: "Contact",
  toggleMenu: "Ouvrir le menu",
  languageSwitch: "Langue",
  sold: "Vendu",
  inquireForPrice: "Prix sur demande",
  works: (n) => plural(n, "œuvre", "œuvres"),
  pieces: (n) => plural(n, "œuvre", "œuvres"),
  footer: {
    tagline: "Visites sur rendez-vous · Depuis 2003",
    contact: "Contact",
    monogram: "Monogramme de Delara Ahmadi Darani",
    rights: (year) => `© ${year} Delara Art Gallery. Tous droits réservés.`,
  },
  home: {
    heroTagline:
      "Œuvres originales en techniques mixtes de Delara Ahmadi Darani — acrylique et pâte de modelage travaillées en surfaces texturées et en relief. Offertes directement par l’atelier, une œuvre à la fois.",
    onTheWall: "Actuellement aux cimaises",
    provenance:
      "Chaque œuvre est livrée avec sa provenance, un rapport d’état et un certificat d’authenticité.",
    oneOfOne: "Pièce unique",
    noEditions: "ni éditions, ni reproductions",
    throughTheYears: "Au fil des années",
    fullTimeline: "Chronologie complète →",
    exploreTitle: "Explorer les collections",
    exploreText: "Chaque série d’œuvres, une collection à la fois.",
    viewCollections: "Voir les collections",
    scrollBack: "Défiler vers l’arrière",
    scrollForward: "Défiler vers l’avant",
  },
  collections: {
    eyebrow: "Collections",
    title: "Chaque série d’œuvres, une à la fois",
    viewFull: "Voir toute la collection →",
    collection: "Collection",
    empty: "Aucune œuvre dans cette collection pour le moment.",
  },
  artist: { eyebrow: "L’artiste", viewCollection: "Voir la collection" },
  timeline: {
    eyebrow: "Chronologie",
    title: "Chaque œuvre, année après année",
    intro: (count, years, first, last) =>
      `${count} ${count === 1 ? "œuvre" : "œuvres"}${
        years > 1 ? ` sur ${years} ans, de ${first} à ${last}` : ""
      }. Suivez la ligne pour voir comment le travail a évolué à travers les matériaux et les idées — sélectionnez une œuvre pour découvrir son histoire complète.`,
    empty: "Aucune œuvre pour le moment.",
    undated: "Non datée",
  },
  piece: {
    back: "← Retour",
    by: "par",
    detail: "détail",
    view: (i) => `vue ${i}`,
    originalOneOfOne: "Œuvre originale, pièce unique",
    viewCertificate: "Voir le certificat",
    scanToVerify: "Scanner pour vérifier",
    price: "Prix",
    purchaseConfirmed:
      "✓ ACHAT CONFIRMÉ — merci. Un reçu a été envoyé à votre adresse courriel, et Delara communiquera avec vous au sujet de la livraison.",
    buyNow: "Acheter",
    redirecting: "Redirection…",
    inquireAbout: "Se renseigner sur cette œuvre",
    inquirySubject: (title) => `Demande de renseignements : ${title}`,
    error: "Une erreur s’est produite. Veuillez réessayer.",
  },
  certificate: {
    title: "Certificat d’authenticité",
    back: "← Retour à l’œuvre",
    print: "Imprimer / Enregistrer en PDF",
    fields: {
      title: "Titre",
      artist: "Artiste",
      year: "Année",
      medium: "Technique",
      dims: "Dimensions",
      edition: "Édition",
      id: "N° de certificat",
      issued: "Date d’émission",
    },
    statement:
      "Le présent certificat atteste que l’œuvre décrite ci-dessus est une pièce originale et unique créée par Delara Ahmadi Darani. Aucune édition, reproduction ou impression de cette œuvre n’a été autorisée par l’artiste. Ce certificat doit accompagner l’œuvre et fait partie de sa provenance.",
    signature: "Signature de l’artiste",
  },
  visit: {
    eyebrow: "Visite",
    title: "Demander une visite",
    intro:
      "Les visites se font sur rendez-vous. Remplissez les quelques champs ci-dessous et votre demande est envoyée directement — aucune application de courriel nécessaire.",
    name: "Nom",
    email: "Courriel",
    phone: "Téléphone (facultatif)",
    whichPiece: "Quelle œuvre aimeriez-vous voir?",
    noPiece: "Aucune œuvre en particulier — visite générale",
    preferredTime: "Date / heure souhaitée (facultatif)",
    preferredPlaceholder: "p. ex. en semaine, l’après-midi",
    message: "Message (facultatif)",
    send: "Envoyer la demande",
    sending: "Envoi…",
    sentTitle: "Demande envoyée",
    sentText: "Merci — votre demande de visite a bien été envoyée. Vous recevrez une réponse directement pour confirmer l’heure.",
    error: "Une erreur s’est produite. Veuillez réessayer.",
  },
  meta: {
    homeTitle: "Delara Art Gallery — Œuvres originales de Delara Ahmadi Darani",
    homeDescription:
      "Œuvres originales en techniques mixtes de Delara Ahmadi Darani — acrylique et pâte de modelage en surfaces texturées et en relief. Offertes directement par l’atelier, une œuvre à la fois.",
    collectionsTitle: "Collections — Delara Art Gallery",
    collectionsDescription:
      "Parcourez les œuvres originales de Delara Ahmadi Darani par collection — peintures en techniques mixtes et sculptures, chacune une pièce unique accompagnée d’un certificat d’authenticité.",
    collectionDescription: (name, n) =>
      `${name} : ${n} ${n === 1 ? "œuvre originale" : "œuvres originales"} de Delara Ahmadi Darani, offertes directement par l’atelier.`,
    timelineTitle: "Chronologie — Delara Art Gallery",
    timelineDescription:
      "Toutes les œuvres originales de Delara Ahmadi Darani, année après année — suivez l’évolution de son travail à travers les matériaux et les idées.",
    artistTitle: "L’artiste — Delara Ahmadi Darani",
    artistFallback: "À propos de Delara Ahmadi Darani, l’artiste derrière Delara Art Gallery.",
    visitTitle: "Visiter l’atelier — Delara Art Gallery",
    visitDescription:
      "Demandez une visite privée des œuvres originales de Delara Ahmadi Darani. Visites sur rendez-vous.",
    certificateTitle: (title) => `Certificat d’authenticité — ${title}`,
    imageAlt: (title) => `${title} par Delara Ahmadi Darani`,
  },
};

const dictionaries = { en, fr };

export function getDictionary(lang) {
  return dictionaries[normalizeLang(lang)];
}
