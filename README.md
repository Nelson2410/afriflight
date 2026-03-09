<div align="center">

# ✈️ AfriFlights

### Le comparateur de vols africain alimenté par l'Intelligence Artificielle

**Trouvez, comparez et réservez vos vols à travers l'Afrique — en quelques clics, dans votre devise locale.**

[![Version](https://img.shields.io/badge/version-1.0.0-orange)](.) [![Licence](https://img.shields.io/badge/licence-MIT-blue)](.) [![Technologie](https://img.shields.io/badge/IA-Gemini%202.0-green)](https://ai.google.dev/)

</div>

---

## 🌍 Qu'est-ce qu'AfriFlights ?

AfriFlights est une **plateforme web de comparaison de vols** spécialement conçue pour les voyageurs africains et ceux à destination du continent africain.

### Le problème que nous résolvons

Aujourd'hui, pour trouver un billet d'avion en Afrique, un voyageur doit :
- Visiter **séparément** les sites d'Ethiopian Airlines, Air Côte d'Ivoire, RwandAir, Kenya Airways, Corsair...
- Comparer **manuellement** les prix sur chacun de ces sites
- Convertir **lui-même** les prix dans sa monnaie locale
- Perdre un temps considérable pour une réservation qui devrait prendre 5 minutes

### Notre solution

AfriFlights centralise tout en **une seule interface**. En entrant votre ville de départ, votre destination et votre date de voyage, notre moteur de recherche propulsé par l'IA **consulte automatiquement** les données de vol en temps réel et vous présente une liste classée des meilleures offres disponibles.

---

## 🎯 Fonctionnalités principales

| Fonctionnalité | Description |
|---|---|
| 🔍 **Recherche intelligente** | Recherche de vols aller simple ou aller-retour à travers toute l'Afrique |
| 💱 **Prix en temps réel** | Les prix sont affichés dans la devise locale de l'utilisateur (détectée automatiquement) |
| 🌐 **Conversion de devise** | Sélecteur de devise intégré avec support de +30 monnaies africaines et internationales |
| 📍 **Géolocalisation** | Détection automatique de la position de l'utilisateur pour afficher sa devise locale |
| 🏢 **Agences de voyage** | Localisation des agences de voyage proches (dans un rayon de 2 km) |
| 🔒 **Réservation sécurisée** | Le bouton "Vérifier et réserver" redirige vers le site officiel de la compagnie aérienne |
| 🔽 **Filtrage par escale** | Filtrez les résultats par vols directs, 1 escale, ou 2 escales et plus |
| 📱 **Responsive** | Interface optimisée pour mobile, tablette et desktop |

---

## 💡 Comment ça fonctionne ?

```
Utilisateur saisit [Origine → Destination + Date]
        ↓
AfriFlights interroge l'IA Gemini + Google Search
        ↓
Les données de vols réels sont récupérées et structurées
        ↓
Résultats affichés avec prix convertis dans la devise locale
        ↓
L'utilisateur clique "Vérifier et réserver" → Redirigé vers le site de la compagnie
```

> ℹ️ **AfriFlights est un comparateur, pas une agence.** Les réservations se font directement sur le site officiel de chaque compagnie aérienne. Nous ne traitons aucun paiement.

---

## 🛠️ Technologies utilisées

| Couche | Technologie |
|---|---|
| **Frontend** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Style** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Build** | [Vite](https://vitejs.dev/) |
| **IA & Recherche** | [Google Gemini 2.0 Flash](https://ai.google.dev/) + Google Search Grounding |
| **Animations** | [Motion (Framer Motion)](https://motion.dev/) |
| **Icônes** | [Lucide React](https://lucide.dev/) |

---

## 🚀 Démarrage rapide (développeurs)

### Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- Une clé API Gemini (obtenir gratuitement sur [Google AI Studio](https://aistudio.google.com/apikey))

### Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/Nelson2410/afriflights.git
cd afriflights

# 2. Installer les dépendances
npm install

# 3. Configurer la clé API
cp .env.example .env
# Ouvrir .env et renseigner votre clé :
# VITE_GEMINI_API_KEY="AIza..."

# 4. Lancer en mode développement
npm run dev
```

L'application est accessible sur **http://localhost:3000/**

### Script de production

```bash
npm run build    # Génère le dossier dist/ optimisé pour la production
npm run preview  # Prévisualisr le build de production
```

---

## 📁 Structure du projet

```
afriflights/
├── src/
│   ├── components/
│   │   ├── SearchForm.tsx      # Formulaire de recherche de vols
│   │   ├── FlightCard.tsx      # Carte d'affichage d'un vol
│   │   ├── AgencyModal.tsx     # Modale des agences de voyage
│   │   ├── HeroSection.tsx     # Section héro de la page d'accueil
│   │   ├── FeaturesSection.tsx # Section des fonctionnalités
│   │   └── Footer.tsx          # Pied de page
│   ├── services/
│   │   ├── flightService.ts    # Moteur de recherche de vols (Gemini + Google Search)
│   │   ├── locationService.ts  # Géolocalisation et agences de voyage
│   │   └── currencyService.ts  # Conversion de devises et liste des monnaies
│   ├── App.tsx                 # Composant racine de l'application
│   └── main.tsx                # Point d'entrée
├── .env.example                # Modèle de configuration d'environnement
└── vite.config.ts              # Configuration Vite
```

---

## 🌐 Déploiement

AfriFlights peut être déployé gratuitement sur [Vercel](https://vercel.com) ou [Netlify](https://netlify.com) :

1. Pousser le code sur GitHub
2. Connecter votre dépôt à Vercel / Netlify
3. Ajouter la variable d'environnement `VITE_GEMINI_API_KEY` dans le tableau de bord
4. Déployer 🚀

---

## 👤 Auteur

**Nelson Bandos**

Ingénieur réseau, créateur et développeur principal de la plateforme AfriFlights.

---

## 📄 Licence

Ce projet est sous licence **MIT** — libre d'utilisation, de modification et de distribution.

---

<div align="center">
  <sub>Fait avec ❤️ pour l'Afrique · © 2026 AfriFlights</sub>
</div>
