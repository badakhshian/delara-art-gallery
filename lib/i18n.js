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
    privacy: "Privacy policy",
    trackOrder: "Track an order",
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
    collectionsEyebrow: "The collections",
    newestCollection: "Newest collection",
    viewAllCollections: "View all collections",
    scrollBack: "Scroll back",
    scrollForward: "Scroll forward",
  },
  collections: {
    eyebrow: "Collections",
    title: "Moments that hold a story",
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
  order: {
    eyebrow: (id, date) => `Order ${id} · Placed ${date}`,
    headline: {
      paid: "Thank you — your order is confirmed",
      preparing: "Your artwork is being prepared",
      shipped: "Your artwork is on its way",
      delivered: "Your artwork has arrived",
      pickup: "Your artwork is ready for pickup",
      hand_delivered: "Your artwork has been delivered",
      cancelled: "This order was cancelled",
    },
    intro: (name) =>
      `Thank you${name ? `, ${name}` : ""}. This page always shows the latest status of your order — keep the link, or find it again with “Track an order” at the bottom of the site.`,
    cancelledText: "If you have any questions about this order, please get in touch.",
    status: "Status",
    steps: {
      paid: "Paid",
      preparing: "Preparing",
      shipped: "Shipped",
      delivered: "Delivered",
      pickup: "Ready for pickup",
      hand_delivered: "Hand-delivered",
      cancelled: "Cancelled",
    },
    stepNotes: {
      paid: "Payment received",
      preparing: "Carefully packed, with its signed certificate of authenticity.",
      pickup: "Your artwork is waiting for you at the studio. We'll arrange a time together.",
    },
    current: "Current status",
    upcoming: "Upcoming",
    carrier: "Carrier",
    trackingNumber: "Tracking number",
    trackPackage: "Track package →",
    amountPaid: "Paid",
    oneOfOne: "Original · 1 of 1",
    shippingTo: "Shipping to",
    questions: "Questions?",
    certificate: "View certificate of authenticity →",
    fromDelara: "— Delara",
    lookupEyebrow: "Your order",
    lookupTitle: "Track an order",
    lookupIntro: "Enter your order number and the email you used at checkout.",
    orderNumber: "Order number",
    email: "Email",
    find: "Find my order →",
    finding: "Looking…",
    notFound: "We couldn't find an order with that number and email. Please check both and try again.",
    error: "Something went wrong. Please try again.",
    lookupHelp: "You'll find your order number in your purchase email.",
    needHelp: "Need help?",
  },
  meta: {
    homeTitle: "Delara Ahmadi Darani — Original Paintings & Fine Art, Montréal | Delara Art Gallery",
    homeDescription:
      "Original paintings by Montréal artist Delara Ahmadi Darani — abstract and mixed-media works, watercolours and pastels. One-of-a-kind artworks for sale directly from the studio, each with a certificate of authenticity.",
    collectionsTitle: "Art Collections — Original Paintings by Delara Ahmadi Darani",
    collectionsDescription:
      "Browse original paintings by Montréal artist Delara Ahmadi Darani by collection — abstract, contemporary, watercolour and pastel works, each one of a kind with a certificate of authenticity.",
    collectionDescription: (name, n) =>
      `${name}: ${n} original ${n === 1 ? "artwork" : "artworks"} by Montréal artist Delara Ahmadi Darani, for sale directly from the studio.`,
    privacyTitle: "Privacy policy — Delara Art Gallery",
    privacyDescription: "What personal information artedelara.com collects, why, who it is shared with, and your rights.",
    timelineTitle: "Timeline — Artworks by Delara Ahmadi Darani",
    timelineDescription:
      "Every original work by Delara Ahmadi Darani, year by year — follow how the work has moved through materials and ideas.",
    artistTitle: "About the Artist — Delara Ahmadi Darani, Montréal Painter",
    artistFallback: "About Delara Ahmadi Darani, the Montréal painter behind Delara Art Gallery.",
    visitTitle: "Visit the Studio in Montréal — Delara Art Gallery",
    visitDescription:
      "Book a private viewing of original paintings by Delara Ahmadi Darani in Montréal. Viewings by appointment.",
    certificateTitle: (title) => `Certificate of Authenticity — ${title}`,
    orderTitle: "Your order — Delara Art Gallery",
    trackTitle: "Track an order — Delara Art Gallery",
    trackDescription: "Find the status of your artwork order with your order number and email.",
    imageAlt: (title, medium) =>
      `${title} — ${medium ? medium.trim().toLowerCase() : "original artwork"} by Delara Ahmadi Darani`,
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
    privacy: "Politique de confidentialité",
    trackOrder: "Suivre une commande",
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
    collectionsEyebrow: "Les collections",
    newestCollection: "Collection la plus récente",
    viewAllCollections: "Voir toutes les collections",
    scrollBack: "Défiler vers l’arrière",
    scrollForward: "Défiler vers l’avant",
  },
  collections: {
    eyebrow: "Collections",
    title: "Des instants qui gardent une histoire",
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
  order: {
    eyebrow: (id, date) => `Commande ${id} · Passée le ${date}`,
    headline: {
      paid: "Merci — votre commande est confirmée",
      preparing: "Votre œuvre est en préparation",
      shipped: "Votre œuvre est en route",
      delivered: "Votre œuvre est arrivée",
      pickup: "Votre œuvre est prête à être récupérée",
      hand_delivered: "Votre œuvre vous a été remise",
      cancelled: "Cette commande a été annulée",
    },
    intro: (name) =>
      `Merci${name ? `, ${name}` : ""}. Cette page affiche toujours l’état le plus récent de votre commande — conservez le lien, ou retrouvez-la avec « Suivre une commande » au bas du site.`,
    cancelledText: "Pour toute question au sujet de cette commande, n’hésitez pas à nous écrire.",
    status: "État",
    steps: {
      paid: "Payée",
      preparing: "En préparation",
      shipped: "Expédiée",
      delivered: "Livrée",
      pickup: "Prête à récupérer",
      hand_delivered: "Remise en main propre",
      cancelled: "Annulée",
    },
    stepNotes: {
      paid: "Paiement reçu",
      preparing: "Emballée avec soin, avec son certificat d’authenticité signé.",
      pickup: "Votre œuvre vous attend à l’atelier. Nous conviendrons d’un moment ensemble.",
    },
    current: "État actuel",
    upcoming: "À venir",
    carrier: "Transporteur",
    trackingNumber: "Numéro de suivi",
    trackPackage: "Suivre le colis →",
    amountPaid: "Payé",
    oneOfOne: "Original · pièce unique",
    shippingTo: "Livraison à",
    questions: "Des questions ?",
    certificate: "Voir le certificat d’authenticité →",
    fromDelara: "— Delara",
    lookupEyebrow: "Votre commande",
    lookupTitle: "Suivre une commande",
    lookupIntro: "Entrez votre numéro de commande et le courriel utilisé lors du paiement.",
    orderNumber: "Numéro de commande",
    email: "Courriel",
    find: "Trouver ma commande →",
    finding: "Recherche…",
    notFound: "Aucune commande ne correspond à ce numéro et à ce courriel. Vérifiez les deux et réessayez.",
    error: "Une erreur s’est produite. Veuillez réessayer.",
    lookupHelp: "Votre numéro de commande figure dans le courriel de confirmation d’achat.",
    needHelp: "Besoin d’aide ?",
  },
  meta: {
    homeTitle: "Delara Ahmadi Darani — Peintures originales et art, Montréal | Delara Art Gallery",
    homeDescription:
      "Peintures originales de l’artiste montréalaise Delara Ahmadi Darani — œuvres abstraites et en techniques mixtes, aquarelles et pastels. Des œuvres uniques à vendre directement de l’atelier, chacune avec un certificat d’authenticité.",
    collectionsTitle: "Collections d’art — Peintures originales de Delara Ahmadi Darani",
    collectionsDescription:
      "Parcourez par collection les peintures originales de l’artiste montréalaise Delara Ahmadi Darani — œuvres abstraites, contemporaines, aquarelles et pastels, chacune unique et accompagnée d’un certificat d’authenticité.",
    collectionDescription: (name, n) =>
      `${name} : ${n} ${n === 1 ? "œuvre originale" : "œuvres originales"} de l’artiste montréalaise Delara Ahmadi Darani, à vendre directement de l’atelier.`,
    privacyTitle: "Politique de confidentialité — Delara Art Gallery",
    privacyDescription: "Les renseignements personnels recueillis par artedelara.com, pourquoi, avec qui ils sont partagés et vos droits.",
    timelineTitle: "Chronologie — Œuvres de Delara Ahmadi Darani",
    timelineDescription:
      "Toutes les œuvres originales de Delara Ahmadi Darani, année après année — suivez l’évolution de son travail à travers les matériaux et les idées.",
    artistTitle: "L’artiste — Delara Ahmadi Darani, peintre à Montréal",
    artistFallback: "À propos de Delara Ahmadi Darani, la peintre montréalaise derrière Delara Art Gallery.",
    visitTitle: "Visiter l’atelier à Montréal — Delara Art Gallery",
    visitDescription:
      "Réservez une visite privée des peintures originales de Delara Ahmadi Darani à Montréal. Visites sur rendez-vous.",
    certificateTitle: (title) => `Certificat d’authenticité — ${title}`,
    orderTitle: "Votre commande — Delara Art Gallery",
    trackTitle: "Suivre une commande — Delara Art Gallery",
    trackDescription: "Consultez l’état de votre commande d’œuvre avec votre numéro de commande et votre courriel.",
    imageAlt: (title, medium) =>
      `${title} — ${medium ? medium.trim().toLowerCase() : "œuvre originale"} de Delara Ahmadi Darani`,
  },
};

const dictionaries = { en, fr };

export function getDictionary(lang) {
  return dictionaries[normalizeLang(lang)];
}
