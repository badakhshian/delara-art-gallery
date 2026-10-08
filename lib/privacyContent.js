// Text of the privacy policy page (/privacy and /fr/privacy).
// Each section has a heading and paragraphs; a paragraph that is an array is
// shown as a bulleted list.

const CONTACT_EMAIL = "Ahmadi.delara@gmail.com";

export const privacyContent = {
  en: {
    title: "Privacy policy",
    updated: "Last updated: October 8, 2026",
    intro:
      "Delara Art Gallery (artedelara.com) is the studio of the artist Delara Ahmadi Darani. This page explains what personal information the website collects, why, who it is shared with, and the choices you have.",
    sections: [
      {
        heading: "Who is responsible",
        body: [
          `Delara Ahmadi Darani is the person responsible for the protection of personal information collected through this website. You can reach her at ${CONTACT_EMAIL}.`,
        ],
      },
      {
        heading: "What we collect",
        body: [
          [
            "Viewing requests: your name, email address and, if you give them, your phone number, preferred time and message.",
            "Purchases: your name, email address and shipping address, collected through Stripe's secure checkout. Card details are handled by Stripe; we never see or store your full card number.",
            "Visit statistics: anonymous page-view counts through Vercel Web Analytics. It uses no cookies and does not identify you.",
          ],
        ],
      },
      {
        heading: "Why we use it",
        body: [
          [
            "To answer your requests and arrange viewings.",
            "To process, ship and follow up on your order, and to send your receipt and certificate of authenticity.",
            "To keep the records required by law (for example, tax records).",
            "To understand, in general terms, which pages are visited so the website can be improved.",
          ],
          "We do not sell your personal information, and we do not use it for advertising.",
        ],
      },
      {
        heading: "Who we share it with",
        body: [
          "Only with the service providers that run the website, each for its own task:",
          [
            "Stripe — payments and receipts.",
            "Resend — sending emails from the website.",
            "Vercel — website hosting and anonymous visit statistics.",
            "Google (Gmail) — the mailbox where requests and order notices are received.",
          ],
          "Some of these providers store information outside Québec and Canada, for example in the United States. They are required to protect it.",
        ],
      },
      {
        heading: "Cookies",
        body: [
          "This website does not use advertising or tracking cookies. The only cookie it sets is a login cookie for the site's administrator. When you pay, Stripe's checkout page may set its own cookies, as described in Stripe's privacy policy.",
        ],
      },
      {
        heading: "How long we keep it",
        body: [
          "We keep personal information only as long as needed for the purposes above. Order records are kept as long as tax law requires (generally six years in Canada); viewing requests are deleted once they are no longer needed.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          `You can ask to see the personal information we hold about you, to correct it, or to have it deleted when we no longer need to keep it. You can also withdraw your consent at any time. Write to ${CONTACT_EMAIL}; we will reply within 30 days.`,
          "If you are not satisfied with our answer, you can contact the Commission d’accès à l’information du Québec.",
        ],
      },
      {
        heading: "Changes",
        body: ["If this policy changes, the new version will be posted on this page with its date."],
      },
    ],
  },
  fr: {
    title: "Politique de confidentialité",
    updated: "Dernière mise à jour : 8 octobre 2026",
    intro:
      "Delara Art Gallery (artedelara.com) est l’atelier de l’artiste Delara Ahmadi Darani. Cette page explique quels renseignements personnels le site recueille, pourquoi, avec qui ils sont partagés et quels sont vos choix.",
    sections: [
      {
        heading: "Personne responsable",
        body: [
          `Delara Ahmadi Darani est la personne responsable de la protection des renseignements personnels recueillis par ce site. Vous pouvez la joindre à ${CONTACT_EMAIL}.`,
        ],
      },
      {
        heading: "Ce que nous recueillons",
        body: [
          [
            "Demandes de visite : votre nom, votre adresse courriel et, si vous les indiquez, votre numéro de téléphone, le moment souhaité et votre message.",
            "Achats : votre nom, votre adresse courriel et votre adresse de livraison, recueillis par le paiement sécurisé de Stripe. Les données de carte sont traitées par Stripe ; nous ne voyons ni ne conservons jamais votre numéro de carte complet.",
            "Statistiques de visite : un décompte anonyme des pages vues grâce à Vercel Web Analytics. Ce service n’utilise aucun témoin (cookie) et ne vous identifie pas.",
          ],
        ],
      },
      {
        heading: "Pourquoi nous les utilisons",
        body: [
          [
            "Pour répondre à vos demandes et organiser les visites.",
            "Pour traiter, expédier et suivre votre commande, et vous envoyer votre reçu et votre certificat d’authenticité.",
            "Pour conserver les dossiers exigés par la loi (par exemple, les dossiers fiscaux).",
            "Pour savoir, de façon générale, quelles pages sont consultées afin d’améliorer le site.",
          ],
          "Nous ne vendons pas vos renseignements personnels et ne les utilisons pas à des fins publicitaires.",
        ],
      },
      {
        heading: "Avec qui nous les partageons",
        body: [
          "Uniquement avec les fournisseurs de services qui font fonctionner le site, chacun pour sa tâche :",
          [
            "Stripe — paiements et reçus.",
            "Resend — envoi des courriels du site.",
            "Vercel — hébergement du site et statistiques de visite anonymes.",
            "Google (Gmail) — la boîte de réception où arrivent les demandes et les avis de commande.",
          ],
          "Certains de ces fournisseurs conservent les renseignements à l’extérieur du Québec et du Canada, par exemple aux États-Unis. Ils sont tenus de les protéger.",
        ],
      },
      {
        heading: "Témoins (cookies)",
        body: [
          "Ce site n’utilise aucun témoin publicitaire ou de suivi. Le seul témoin qu’il installe est un témoin de connexion pour l’administratrice du site. Au moment du paiement, la page de Stripe peut installer ses propres témoins, comme l’explique la politique de confidentialité de Stripe.",
        ],
      },
      {
        heading: "Durée de conservation",
        body: [
          "Nous conservons les renseignements personnels seulement le temps nécessaire aux fins ci-dessus. Les dossiers de commande sont conservés aussi longtemps que l’exige la loi fiscale (en général six ans au Canada) ; les demandes de visite sont supprimées lorsqu’elles ne sont plus utiles.",
        ],
      },
      {
        heading: "Vos droits",
        body: [
          `Vous pouvez demander à consulter les renseignements personnels que nous détenons à votre sujet, à les faire corriger, ou à les faire supprimer lorsque nous n’avons plus à les conserver. Vous pouvez aussi retirer votre consentement en tout temps. Écrivez à ${CONTACT_EMAIL} ; nous répondrons dans un délai de 30 jours.`,
          "Si notre réponse ne vous satisfait pas, vous pouvez vous adresser à la Commission d’accès à l’information du Québec.",
        ],
      },
      {
        heading: "Modifications",
        body: ["Si cette politique change, la nouvelle version sera publiée sur cette page avec sa date."],
      },
    ],
  },
};
