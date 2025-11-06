"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "fr"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    // Navigation
    features: "Features",
    pricing: "Pricing",
    blog: "Blog",
    faq: "FAQ",
    getStarted: "Get Started",
    proudlyCanadian: "Proudly Canadian",

    // Hero
    heroTitle: "FIND TOP INFLUENCERS",
    heroSubtitle:
      "Looking to discover Canadian social media influencers? Don't hesitate, immerse yourself in the untamed universe of maple syrup aficionados and trailblazers!",
    learnMore: "LEARN MORE",
    requestDemo: "REQUEST A DEMO",

    // Features
    featuresTitle: "Why Choose Plik?",
    featuresSubtitle: "Everything you need to connect with the right Canadian influencers",
    trustedData: "Trusted Data",
    trustedDataDesc: "Access to 3800+ verified Canadian influencers with authentic engagement metrics",
    simplifiedSearch: "Simplified search",
    simplifiedSearchDesc: "Find the perfect influencers with our intuitive search and filtering system",
    seamlessConnections: "Seamless Connections",
    seamlessConnectionsDesc: "Direct contact information and streamlined outreach tools",

    // Blog Section
    blogTitle: "Latest Insights",
    blogSubtitle: "Stay updated with the latest trends in Canadian influencer marketing",
    readMore: "Read More",
    viewAllPosts: "View All Posts",

    // Blog Page Specific Translations
    blogPageTitle: "Influencer Marketing Insights",
    blogPageSubtitle: "Stay ahead with the latest trends, strategies, and insights in Canadian influencer marketing.",
    allPosts: "All Posts",
    featuredArticles: "Featured Articles",
    recentArticles: "Recent Articles",
    minRead: "min read",
    read: "Read",
    stayUpdated: "Stay Updated",

    // Contact Page
    contactTitle: "Contact Us",
    contactSubtitle: "Get in touch with our team for any questions or support",
    getInTouch: "Get in Touch",
    question: "Your Question",
    questionPlaceholder: "Tell us how we can help you...",
    submitContact: "Submit",
    submitting: "Submitting...",
    contactSuccess: "Thank you! Your message has been sent successfully. We'll get back to you soon.",

    // Demo Form Section
    demoTitle: "Request a Demo",
    demoSubtitle: "See how Plik can discover influencers for your marketing strategy",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    company: "Company",
    phone: "Phone",
    message: "Message",
    requestDemoBtn: "Request Demo",
    messageSent: "Thank you! Your message has been sent successfully.",

    // Demo Section
    demoSearchTitle: "Smart Search & Filtering",
    demoSearchDesc: "Filter by location, niche, follower count, engagement rate, and more to find your perfect match",
    demoProfileTitle: "Detailed Influencer Profiles",
    demoProfileDesc:
      "Get comprehensive insights including audience demographics, content performance, and contact information",
    demoOutreachTitle: "Streamlined Outreach",
    demoOutreachDesc:
      "Connect directly with influencers through our integrated messaging and campaign management tools",

    // FAQ Section
    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "Everything you need to know about Plik",
    faqQ1: "How many influencers are in your Canadian database?",
    faqA1:
      "Our database contains over 90,000 verified Canadian influencers and media across all provinces and territories, spanning various niches including lifestyle, tech, fashion, food, and more. We continuously update and verify profiles to ensure data accuracy.",
    faqQ2: "What makes your platform different from others?",
    faqA2:
      "Plik is built specifically for the Canadian market with deep local insights, verified profiles, and real-time engagement metrics. We understand Canadian culture, regulations, and market dynamics better than global platforms.",
    faqQ3: "Do you offer a free trial?",
    faqA3: "No we don't.",
    faqQ4: "How do you verify influencer authenticity?",
    faqA4:
      "We use advanced AI algorithms combined with manual verification to detect fake followers, engagement pods, and bot activity. Our team regularly audits profiles and removes any accounts that don't meet our authenticity standards.",
    faqQ5: "Can I export campaign data and reports?",
    faqA5: "Both plans include data export capabilities in xlsx.",
    faqQ6: "What kind of support do you provide?",
    faqA6:
      "Starter plan users receive email support with 24-hour response time. Professional plan users get priority support plus a dedicated account manager for strategic guidance and platform optimization.",

    // Testimonials
    testimonialsTitle: "What Our Clients Say",
    testimonial1:
      "Plik helped us find the perfect Canadian micro-influencers for our campaign. The ROI was incredible!",
    testimonial1Author: "Sarah Johnson, Marketing Director at Maple Brands",
    testimonial2: "The search functionality is intuitive and the influencer data is incredibly detailed and accurate.",
    testimonial2Author: "Mike Chen, Founder of Northern Digital Agency",
    testimonial3:
      "We've increased our campaign effectiveness by 300% since using Plik to find authentic Canadian voices.",
    testimonial3Author: "Emma Thompson, Brand Manager at Great White North Co.",

    // Pricing
    pricingTitle: "Two Pricing Tiers",
    pricingSubtitle: "Choose the plan that fits your business needs.",
    influencers: "Influencers",
    influencersDesc: "Perfect for small businesses and agencies",
    influencersPrice: "$349",
    influencersAndMedia: "Influencers and media",
    influencersAndMediaDesc: "For growing businesses and marketing teams",
    influencersAndMediaPrice: "$949",
    perYear: "/year",
    mostPopular: "Most Popular",
    startFreeTrial: "Start Free Trial",
    subscribeNow: "Subscribe Now",
    accessInfluencers: "Access to 3800+ verified influencers",
    searchFilters: "4 easy search filters",
    emailSupport: "Email support",
    unlimitedCampaigns: "Unlimited campaigns",
    accessMedia: "Access to 90,000+ verified media + influencers",
    prioritySupport: "Priority support & account manager",

    // Footer
    product: "product",
    company: "Company",
    newsletter: "newsletter",
    about: "about",
    contact: "contact",
    privacy: "privacy",
    newsletterDesc: "Get the latest influencer marketing insights delivered to your inbox weekly.",
    enterEmail: "Enter your email",
    subscribe: "Subscribe",
    footerCopyright: "© 2025 Plik. All rights reserved. Made with ❤️ in Canada.",

    // About Page
    aboutTitle: "Our History",
    aboutSubtitle: "The story of our partnership and commitment to Canadian influencer marketing",
    backToHome: "← Back to Home",
    aboutIntro1:
      "The Club de Presse Blitz has just partnered with Plik, Canada's largest digital influencer directory, enabling its members to more quickly obtain contact information and data for thousands of digital influencers across the country.",
    aboutIntro2:
      "For DataBlitz, which maintains a digital database of over 38,000 contacts across all media, newsrooms, and information platforms in Quebec and Canada, partnering with Plik was a natural choice to provide its members with the best tools to succeed in their marketing strategies.",
    strategicPartnership: "A Strategic Partnership",
    aboutPartnership:
      "Given the popularity of social media and the influence of content creators, its members are increasingly adopting mixed marketing approaches that combine tactics targeting both traditional media and influencers. Now, they can not only quickly create their press lists according to their specific needs via DataBlitz, but they can also complement their marketing strategy by identifying Plik influencers based on their industry sectors, performance, audiences, and several other constantly updated data points.",
    carolineQuote:
      "Influencer campaigns are essential to every company's marketing strategies. For me, there's no doubt that communications specialists must, at one point or another, collaborate with an influential content creator, whether their platform is YouTube, Facebook, Instagram, or Snapchat. Plik's detailed and user-friendly structure will make every publicist's job easier. I'm proud to partner with the DataBlitz media database to offer its members this complementary and essential service in this digital era.",
    carolineAttribution: "— Caroline Cormier, Founder and President of Plik",
    joannQuote:
      "Since its creation 35 years ago by Gérard Grégoire, the Club de Presse Blitz has always evolved with industry trends and the new realities of its members. By partnering with Plik, we're continuing the company's evolution exactly as its founder would have wanted, and we're extremely proud of this. We also strongly believe in Plik's potential and its founder Caroline Cormier, and we're thrilled to offer this additional service to our members.",
    joannAttribution: "— Joann Patenaude, President of The Montréal Office and Owner of DataBlitz",
    ourCompanies: "Our Companies",
    clubDePresse: "Club de Presse Blitz",
    clubDePresseDesc:
      "Founded in Montreal in 1984 by Gérard Grégoire, the Club de Presse Blitz is a media and journalist directory updated daily, comprising over 38,000 contacts referenced in politics, radio, television, print, and digital media.",
    plikCompany: "Plik",
    plikCompanyDesc:
      "The Quebec company Plik lists nearly 4,000 digital influencers in Canada, categorizing them by their platforms, industry sectors, performance, and audiences.",
    explorePlatform: "Explore Our Platform →",
  },
  fr: {
    // Navigation
    features: "Fonctionnalités",
    pricing: "Tarification",
    blog: "Blog",
    faq: "FAQ",
    getStarted: "Commencer",
    proudlyCanadian: "Fièrement Canadien",

    // Hero
    heroTitle: "Repérez les influenceurs incontournables",
    heroSubtitle:
      "Vous cherchez à découvrir des influenceurs canadiens sur les réseaux sociaux? N'hésitez pas, plongez-vous dans l'univers sauvage des aficionados du sirop d'érable et des pionniers!",
    learnMore: "EN SAVOIR PLUS",
    requestDemo: "DEMANDER UNE DÉMO",

    // Features
    featuresTitle: "Pourquoi Choisir Plik?",
    featuresSubtitle: "Tout ce dont vous avez besoin pour vous connecter avec les bons influenceurs canadiens",
    trustedData: "Données Fiables",
    trustedDataDesc:
      "Accès à plus de 3800 influenceurs canadiens vérifiés avec des métriques d'engagement authentiques",
    simplifiedSearch: "Recherche Simplifiée",
    simplifiedSearchDesc: "Trouvez les influenceurs parfaits avec notre système de recherche et de filtrage intuitif",
    seamlessConnections: "Connexions Transparentes",
    seamlessConnectionsDesc: "Informations de contact directes et outils de sensibilisation rationalisés",

    // Blog Section
    blogTitle: "Dernières Perspectives",
    blogSubtitle: "Restez à jour avec les dernières tendances du marketing d'influence canadien",
    readMore: "Lire Plus",
    viewAllPosts: "Voir Tous les Articles",

    // Blog Page Specific Translations
    blogPageTitle: "Perspectives sur le Marketing d'influence",
    blogPageSubtitle:
      "Gardez une longueur d'avance avec les dernières tendances, stratégies et perspectives du marketing d'influence canadien.",
    allPosts: "Tous les Articles",
    featuredArticles: "Articles en Vedette",
    recentArticles: "Articles Récents",
    minRead: "min de lecture",
    read: "Lire",
    stayUpdated: "Restez à Jour",

    // Contact Page
    contactTitle: "Contactez-nous",
    contactSubtitle: "Contactez notre équipe pour toute question ou support",
    getInTouch: "Entrer en Contact",
    question: "Votre Question",
    questionPlaceholder: "Dites-nous comment nous pouvons vous aider...",
    submitContact: "Soumettre",
    submitting: "Envoi en cours...",
    contactSuccess: "Merci! Votre message a été envoyé avec succès. Nous vous répondrons bientôt.",

    // Demo Form Section
    demoTitle: "Demander une Démo",
    demoSubtitle: "Voyez comment Plik peut découvrir des influenceurs pour votre stratégie marketing",
    firstName: "Prénom",
    lastName: "Nom de famille",
    email: "Email",
    company: "Entreprise",
    phone: "Téléphone",
    message: "Message",
    requestDemoBtn: "Demander une Démo",
    messageSent: "Merci! Votre message a été envoyé avec succès.",

    // Demo Section
    demoSearchTitle: "Recherche et Filtrage Intelligents",
    demoSearchDesc:
      "Filtrez par emplacement, niche, nombre d'abonnés, taux d'engagement et plus pour trouver votre match parfait",
    demoProfileTitle: "Profils d'Influenceurs Détaillés",
    demoProfileDesc:
      "Obtenez des insights complets incluant les démographiques d'audience, la performance du contenu et les informations de contact",
    demoOutreachTitle: "Sensibilisation Rationalisée",
    demoOutreachDesc:
      "Connectez-vous directement avec les influenceurs grâce à nos outils intégrés de messagerie et de gestion de campagne",

    // FAQ Section
    faqTitle: "Questions Fréquemment Posées",
    faqSubtitle: "Tout ce que vous devez savoir sur Plik",
    faqQ1: "Combien d'influenceurs avez-vous dans votre base de données canadienne?",
    faqA1:
      "Notre base de données contient plus de 90 000 influenceurs et médias canadiens vérifiés dans toutes les provinces et territoires, couvrant diverses niches incluant le style de vie, la technologie, la mode, la nourriture et plus encore. Nous mettons continuellement à jour et vérifions les profils pour assurer la précision des données.",
    faqQ2: "Qu'est-ce qui rend votre plateforme différente des autres?",
    faqA2:
      "Plik est conçu spécifiquement pour le marché canadien avec des insights locaux approfondis, des profils vérifiés et des métriques d'engagement en temps réel. Nous comprenons mieux la culture canadienne, les réglementations et la dynamique du marché que les plateformes mondiales.",
    faqQ3: "Offrez-vous un essai gratuit?",
    faqA3: "Non, nous n'en offrons pas.",
    faqQ4: "Comment vérifiez-vous l'authenticité des influenceurs?",
    faqA4:
      "Nous utilisons des algorithmes d'IA avancés combinés à une vérification manuelle pour détecter les faux abonnés, les groupes d'engagement et l'activité de bots. Notre équipe audite régulièrement les profils et supprime tout compte qui ne répond pas à nos standards d'authenticité.",
    faqQ5: "Puis-je exporter les données de campagne et les rapports?",
    faqA5: "Les deux plans incluent des capacités d'exportation de données en format xlsx.",
    faqQ6: "Quel type de support fournissez-vous?",
    faqA6:
      "Les utilisateurs du plan Starter reçoivent un support par email avec un temps de réponse de 24 heures. Les utilisateurs du plan Professionnel obtiennent un support prioritaire plus un gestionnaire de compte dédié pour des conseils stratégiques et l'optimisation de la plateforme.",

    // Testimonials
    testimonialsTitle: "Ce Que Disent Nos Clients",
    testimonial1:
      "Plik nous a aidés à trouver les micro-influenceurs canadiens parfaits pour notre campagne. Le ROI était incroyable!",
    testimonial1Author: "Sarah Johnson, Directrice Marketing chez Maple Brands",
    testimonial2:
      "La fonctionnalité de recherche est intuitive et les données d'influenceurs sont incroyablement détaillées et précises.",
    testimonial2Author: "Mike Chen, Fondateur de Northern Digital Agency",
    testimonial3:
      "Nous avons augmenté l'efficacité de nos campagnes de 300% depuis que nous utilisons Plik pour trouver des voix canadiennes authentiques.",
    testimonial3Author: "Emma Thompson, Gestionnaire de Marque chez Great White North Co.",

    // Pricing
    pricingTitle: "Deux Types d'abonnement",
    pricingSubtitle: "Choisissez le plan qui correspond aux besoins de votre entreprise.",
    influencers: "Influenceurs",
    influencersDesc: "Parfait pour les petites entreprises et agences",
    influencersPrice: "349$",
    influencersAndMedia: "Influenceurs et médias",
    influencersAndMediaDesc: "Pour les entreprises en croissance et les équipes marketing",
    influencersAndMediaPrice: "949$",
    perYear: "/an",
    mostPopular: "Le Plus Populaire",
    startFreeTrial: "Commencer l'Essai Gratuit",
    subscribeNow: "S'abonner Maintenant",
    accessInfluencers: "Accès à 3800+ influenceurs vérifiés",
    searchFilters: "4 filtres de recherche faciles",
    emailSupport: "Support par email",
    unlimitedCampaigns: "Campagnes illimitées",
    accessMedia: "Accès à 90 000+ médias + influenceurs vérifiés",
    prioritySupport: "Support prioritaire et gestionnaire de compte",

    // Footer
    product: "produit",
    company: "Entreprise",
    newsletter: "infolettre",
    about: "à propos",
    contact: "contact",
    privacy: "confidentialité",
    newsletterDesc:
      "Recevez les dernières perspectives du marketing d'influence dans votre boîte de réception chaque semaine.",
    enterEmail: "Entrez votre email",
    subscribe: "S'abonner",
    footerCopyright: "© 2025 Plik. Tous droits réservés. Fait avec ❤️ au Canada.",

    // About Page
    aboutTitle: "Notre Histoire",
    aboutSubtitle: "L'histoire de notre partenariat et notre engagement envers le marketing d'influence canadien",
    backToHome: "← Retour à l'accueil",
    aboutIntro1:
      "Le Club de Presse Blitz vient de s'associer avec Plik, le plus grand répertoire d'influenceurs numériques du Canada, permettant à ses membres d'obtenir plus rapidement les coordonnées et les données de milliers d'influenceurs numériques à travers le pays.",
    aboutIntro2:
      "Pour DataBlitz, qui maintient une base de données numérique de plus de 38 000 contacts à travers tous les médias, salles de rédaction et plateformes d'information au Québec et au Canada, s'associer avec Plik était un choix naturel pour fournir à ses membres les meilleurs outils pour réussir dans leurs stratégies marketing.",
    strategicPartnership: "Un Partenariat Stratégique",
    aboutPartnership:
      "Compte tenu de la popularité des médias sociaux et de l'influence des créateurs de contenu, ses membres adoptent de plus en plus des approches marketing mixtes qui combinent des tactiques ciblant à la fois les médias traditionnels et les influenceurs. Maintenant, ils peuvent non seulement créer rapidement leurs listes de presse selon leurs besoins spécifiques via DataBlitz, mais ils peuvent aussi compléter leur stratégie marketing en identifiant les influenceurs Plik basés sur leurs secteurs d'industrie, performance, audiences et plusieurs autres points de données constamment mis à jour.",
    carolineQuote:
      "Les campagnes d'influenceurs sont essentielles aux stratégies marketing de chaque entreprise. Pour moi, il ne fait aucun doute que les spécialistes en communications doivent, à un moment ou à un autre, collaborer avec un créateur de contenu influent, que sa plateforme soit YouTube, Facebook, Instagram ou Snapchat. La structure détaillée et conviviale de Plik facilitera le travail de chaque publiciste. Je suis fière de m'associer avec la base de données médias DataBlitz pour offrir à ses membres ce service complémentaire et essentiel à cette ère numérique.",
    carolineAttribution: "— Caroline Cormier, Fondatrice et Présidente de Plik",
    joannQuote:
      "Depuis sa création il y a 35 ans par Gérard Grégoire, le Club de Presse Blitz a toujours évolué avec les tendances de l'industrie et les nouvelles réalités de ses membres. En s'associant avec Plik, nous continuons l'évolution de l'entreprise exactement comme son fondateur l'aurait voulu, et nous en sommes extrêmement fiers. Nous croyons aussi fermement au potentiel de Plik et à sa fondatrice Caroline Cormier, et nous sommes ravis d'offrir ce service supplémentaire à nos membres.",
    joannAttribution: "— Joann Patenaude, Présidente du Bureau de Montréal et Propriétaire de DataBlitz",
    ourCompanies: "Nos Entreprises",
    clubDePresse: "Club de Presse Blitz",
    clubDePresseDesc:
      "Fondé à Montréal en 1984 par Gérard Grégoire, le Club de Presse Blitz est un répertoire de médias et journalistes mis à jour quotidiennement, comprenant plus de 38 000 contacts référencés en politique, radio, télévision, presse écrite et médias numériques.",
    plikCompany: "Plik",
    plikCompanyDesc:
      "L'entreprise québécoise Plik répertorie près de 4 000 influenceurs numériques au Canada, les catégorisant par leurs plateformes, secteurs d'industrie, performance et audiences.",
    explorePlatform: "Explorez Notre Plateforme →",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "fr")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["en"]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
