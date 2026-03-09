/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Timer, 
  ChevronDown, 
  Search, 
  RotateCcw, 
  Play, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  Award,
  Volume2,
  VolumeX,
  Globe,
  Zap,
  Calendar,
  Map as MapIcon,
  Info,
  Star,
  ChevronRight,
  History,
  Settings,
  Moon,
  Sun,
  Trash2,
  Flame
} from 'lucide-react';
import { COUNTRIES, Country } from './countries';

const TIER_THRESHOLDS = [0, 5, 15, 30]; // Correct answers needed to reach next tier
const INITIAL_TIMER = 15;
const TIMER_DECREMENT = 0.5;
const MIN_TIMER = 5;

const SOUNDS = {
  correct: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  incorrect: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  tick: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
};

const UNLOCK_MAP: Record<number, string> = {
  3: 'US-State',
  5: 'World-Capitals',
  7: 'India-State',
  10: 'Danish-Kommune',
  12: 'Swedish-Lan',
  15: 'German-County',
  18: 'Swiss-Canton',
  20: 'Commonwealth'
};

const TRANSLATIONS: Record<string, any> = {
  en: {
    title: 'GLOBAL EXPEDITION',
    subtitle: 'Master the world\'s flags through progressive challenges and timed trials.',
    chooseMode: 'Choose Mode',
    settings: 'Settings',
    achievements: 'Stats and Achievements',
    dailyChallenge: 'Daily Challenge',
    selectMode: 'SELECT MODE',
    howToPlay: 'How do you want to play today?',
    backToMenu: 'Back to Menu',
    identifyFlag: 'Identify this flag',
    identifyCapital: 'Identify this Capital',
    identifyLanguage: 'Identify this Language',
    searchPlaceholder: 'Search country...',
    score: 'Score',
    best: 'Best',
    level: 'Lvl',
    classic: 'Classic',
    timeAttack: 'Time Attack',
    zen: 'Zen',
    daily: 'Daily',
    relaxed: 'Relaxed',
    standard: 'Standard',
    hardcore: 'Hardcore',
    timerSpeed: 'Timer Speed',
    soundEffects: 'Sound Effects',
    language: 'Language',
    darkMode: 'Dark Mode',
    saveAndExit: 'Save & Exit',
    populationMode: 'Population Duel',
    popSubtitle: 'Who has the higher population?',
    higher: 'Higher',
    lower: 'Lower',
    didYouKnow: 'Did you know?',
    gameOver: 'GAME OVER',
    finalScore: 'Final Score',
    streak: 'Streak',
    playAgain: 'Play Again',
    selectCategory: 'Select Category',
    nationalFlags: 'National Flags',
    usStates: 'US States',
    worldCapitals: 'World Capitals',
    indianStates: 'Indian States',
    danishKommune: 'Danish Kommune',
    swedishLan: 'Swedish Län',
    germanCounties: 'German Counties',
    swissCantons: 'Swiss Cantons',
    commonwealth: 'Commonwealth',
    languageGuess: 'Language Guess',
    customMode: 'Custom Mode',
    createCustom: 'Create Custom Mode',
    modeName: 'Mode Name',
    selectRegion: 'Select Region',
    timerSettings: 'Timer (seconds)',
    saveMode: 'Save Mode',
    myModes: 'My Custom Modes',
    delete: 'Delete',
    levelRequired: 'Level {lvl} Required',
    nextLevelAt: '{xp} XP to next level',
    locked: 'Locked',
    personalBests: 'Personal Bests',
    backToCategories: 'Back to Categories',
    filterNationalFlags: 'Filter national flags by continent',
    chooseCategory: 'Choose which flags you want to master',
    capitalToFlag: 'Capital to Flag',
    silhouetteChallenge: 'Silhouette Challenge',
    continentSprint: 'Continent Sprint',
    identifyByCapital: 'Identify country by its capital',
    identifySilhouette: 'Identify country by its silhouette',
    sprintSubtitle: '30 seconds continent challenge'
  },
  da: {
    title: 'GLOBAL EKSPEDITION',
    subtitle: 'Mestrer verdens flag gennem progressive udfordringer og tidsbegrænsede forsøg.',
    chooseMode: 'Vælg Tilstand',
    settings: 'Indstillinger',
    achievements: 'Statistik og Præstationer',
    dailyChallenge: 'Daglig Udfordring',
    selectMode: 'VÆLG TILSTAND',
    howToPlay: 'Hvordan vil du spille i dag?',
    backToMenu: 'Tilbage til Menu',
    identifyFlag: 'Identificer dette flag',
    identifyCapital: 'Identificer denne hovedstad',
    identifyLanguage: 'Identificer dette sprog',
    searchPlaceholder: 'Søg land...',
    score: 'Point',
    best: 'Bedste',
    level: 'Niveau',
    classic: 'Klassisk',
    timeAttack: 'Tidsangreb',
    zen: 'Zen',
    daily: 'Daglig',
    relaxed: 'Afslappet',
    standard: 'Standard',
    hardcore: 'Hardcore',
    timerSpeed: 'Timer Hastighed',
    soundEffects: 'Lydeffekter',
    language: 'Sprog',
    darkMode: 'Mørk Tilstand',
    saveAndExit: 'Gem og Afslut',
    populationMode: 'Befolkningsduel',
    popSubtitle: 'Hvem har den højeste befolkning?',
    higher: 'Højere',
    lower: 'Lavere',
    didYouKnow: 'Vidste du det?',
    gameOver: 'SPIL SLUT',
    finalScore: 'Endelig Score',
    streak: 'Stribe',
    playAgain: 'Spil Igen',
    selectCategory: 'Vælg Kategori',
    nationalFlags: 'Nationale Flag',
    usStates: 'USA Stater',
    worldCapitals: 'Verdens Hovedstæder',
    indianStates: 'Indiske Stater',
    danishKommune: 'Danske Kommuner',
    swedishLan: 'Svenske Län',
    germanCounties: 'Tyske Amter',
    swissCantons: 'Schweiziske Kantoner',
    commonwealth: 'Commonwealth',
    languageGuess: 'Gæt Sproget',
    customMode: 'Brugerdefineret',
    createCustom: 'Opret Tilstand',
    modeName: 'Navn',
    selectRegion: 'Vælg Region',
    timerSettings: 'Timer (sekunder)',
    saveMode: 'Gem Tilstand',
    myModes: 'Mine Tilstande',
    delete: 'Slet',
    levelRequired: 'Niveau {lvl} Påkrævet',
    nextLevelAt: '{xp} XP til næste niveau',
    locked: 'Låst',
    personalBests: 'Personlige Rekorder',
    backToCategories: 'Tilbage til Kategorier',
    filterNationalFlags: 'Filtrer nationale flag efter kontinent',
    chooseCategory: 'Vælg hvilke flag du vil mestre',
    capitalToFlag: 'Hovedstad til Flag',
    silhouetteChallenge: 'Silhuet Udfordring',
    continentSprint: 'Kontinent Sprint',
    identifyByCapital: 'Identificer land ud fra hovedstad',
    identifySilhouette: 'Identificer land ud fra silhuet',
    sprintSubtitle: '30 sekunders kontinent udfordring'
  },
  sv: {
    title: 'GLOBAL EXPEDITION',
    subtitle: 'Mästra världens flaggor genom progressiva utmaningar.',
    chooseMode: 'Välj Läge',
    settings: 'Inställningar',
    achievements: 'Statistik och Prestationer',
    dailyChallenge: 'Daglig Utmaning',
    selectMode: 'VÄLJ LÄGE',
    howToPlay: 'Hur vill du spela idag?',
    backToMenu: 'Tillbaka till Meny',
    identifyFlag: 'Identifiera denna flagga',
    identifyCapital: 'Identifiera denna huvudstad',
    identifyLanguage: 'Identifiera detta språk',
    searchPlaceholder: 'Sök land...',
    score: 'Poäng',
    best: 'Bästa',
    level: 'Nivå',
    classic: 'Klassisk',
    timeAttack: 'Tidsattack',
    zen: 'Zen',
    daily: 'Daglig',
    relaxed: 'Avslappnad',
    standard: 'Standard',
    hardcore: 'Hardcore',
    timerSpeed: 'Timerhastighet',
    soundEffects: 'Ljudeffekter',
    language: 'Språk',
    darkMode: 'Mörkt Läge',
    saveAndExit: 'Spara & Avsluta',
    populationMode: 'Befolkningsduell',
    popSubtitle: 'Vem har högst befolkning?',
    higher: 'Högre',
    lower: 'Lägre',
    didYouKnow: 'Visste du att?',
    gameOver: 'SPELET SLUT',
    finalScore: 'Slutpoäng',
    streak: 'Svit',
    playAgain: 'Spela Igen',
    selectCategory: 'Välj Kategori',
    nationalFlags: 'Nationella Flaggor',
    usStates: 'USA-stater',
    worldCapitals: 'Världens Huvudstäder',
    indianStates: 'Indiska Stater',
    danishKommune: 'Danska Kommuner',
    swedishLan: 'Svenska Län',
    germanCounties: 'Tyska Län',
    swissCantons: 'Schweiziska Kantoner',
    commonwealth: 'Samväldet',
    languageGuess: 'Gissa Språket',
    customMode: 'Anpassad',
    createCustom: 'Skapa Läge',
    modeName: 'Namn',
    selectRegion: 'Välj Region',
    timerSettings: 'Timer (sekunder)',
    saveMode: 'Spara Läge',
    myModes: 'Mina Lägen',
    delete: 'Radera',
    levelRequired: 'Nivå {lvl} Krävs',
    nextLevelAt: '{xp} XP till nästa nivå',
    locked: 'Låst',
    personalBests: 'Personliga Rekord',
    backToCategories: 'Tillbaka till Kategorier',
    filterNationalFlags: 'Filtrera nationella flaggor efter kontinent',
    chooseCategory: 'Välj vilka flaggor du vill bemästra'
  },
  de: {
    title: 'GLOBALE EXPEDITION',
    subtitle: 'Meistern Sie die Flaggen der Welt durch Herausforderungen.',
    chooseMode: 'Modus wählen',
    settings: 'Einstellungen',
    achievements: 'Statistiken & Erfolge',
    dailyChallenge: 'Tägliche Herausforderung',
    selectMode: 'MODUS WÄHLEN',
    howToPlay: 'Wie möchten Sie heute spielen?',
    backToMenu: 'Zurück zum Menü',
    identifyFlag: 'Identifizieren Sie diese Flagge',
    identifyCapital: 'Identifizieren Sie diese Hauptstadt',
    identifyLanguage: 'Identifizieren Sie diese Sprache',
    searchPlaceholder: 'Land suchen...',
    score: 'Punktzahl',
    best: 'Bestleistung',
    level: 'Lvl',
    classic: 'Klassisch',
    timeAttack: 'Zeitangriff',
    zen: 'Zen',
    daily: 'Täglich',
    relaxed: 'Entspannt',
    standard: 'Standard',
    hardcore: 'Hardcore',
    timerSpeed: 'Timer-Geschwindigkeit',
    soundEffects: 'Soundeffekte',
    language: 'Sprache',
    darkMode: 'Dunkelmodus',
    saveAndExit: 'Speichern & Beenden',
    populationMode: 'Bevölkerungsduell',
    popSubtitle: 'Wer hat die höhere Bevölkerung?',
    higher: 'Höher',
    lower: 'Niedriger',
    didYouKnow: 'Wussten Sie schon?',
    gameOver: 'SPIEL VORBEI',
    finalScore: 'Endstand',
    streak: 'Serie',
    playAgain: 'Nochmal spielen',
    selectCategory: 'Kategorie wählen',
    nationalFlags: 'Nationalflaggen',
    usStates: 'US-Bundesstaaten',
    worldCapitals: 'Welthauptstädte',
    indianStates: 'Indische Bundesstaaten',
    danishKommune: 'Dänische Kommunen',
    swedishLan: 'Schwedische Provinzen',
    germanCounties: 'Deutsche Landkreise',
    swissCantons: 'Schweizer Kantone',
    commonwealth: 'Commonwealth',
    languageGuess: 'Sprache erraten',
    customMode: 'Benutzerdefiniert',
    createCustom: 'Modus erstellen',
    modeName: 'Name',
    selectRegion: 'Region wählen',
    timerSettings: 'Timer (Sekunden)',
    saveMode: 'Modus speichern',
    myModes: 'Meine Modi',
    delete: 'Löschen',
    levelRequired: 'Level {lvl} erforderlich',
    nextLevelAt: '{xp} XP bis zum nächsten Level',
    locked: 'Gesperrt',
    personalBests: 'Persönliche Bestleistungen',
    backToCategories: 'Zurück zu den Kategorien',
    filterNationalFlags: 'Nationalflaggen nach Kontinent filtern',
    chooseCategory: 'Wählen Sie die Flaggen aus, die Sie meistern möchten'
  },
  fr: {
    title: 'EXPÉDITION GLOBALE',
    subtitle: 'Maîtrisez les drapeaux du monde via des défis progressifs.',
    chooseMode: 'Choisir le mode',
    settings: 'Paramètres',
    achievements: 'Stats et Succès',
    dailyChallenge: 'Défi Quotidien',
    selectMode: 'SÉLECTIONNER LE MODE',
    howToPlay: 'Comment voulez-vous jouer aujourd\'hui ?',
    backToMenu: 'Retour au menu',
    identifyFlag: 'Identifiez ce drapeau',
    identifyCapital: 'Identifiez cette capitale',
    identifyLanguage: 'Identifiez cette langue',
    searchPlaceholder: 'Rechercher un pays...',
    score: 'Score',
    best: 'Meilleur',
    level: 'Niv',
    classic: 'Classique',
    timeAttack: 'Contre-la-montre',
    zen: 'Zen',
    daily: 'Quotidien',
    relaxed: 'Relaxé',
    standard: 'Standard',
    hardcore: 'Difficile',
    timerSpeed: 'Vitesse du minuteur',
    soundEffects: 'Effets sonores',
    language: 'Langue',
    darkMode: 'Mode Sombre',
    saveAndExit: 'Enregistrer & Quitter',
    populationMode: 'Duel de Population',
    popSubtitle: 'Qui a la plus grande population ?',
    higher: 'Plus haut',
    lower: 'Plus bas',
    didYouKnow: 'Le saviez-vous ?',
    gameOver: 'PARTIE TERMINÉE',
    finalScore: 'Score Final',
    streak: 'Série',
    playAgain: 'Rejouer',
    selectCategory: 'Choisir la catégorie',
    nationalFlags: 'Drapeaux Nationaux',
    usStates: 'États des USA',
    worldCapitals: 'Capitales du Monde',
    indianStates: 'États de l\'Inde',
    danishKommune: 'Communes Danoises',
    swedishLan: 'Provinces Suédoises',
    germanCounties: 'Arrondissements Allemands',
    swissCantons: 'Cantons Suisses',
    commonwealth: 'Commonwealth',
    languageGuess: 'Deviner la Langue',
    customMode: 'Personnalisé',
    createCustom: 'Créer un mode',
    modeName: 'Nom',
    selectRegion: 'Choisir la région',
    timerSettings: 'Minuteur (secondes)',
    saveMode: 'Enregistrer le mode',
    myModes: 'Mes modes',
    delete: 'Supprimer',
    levelRequired: 'Niveau {lvl} Requis',
    nextLevelAt: '{xp} XP avant le prochain niveau',
    locked: 'Verrouillé',
    personalBests: 'Records Personnels',
    backToCategories: 'Retour aux Catégories',
    filterNationalFlags: 'Filtrer les drapeaux nationaux par continent',
    chooseCategory: 'Choisissez les drapeaux que vous voulez maîtriser'
  },
  es: {
    title: 'EXPEDICIÓN GLOBAL',
    subtitle: 'Domina las banderas del mundo mediante desafíos progresivos.',
    chooseMode: 'Elegir modo',
    settings: 'Ajustes',
    achievements: 'Estadísticas y Logros',
    dailyChallenge: 'Desafío Diario',
    selectMode: 'SELECCIONAR MODO',
    howToPlay: '¿Cómo quieres jugar hoy?',
    backToMenu: 'Volver al menú',
    identifyFlag: 'Identifica esta bandera',
    identifyCapital: 'Identifica esta capital',
    identifyLanguage: 'Identifica este idioma',
    searchPlaceholder: 'Buscar país...',
    score: 'Puntuación',
    best: 'Mejor',
    level: 'Niv',
    classic: 'Clásico',
    timeAttack: 'Ataque de tiempo',
    zen: 'Zen',
    daily: 'Diario',
    relaxed: 'Relajado',
    standard: 'Estándar',
    hardcore: 'Difícil',
    timerSpeed: 'Velocidad del temporizador',
    soundEffects: 'Efectos de sonido',
    language: 'Idioma',
    darkMode: 'Modo Oscuro',
    saveAndExit: 'Guardar y Salir',
    populationMode: 'Duelo de Población',
    popSubtitle: '¿Quién tiene la mayor población?',
    higher: 'Más alto',
    lower: 'Más bajo',
    didYouKnow: '¿Sabías que?',
    gameOver: 'FIN DEL JUEGO',
    finalScore: 'Puntuación Final',
    streak: 'Racha',
    playAgain: 'Jugar de nuevo',
    selectCategory: 'Elegir categoría',
    nationalFlags: 'Banderas Nacionales',
    usStates: 'Estados de EE.UU.',
    worldCapitals: 'Capitales del Mundo',
    indianStates: 'Estados de India',
    danishKommune: 'Municipios Daneses',
    swedishLan: 'Provincias Suecas',
    germanCounties: 'Distritos Alemanes',
    swissCantons: 'Cantones Suizos',
    commonwealth: 'Commonwealth',
    languageGuess: 'Adivinar el Idioma',
    customMode: 'Personalizado',
    createCustom: 'Crear modo',
    modeName: 'Nombre',
    selectRegion: 'Elegir región',
    timerSettings: 'Temporizador (segundos)',
    saveMode: 'Guardar modo',
    myModes: 'Mis modos',
    delete: 'Eliminar',
    levelRequired: 'Nivel {lvl} Requerido',
    nextLevelAt: '{xp} XP para el siguiente nivel',
    locked: 'Bloqueado',
    personalBests: 'Mejores Marcas',
    backToCategories: 'Volver a Categorías',
    filterNationalFlags: 'Filtrar banderas nacionales por continente',
    chooseCategory: 'Elige qué banderas quieres dominar'
  },
  it: {
    title: 'SPEDIZIONE GLOBALE',
    subtitle: 'Domina le bandiere del mondo attraverso sfide progressive.',
    chooseMode: 'Scegli modalità',
    settings: 'Impostazioni',
    achievements: 'Statistiche e Traguardi',
    dailyChallenge: 'Sfida Giornaliera',
    selectMode: 'SELEZIONA MODALITÀ',
    howToPlay: 'Come vuoi giocare oggi?',
    backToMenu: 'Torna al menu',
    identifyFlag: 'Identifica questa bandiera',
    identifyCapital: 'Identifica questa capitale',
    identifyLanguage: 'Identifica questa lingua',
    searchPlaceholder: 'Cerca paese...',
    score: 'Punteggio',
    best: 'Migliore',
    level: 'Liv',
    classic: 'Classico',
    timeAttack: 'Attacco al tempo',
    zen: 'Zen',
    daily: 'Giornaliero',
    relaxed: 'Rilassato',
    standard: 'Standard',
    hardcore: 'Difficile',
    timerSpeed: 'Velocità timer',
    soundEffects: 'Effetti sonori',
    language: 'Lingua',
    darkMode: 'Modalità Scura',
    saveAndExit: 'Salva ed Esci',
    populationMode: 'Duello di Popolazione',
    popSubtitle: 'Chi ha la popolazione più alta?',
    higher: 'Più alto',
    lower: 'Più basso',
    didYouKnow: 'Lo sapevi?',
    gameOver: 'GIOCO FINITO',
    finalScore: 'Punteggio Finale',
    streak: 'Serie',
    playAgain: 'Gioca ancora',
    selectCategory: 'Scegli categoria',
    nationalFlags: 'Bandiere Nazionali',
    usStates: 'Stati USA',
    worldCapitals: 'Capitali del Mondo',
    indianStates: 'Stati Indiani',
    danishKommune: 'Comuni Danesi',
    swedishLan: 'Province Svedesi',
    germanCounties: 'Distretti Tedeschi',
    swissCantons: 'Cantoni Svizzeri',
    commonwealth: 'Commonwealth',
    languageGuess: 'Indovina la Lingua',
    customMode: 'Personalizzato',
    createCustom: 'Crea modalità',
    modeName: 'Nome',
    selectRegion: 'Scegli regione',
    timerSettings: 'Timer (secondi)',
    saveMode: 'Salva modalità',
    myModes: 'Le mie modalità',
    delete: 'Elimina',
    levelRequired: 'Livello {lvl} Richiesto',
    nextLevelAt: '{xp} XP al prossimo livello',
    locked: 'Bloccato',
    personalBests: 'Record Personali',
    backToCategories: 'Torna alle Categorie',
    filterNationalFlags: 'Filtra le bandiere nazionali per continente',
    chooseCategory: 'Scegli quali bandiere vuoi padroneggiare'
  },
  pt: {
    title: 'EXPEDIÇÃO GLOBAL',
    subtitle: 'Domine as bandeiras do mundo através de desafios progressivos.',
    chooseMode: 'Escolher modo',
    settings: 'Definições',
    achievements: 'Estatísticas e Conquistas',
    dailyChallenge: 'Desafio Diário',
    selectMode: 'SELECIONAR MODO',
    howToPlay: 'Como quer jogar hoje?',
    backToMenu: 'Voltar ao menu',
    identifyFlag: 'Identifique esta bandeira',
    identifyCapital: 'Identifique esta capital',
    identifyLanguage: 'Identifique este idioma',
    searchPlaceholder: 'Procurar país...',
    score: 'Pontuação',
    best: 'Melhor',
    level: 'Nív',
    classic: 'Clássico',
    timeAttack: 'Ataque de tempo',
    zen: 'Zen',
    daily: 'Diário',
    relaxed: 'Relaxado',
    standard: 'Padrão',
    hardcore: 'Difícil',
    timerSpeed: 'Velocidade do temporizador',
    soundEffects: 'Efeitos sonoros',
    language: 'Idioma',
    darkMode: 'Modo Escuro',
    saveAndExit: 'Guardar e Sair',
    populationMode: 'Duelo de População',
    popSubtitle: 'Quem tem a maior população?',
    higher: 'Mais alto',
    lower: 'Mais baixo',
    didYouKnow: 'Sabia que?',
    gameOver: 'FIM DO JOGO',
    finalScore: 'Pontuação Final',
    streak: 'Sequência',
    playAgain: 'Jogar novamente',
    selectCategory: 'Escolher categoria',
    nationalFlags: 'Bandeiras Nacionais',
    usStates: 'Estados dos EUA',
    worldCapitals: 'Capitais do Mundo',
    indianStates: 'Estados da Índia',
    danishKommune: 'Municípios Dinamarqueses',
    swedishLan: 'Províncias Suecas',
    germanCounties: 'Distritos Alemães',
    swissCantons: 'Cantões Suíços',
    commonwealth: 'Commonwealth',
    languageGuess: 'Adivinhar o Idioma',
    customMode: 'Personalizado',
    createCustom: 'Criar modo',
    modeName: 'Nome',
    selectRegion: 'Escolher região',
    timerSettings: 'Temporizador (segundos)',
    saveMode: 'Guardar modo',
    myModes: 'Meus modos',
    delete: 'Eliminar',
    levelRequired: 'Nível {lvl} Necessário',
    nextLevelAt: '{xp} XP para o próximo nível',
    locked: 'Bloqueado',
    personalBests: 'Recordes Pessoais',
    backToCategories: 'Voltar às Categorias',
    filterNationalFlags: 'Filtrar bandeiras nacionais por continente',
    chooseCategory: 'Escolha quais bandeiras você quer dominar'
  },
};

const ACHIEVEMENT_LIST = [
  { id: 'expert', title: 'Flag Expert', desc: 'Score 20+ in a single run', icon: <Trophy /> },
  { id: 'veteran', title: 'World Veteran', desc: 'Reach Level 10', icon: <Award /> },
  { id: 'streak_master', title: 'Streak Master', desc: '10 correct answers in a row', icon: <Flame className="text-orange-500" /> },
  { id: 'speed', title: 'Speedster', desc: 'Play Time Attack mode', icon: <Zap /> },
  { id: 'globetrotter', title: 'Globetrotter', desc: 'Play 5 games', icon: <Globe /> },
  { id: 'world_traveler', title: 'World Traveler', desc: 'Play 25 games', icon: <MapIcon /> },
  { id: 'historian', title: 'Flag Historian', desc: 'Guess 100 flags total', icon: <History /> },
  { id: 'cartographer', title: 'Master Cartographer', desc: 'Guess 500 flags total', icon: <MapIcon /> },
  { id: 'quick_thinker', title: 'Quick Thinker', desc: 'Score 10 in Time Attack', icon: <Timer /> },
  { id: 'lightning', title: 'Lightning Reflexes', desc: 'Score 30 in Time Attack', icon: <Zap className="text-yellow-500" /> },
  { id: 'polyglot', title: 'Polyglot', desc: 'Score 10 in Language Guess', icon: <Volume2 /> },
  { id: 'statesman', title: 'Statesman', desc: 'Score 10 in US States', icon: <Star /> },
  { id: 'capitalist', title: 'Capitalist', desc: 'Score 10 in World Capitals', icon: <Award className="text-blue-500" /> },
  { id: 'streak_50', title: 'Perfect Century', desc: '50 correct answers in a row', icon: <Flame className="text-red-500" /> },
  { id: 'night_owl', title: 'Night Owl', desc: 'Play after midnight', icon: <Moon />, secret: true },
  { id: 'early_bird', title: 'Early Bird', desc: 'Play before 6 AM', icon: <Sun />, secret: true },
  { id: 'zen_master', title: 'Zen Master', desc: 'Find peace in Zen mode', icon: <Info />, secret: true },
  { id: 'danish_dynamite', title: 'Danish Dynamite', desc: 'Score 10 in Danish Kommune', icon: <Star className="text-red-500" />, secret: true },
  { id: 'swiss_precision', title: 'Swiss Precision', desc: 'Score 10 in Swiss Cantons', icon: <CheckCircle2 className="text-red-600" />, secret: true }
];

const FlagImage = ({ country, themeColors, isSilhouette }: { country: Country, themeColors: any, isSilhouette?: boolean }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [src, setSrc] = useState<string>('');

  useEffect(() => {
    setIsLoaded(false);
    let newSrc = '';
    if (isSilhouette) {
      // Use a more reliable source for country silhouettes (SVG maps)
      newSrc = `https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${country.code.toLowerCase()}/vector.svg`;
    } else {
      newSrc = country.category === 'National' || country.category === 'US-State' 
        ? `https://flagcdn.com/w640/${country.code}.png`
        : country.imageUrl || `https://picsum.photos/seed/${country.code}/640/426`;
    }
    
    const img = new Image();
    img.src = newSrc;
    img.onload = () => {
      setSrc(newSrc);
      setIsLoaded(true);
    };
    img.onerror = () => {
      // Fallback for silhouette if SVG fails
      if (isSilhouette) {
        setSrc(`https://flagcdn.com/w640/${country.code}.png`);
      }
      setIsLoaded(true);
    };
  }, [country.code, country.imageUrl, isSilhouette]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-white/5 p-4">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-12 h-12 border-4 ${themeColors.border} border-t-transparent rounded-full animate-spin opacity-20`} />
        </div>
      )}
      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          className="w-full h-full relative flex items-center justify-center"
        >
          <img
            src={src}
            alt="Flag or Silhouette"
            className={`max-w-full max-h-full object-contain transition-all duration-500 ${isSilhouette ? 'brightness-0 invert opacity-80' : ''}`}
            referrerPolicy="no-referrer"
          />
        </motion.div>
      )}
    </div>
  );
};

export default function App() {
  const [highScores, setHighScores] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('flagquest_highscores');
    return saved ? JSON.parse(saved) : { classic: 0, timeAttack: 0, population: 0, zen: 0, daily: 0, languageGuess: 0, capitalToFlag: 0, silhouetteChallenge: 0, continentSprint: 0 };
  });
  const [gameState, setGameState] = useState<'start' | 'playing' | 'feedback' | 'gameover' | 'modes' | 'categories' | 'regions' | 'achievements' | 'settings'>('start');
  const [gameMode, setGameMode] = useState<'classic' | 'timeAttack' | 'zen' | 'daily' | 'population' | 'languageGuess' | 'custom' | 'capitalToFlag' | 'silhouetteChallenge' | 'continentSprint'>('classic');
  const [selectedRegion, setSelectedRegion] = useState<Country['region'] | 'Global'>('Global');
  const [timerDifficulty, setTimerDifficulty] = useState<'relaxed' | 'standard' | 'hardcore'>('standard');
  const [selectedCategory, setSelectedCategory] = useState<Country['category']>('National');
  const [playedCodes, setPlayedCodes] = useState<string[]>([]);
  const [unlockedCategories, setUnlockedCategories] = useState<Country['category'][]>(() => {
    const saved = localStorage.getItem('flagquest_unlocked_categories');
    return saved ? JSON.parse(saved) : ['National', 'Language-Guess'];
  });
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentTier, setCurrentTier] = useState(1);
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [challengerCountry, setChallengerCountry] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIMER);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'da' | 'sv' | 'de' | 'fr' | 'es' | 'it' | 'pt'>(() => (localStorage.getItem('flagquest_lang') as any) || 'en');
  const [missedFlags, setMissedFlags] = useState<Country[]>([]);
  const [expandedAchievement, setExpandedAchievement] = useState<string | null>(null);
  const [customModes, setCustomModes] = useState<{id: string, name: string, region: string, category: string, timer: number}[]>(() => {
    const saved = localStorage.getItem('flagquest_custom_modes');
    return saved ? JSON.parse(saved) : [];
  });
  const [newCustomMode, setNewCustomMode] = useState({
    name: '',
    region: 'Global' as Country['region'] | 'Global',
    category: 'National' as Country['category'],
    timer: 15
  });
  const [activeCustomMode, setActiveCustomMode] = useState<{id: string, name: string, region: string, category: string, timer: number} | null>(null);
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('flagquest_xp') || '0', 10));
  const [lockedMessage, setLockedMessage] = useState<string | null>(null);
  const [achievements, setAchievements] = useState<string[]>(() => JSON.parse(localStorage.getItem('flagquest_achievements') || '[]'));
  const [totalGuessed, setTotalGuessed] = useState(() => parseInt(localStorage.getItem('flagquest_total_guessed') || '0', 10));
  const [gamesPlayed, setGamesPlayed] = useState(() => parseInt(localStorage.getItem('flagquest_games_played') || '0', 10));

  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;
  const t = TRANSLATIONS[language];

  useEffect(() => {
    const newAchievements = [...achievements];
    let changed = false;

    const check = (id: string, condition: boolean) => {
      if (condition && !newAchievements.includes(id)) {
        newAchievements.push(id);
        changed = true;
      }
    };

    check('streak_master', streak >= 10);
    check('streak_50', streak >= 50);
    check('expert', score >= 20);
    check('veteran', level >= 10);
    check('globetrotter', gamesPlayed >= 5);
    check('world_traveler', gamesPlayed >= 25);
    check('historian', totalGuessed >= 100);
    check('cartographer', totalGuessed >= 500);
    
    if (gameMode === 'timeAttack') {
      check('quick_thinker', score >= 10);
      check('lightning', score >= 30);
    }
    
    if (selectedCategory === 'Language-Guess') check('polyglot', score >= 10);
    if (selectedCategory === 'US-State') check('statesman', score >= 10);
    if (selectedCategory === 'World-Capitals') check('capitalist', score >= 10);
    if (selectedCategory === 'Danish-Kommune') check('danish_dynamite', score >= 10);
    if (selectedCategory === 'Swiss-Canton') check('swiss_precision', score >= 10);
    if (gameMode === 'zen') check('zen_master', true);

    const hour = new Date().getHours();
    if (hour >= 0 && hour < 4) check('night_owl', true);
    if (hour >= 4 && hour < 7) check('early_bird', true);

    if (changed) {
      setAchievements(newAchievements);
      localStorage.setItem('flagquest_achievements', JSON.stringify(newAchievements));
    }
  }, [streak, score, level, achievements, gamesPlayed, totalGuessed, gameMode, selectedCategory]);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('flagquest_highscore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastTickRef = useRef<number>(0);
  const preloadedImages = useRef<Record<string, HTMLImageElement>>({});

  const preloadImage = (url: string) => {
    if (!url || preloadedImages.current[url]) return;
    const img = new Image();
    img.src = url;
    preloadedImages.current[url] = img;
  };

  const playSound = (type: keyof typeof SOUNDS) => {
    if (isMuted) return;
    const audio = new Audio(SOUNDS[type]);
    audio.volume = type === 'tick' ? 0.3 : 0.5;
    audio.play().catch(() => {});
  };

  const filteredCountries = useMemo(() => {
    if (searchQuery.length < 3) return [];
    return COUNTRIES
      .filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = selectedRegion === 'Global' || c.region === selectedRegion;
        const matchesCategory = c.category === selectedCategory;
        return matchesSearch && matchesRegion && matchesCategory;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery, selectedRegion, selectedCategory]);

  const startRound = (modeOverride?: typeof gameMode) => {
    const activeMode = modeOverride || gameMode;
    
    if (activeMode === 'population') {
      const available = COUNTRIES.filter(c => 
        c.category === 'National' && 
        c.population && 
        !playedCodes.includes(c.code) &&
        c.code !== currentCountry?.code
      );
      
      if (available.length === 0) {
        handleGameOver();
        return;
      }

      const next = available[Math.floor(Math.random() * available.length)];
      
      // Logic: 
      // R1: A vs B.
      // R2: A vs C.
      // R3: C vs D.
      // R4: D vs E.
      if (score > 1) {
        setCurrentCountry(challengerCountry);
      }
      
      setChallengerCountry(next);
      setTimeLeft(INITIAL_TIMER);
      setGameState('playing');
      return;
    }

    if (activeMode === 'custom' && activeCustomMode) {
      const availableCountries = COUNTRIES.filter(c => 
        c.category === activeCustomMode.category &&
        (activeCustomMode.region === 'Global' || c.region === activeCustomMode.region) &&
        !playedCodes.includes(c.code)
      );

      if (availableCountries.length === 0) {
        handleGameOver();
        return;
      }

      const country = availableCountries[Math.floor(Math.random() * availableCountries.length)];
      setCurrentCountry(country);
      setTimeLeft(activeCustomMode.timer);
      setSearchQuery('');
      setIsDropdownOpen(false);
      setGameState('playing');
      return;
    }

    let tier = 1;
    if (activeMode === 'classic') {
      for (let i = TIER_THRESHOLDS.length - 1; i >= 0; i--) {
        if (score >= TIER_THRESHOLDS[i]) {
          tier = i + 1;
          break;
        }
      }
    } else {
      tier = Math.min(4, Math.floor(score / 10) + 1);
    }
    setCurrentTier(tier);

    const availableCountries = COUNTRIES.filter(c => 
      c.category === selectedCategory &&
      (selectedRegion === 'Global' || c.region === selectedRegion) &&
      (activeMode === 'zen' || activeMode === 'daily' ? true : c.tier <= tier) &&
      !playedCodes.includes(c.code)
    );
    
    if (availableCountries.length === 0) {
      if (playedCodes.length > 0) {
        handleGameOver();
      } else {
        setGameState('categories');
      }
      return;
    }

    let country: Country;
    if (activeMode === 'daily') {
      const today = new Date().toISOString().split('T')[0];
      const seed = today.split('-').reduce((a, b) => a + parseInt(b), 0) + score;
      country = availableCountries[seed % availableCountries.length];
    } else if (activeMode === 'capitalToFlag') {
      const withCapitals = availableCountries.filter(c => c.capital);
      if (withCapitals.length > 0) {
        country = withCapitals[Math.floor(Math.random() * withCapitals.length)];
      } else {
        country = availableCountries[Math.floor(Math.random() * availableCountries.length)];
      }
      // Generate 6 options
      const otherOptions = availableCountries
        .filter(c => c.code !== country.code)
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
      setOptions([country, ...otherOptions].sort(() => Math.random() - 0.5));
    } else {
      country = availableCountries[Math.floor(Math.random() * availableCountries.length)];
    }
    setCurrentCountry(country);

    // Preload next country image
    const potentialNext = availableCountries[Math.floor(Math.random() * availableCountries.length)];
    if (potentialNext) {
      const nextUrl = potentialNext.category === 'National' || potentialNext.category === 'US-State' 
        ? `https://flagcdn.com/w640/${potentialNext.code}.png`
        : potentialNext.imageUrl || `https://picsum.photos/seed/${potentialNext.code}/640/426`;
      preloadImage(nextUrl);
    }
    
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }

    if (selectedCategory === 'Language-Guess' && country?.audioUrl) {
      setTimeout(() => playLanguageAudio(country.audioUrl!), 100);
    }
    
    if (activeMode === 'classic') {
      const difficultyMultiplier = timerDifficulty === 'relaxed' ? 1.5 : timerDifficulty === 'hardcore' ? 0.7 : 1;
      setTimeLeft(Math.max(MIN_TIMER, (INITIAL_TIMER * difficultyMultiplier) - (score * TIMER_DECREMENT)));
    } else if (activeMode === 'timeAttack' || activeMode === 'continentSprint') {
      // Time is handled globally
    } else {
      setTimeLeft(999);
    }

    setSearchQuery('');
    setIsDropdownOpen(false);
    setGameState('playing');
  };

  const startGame = (mode: typeof gameMode, custom?: typeof activeCustomMode) => {
    setGameMode(mode);
    setScore(0);
    setStreak(0);
    setMissedFlags([]);
    setPlayedCodes([]);
    setCurrentTier(1);
    
    setGamesPlayed(prev => {
      const next = prev + 1;
      localStorage.setItem('flagquest_games_played', next.toString());
      return next;
    });

    if (mode === 'custom' && custom) {
      setActiveCustomMode(custom);
      setTimeout(() => startRound(mode), 0);
      return;
    }

    if (mode === 'continentSprint') {
      setSelectedCategory('National');
      setGameState('regions');
      return;
    }

    if (mode === 'capitalToFlag') {
      setSelectedCategory('National');
      setSelectedRegion('Global');
      setTimeout(() => startRound(mode), 0);
      return;
    }

    if (mode === 'silhouetteChallenge') {
      setSelectedCategory('National');
      setSelectedRegion('Global');
      setTimeout(() => startRound(mode), 0);
      return;
    }

    if (mode === 'population') {
      setSelectedCategory('National');
      const available = COUNTRIES.filter(c => c.category === 'National' && c.population);
      const first = available[Math.floor(Math.random() * available.length)];
      let second = available[Math.floor(Math.random() * available.length)];
      while (second.code === first.code) {
        second = available[Math.floor(Math.random() * available.length)];
      }
      setCurrentCountry(first);
      setChallengerCountry(second);
      setTimeLeft(INITIAL_TIMER);
      setGameState('playing');
    } else if (mode === 'languageGuess') {
      setSelectedCategory('Language-Guess');
      setSelectedRegion('Global');
      setTimeout(() => startRound('classic'), 0);
    } else {
      if (mode === 'timeAttack' || mode === 'continentSprint') {
        const difficultyMultiplier = timerDifficulty === 'relaxed' ? 1.5 : timerDifficulty === 'hardcore' ? 0.7 : 1;
        setTimeLeft(mode === 'continentSprint' ? 30 : 60 * difficultyMultiplier);
      }
      setGameState('categories');
    }
  };

  useEffect(() => {
    const isTimerActive = (gameState === 'playing' || (gameState === 'feedback' && (gameMode === 'timeAttack' || gameMode === 'continentSprint'))) && 
      gameMode !== 'zen' && 
      gameMode !== 'capitalToFlag' && 
      gameMode !== 'population' && 
      gameMode !== 'silhouetteChallenge';
    if (isTimerActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0.1) {
            clearInterval(timerRef.current!);
            handleGameOver();
            return 0;
          }
          const currentSecond = Math.ceil(prev);
          if (prev < 4 && currentSecond !== lastTickRef.current) {
            playSound('tick');
            lastTickRef.current = currentSecond;
          }
          return prev - 0.1;
        });
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, gameMode]);

  const saveCustomMode = () => {
    if (!newCustomMode.name) return;
    const mode = { ...newCustomMode, id: Date.now().toString() };
    const updated = [...customModes, mode];
    setCustomModes(updated);
    localStorage.setItem('flagquest_custom_modes', JSON.stringify(updated));
    setNewCustomMode({ name: '', region: 'Global', category: 'National', timer: 15 });
  };

  const deleteCustomMode = (id: string) => {
    const updated = customModes.filter(m => m.id !== id);
    setCustomModes(updated);
    localStorage.setItem('flagquest_custom_modes', JSON.stringify(updated));
  };

  const handleGameOver = () => {
    setGameState('gameover');
    playSound('incorrect');
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    if (score > highScores[gameMode]) {
      const newHighScores = { ...highScores, [gameMode]: score };
      setHighScores(newHighScores);
      localStorage.setItem('flagquest_highscores', JSON.stringify(newHighScores));
    }
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('flagquest_highscore', score.toString());
    }
    const newXp = xp + (score * 5);
    setXp(newXp);
    localStorage.setItem('flagquest_xp', newXp.toString());

    // Unlock Categories
    const newUnlocked = [...unlockedCategories];
    const newLevel = Math.floor(newXp / 100) + 1;
    
    Object.entries(UNLOCK_MAP).forEach(([lvl, cat]) => {
      if (newLevel >= parseInt(lvl) && !newUnlocked.includes(cat as any)) {
        newUnlocked.push(cat as any);
      }
    });

    if (newUnlocked.length !== unlockedCategories.length) {
      setUnlockedCategories(newUnlocked);
      localStorage.setItem('flagquest_unlocked_categories', JSON.stringify(newUnlocked));
    }
  };

  const handlePopulationGuess = (picked: 'current' | 'challenger') => {
    if (!currentCountry || !challengerCountry) return;

    const currentPop = currentCountry.population || 0;
    const challengerPop = challengerCountry.population || 0;

    const isCorrect = picked === 'current' 
      ? currentPop >= challengerPop 
      : challengerPop >= currentPop;

    if (isCorrect) {
      playSound('correct');
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      setXp(prev => {
        const newXp = prev + 10;
        localStorage.setItem('flagquest_xp', newXp.toString());
        return newXp;
      });
      
      const winner = picked === 'current' ? currentCountry : challengerCountry;
      const loser = picked === 'current' ? challengerCountry : currentCountry;
      
      setPlayedCodes(prev => [...prev, loser.code]);
      // Note: currentCountry and challengerCountry will be updated in startRound()
      setLastAnswerCorrect(true);
      setGameState('feedback');
      
      setTimeout(() => {
        startRound();
      }, 1500);
    } else {
      playSound('incorrect');
      setLastAnswerCorrect(false);
      setGameState('feedback');
      setTimeout(() => {
        handleGameOver();
      }, 1500);
    }
  };

  const playLanguageAudio = (url: string) => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    if (!isMuted) {
      // Wikimedia OGG to MP3 fallback for better browser compatibility (e.g. Safari)
      let finalUrl = url;
      if (url.includes('upload.wikimedia.org') && url.endsWith('.ogg')) {
        const filename = url.split('/').pop();
        const basePath = url.substring(0, url.lastIndexOf('/'));
        finalUrl = `${basePath.replace('/commons/', '/commons/transcoded/')}/${filename}/${filename}.mp3`;
      }

      const audio = new Audio(finalUrl);
      currentAudioRef.current = audio;
      
      // If the transcoded MP3 fails, try the original OGG as a last resort
      audio.play().catch(err => {
        if (finalUrl !== url) {
          const fallbackAudio = new Audio(url);
          currentAudioRef.current = fallbackAudio;
          fallbackAudio.play().catch(e => console.error("Audio playback failed:", e));
        } else {
          console.error("Audio playback failed:", err);
        }
      });
      
      // Auto-stop after 10 seconds to prevent overlapping or long clips
      setTimeout(() => {
        if (currentAudioRef.current === audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      }, 10000);
    }
  };

  const handleSelectCountry = (country: Country) => {
    if (gameState !== 'playing') return;

    const isCorrect = country.code === currentCountry?.code;
    setLastAnswerCorrect(isCorrect);
    setGameState('feedback');
    
    if (isCorrect) {
      playSound('correct');
      setScore(prev => prev + 1);
      setTotalGuessed(prev => {
        const next = prev + 1;
        localStorage.setItem('flagquest_total_guessed', next.toString());
        return next;
      });
      setPlayedCodes(prev => [...prev, currentCountry!.code]);
      setStreak(prev => prev + 1);
      setTimeout(() => {
        startRound();
      }, 1000);
    } else {
      playSound('incorrect');
      setStreak(0);
      if (currentCountry) setMissedFlags(prev => [...prev, currentCountry]);
      
      if (gameMode === 'timeAttack') {
        setTimeout(() => startRound(), 1000);
      } else if (gameMode === 'zen') {
        setTimeout(() => startRound(), 1500);
      } else {
        setTimeout(() => handleGameOver(), 1500);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleSettings = () => {
    if (gameState === 'settings') {
      setGameState('start');
      // Save settings
      localStorage.setItem('flagquest_lang', language);
    } else {
      setGameState('settings');
    }
  };

  const themeColors = isDarkMode ? {
    bg: 'bg-[#141414]',
    text: 'text-[#E4E3E0]',
    border: 'border-[#E4E3E0]',
    accent: 'bg-[#E4E3E0]',
    accentText: 'text-[#141414]',
    muted: 'bg-[#E4E3E0]/10'
  } : {
    bg: 'bg-[#E4E3E0]',
    text: 'text-[#141414]',
    border: 'border-[#141414]',
    accent: 'bg-[#141414]',
    accentText: 'text-[#E4E3E0]',
    muted: 'bg-[#141414]/10'
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans selection:bg-current selection:text-transparent ${themeColors.bg} ${themeColors.text}`}>
      {/* Header */}
      <header className={`border-b ${themeColors.border} p-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md ${isDarkMode ? 'bg-[#141414]/80' : 'bg-[#E4E3E0]/80'}`}>
          <div className="flex items-center gap-4">
            <Award className="w-6 h-6" />
            <h1 className="font-serif italic text-xl font-bold tracking-tight uppercase cursor-pointer" onClick={() => {
              setGameState('start');
              if (currentAudioRef.current) {
                currentAudioRef.current.pause();
                currentAudioRef.current.currentTime = 0;
              }
            }}>Flag Quest</h1>
            <div className={`hidden md:flex flex-col gap-1 ${themeColors.muted} px-4 py-2 rounded-2xl min-w-[140px]`}>
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-mono font-bold opacity-50">{t.level} {level}</span>
                <span className="text-[8px] font-mono opacity-40">{xpInLevel}/100 XP</span>
              </div>
              <div className={`w-full h-1.5 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'} rounded-full overflow-hidden`}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${xpInLevel}%` }}
                  className={`h-full ${isDarkMode ? 'bg-white' : 'bg-black'}`} 
                />
              </div>
              <span className="text-[8px] uppercase font-mono opacity-40 text-center">
                {t.nextLevelAt.replace('{xp}', (100 - xpInLevel).toString())}
              </span>
            </div>
          </div>
        <div className="flex items-center gap-4">
          <button onClick={handleToggleSettings} className={`p-2 hover:${themeColors.muted} rounded-full transition-colors`}>
            <Settings className="w-5 h-5" />
          </button>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 hover:${themeColors.muted} rounded-full transition-colors`}>
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setIsMuted(!isMuted)} className={`p-2 hover:${themeColors.muted} rounded-full transition-colors`}>
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <div className="flex gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] uppercase opacity-50 font-mono">{t.best}</span>
              <span className="font-mono font-bold text-lg">{highScores[gameMode] || 0}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 md:p-12">
        <AnimatePresence mode="wait">
          {gameState === 'start' && (
            <motion.div key="start" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center space-y-12 py-12">
              <div className="space-y-4">
                <motion.h2 initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-7xl md:text-9xl font-serif italic font-black leading-none tracking-tighter">
                  {t.title.split(' ')[0]} <br /> {t.title.split(' ')[1]}
                </motion.h2>
                <p className="text-sm uppercase tracking-widest opacity-70 max-w-md mx-auto">{t.subtitle}</p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <button onClick={() => setGameState('modes')} className={`group relative ${themeColors.accent} ${themeColors.accentText} px-12 py-6 rounded-full hover:scale-105 transition-transform overflow-hidden`}>
                  <span className="font-bold uppercase tracking-widest">{t.chooseMode}</span>
                </button>
                <button onClick={() => setGameState('settings')} className={`group relative border-2 ${themeColors.border} px-12 py-6 rounded-full hover:scale-105 transition-transform overflow-hidden`}>
                  <span className="font-bold uppercase tracking-widest">{t.settings}</span>
                </button>
                <button onClick={() => setGameState('achievements')} className={`group relative border-2 ${themeColors.border} px-12 py-6 rounded-full hover:scale-105 transition-transform overflow-hidden`}>
                  <span className="font-bold uppercase tracking-widest">{t.achievements}</span>
                </button>
                <button onClick={() => startGame('daily')} className={`group relative border-2 ${themeColors.border} px-12 py-6 rounded-full hover:scale-105 transition-transform overflow-hidden flex items-center gap-2`}>
                  <Calendar className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest">{t.dailyChallenge}</span>
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'modes' && (
            <motion.div key="modes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12 py-12">
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-serif italic font-black">{t.selectMode}</h2>
                <p className="text-xs uppercase tracking-widest opacity-50">{t.howToPlay}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 'classic', title: t.classic, desc: 'Progressive difficulty. One life.', icon: <Trophy /> },
                  { id: 'timeAttack', title: t.timeAttack, desc: '60 seconds. Speed is everything.', icon: <Zap /> },
                  { id: 'population', title: t.populationMode, desc: t.popSubtitle, icon: <TrendingUp /> },
                  { id: 'languageGuess', title: t.languageGuess, desc: t.identifyLanguage, icon: <Volume2 /> },
                  { id: 'custom', title: t.customMode, desc: 'Create your own challenge.', icon: <Settings /> },
                  { id: 'zen', title: t.zen, desc: 'No timer. No pressure. Just learn.', icon: <Globe /> },
                  { id: 'capitalToFlag', title: t.capitalToFlag, desc: t.identifyByCapital, icon: <Award /> },
                  { id: 'flagFusion', title: t.flagFusion, desc: t.identifyFused, icon: <Flame /> },
                  { id: 'silhouetteChallenge', title: t.silhouetteChallenge, desc: t.identifySilhouette, icon: <MapIcon /> },
                  { id: 'continentSprint', title: t.continentSprint, desc: t.sprintSubtitle, icon: <Zap /> }
                ].map(mode => (
                  <button key={mode.id} onClick={() => mode.id === 'custom' ? setGameState('customMode') : startGame(mode.id as any)} className={`border-2 ${themeColors.border} p-8 text-left hover:${themeColors.accent} hover:${themeColors.accentText} transition-all group`}>
                    <div className="mb-4 group-hover:scale-110 transition-transform">{mode.icon}</div>
                    <h3 className="text-2xl font-serif italic font-bold mb-2 uppercase">{mode.title}</h3>
                    <p className="text-xs opacity-60 leading-relaxed">{mode.desc}</p>
                  </button>
                ))}
              </div>

              <button onClick={() => {
                setGameState('start');
                if (currentAudioRef.current) {
                  currentAudioRef.current.pause();
                  currentAudioRef.current.currentTime = 0;
                }
              }} className="block mx-auto text-xs uppercase font-bold opacity-50 hover:opacity-100 underline underline-offset-8">{t.backToMenu}</button>
            </motion.div>
          )}

          {gameState === 'categories' && (
            <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12 py-12">
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-serif italic font-black">{t.selectCategory}</h2>
                <p className="text-xs uppercase tracking-widest opacity-50">{t.chooseCategory}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto relative">
                <AnimatePresence>
                  {lockedMessage && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest z-50 shadow-xl whitespace-nowrap"
                    >
                      {lockedMessage}
                    </motion.div>
                  )}
                </AnimatePresence>
                {[
                  { id: 'National', label: t.nationalFlags },
                  { id: 'US-State', label: t.usStates },
                  { id: 'World-Capitals', label: t.worldCapitals },
                  { id: 'India-State', label: t.indianStates },
                  { id: 'Language-Guess', label: t.languageGuess },
                  { id: 'Danish-Kommune', label: t.danishKommune },
                  { id: 'Swedish-Lan', label: t.swedishLan },
                  { id: 'German-County', label: t.germanCounties },
                  { id: 'Swiss-Canton', label: t.swissCantons },
                  { id: 'Commonwealth', label: t.commonwealth }
                ].map(cat => {
                  const isUnlocked = unlockedCategories.includes(cat.id as any);
                  const requiredLevel = Object.entries(UNLOCK_MAP).find(([_, c]) => c === cat.id)?.[0];
                  
                  return (
                    <button 
                      key={cat.id} 
                      onClick={() => {
                        if (isUnlocked) {
                          setSelectedCategory(cat.id as any);
                          if (cat.id === 'National') {
                            setGameState('regions');
                          } else {
                            setSelectedRegion('Global');
                            startRound();
                          }
                        } else {
                          setLockedMessage(t.levelRequired.replace('{lvl}', requiredLevel || '?'));
                          setTimeout(() => setLockedMessage(null), 2000);
                        }
                      }}
                      className={`p-4 border-2 ${themeColors.border} text-center transition-all relative overflow-hidden group ${selectedCategory === cat.id ? `${themeColors.accent} ${themeColors.accentText}` : isUnlocked ? `hover:${themeColors.muted}` : 'opacity-40'}`}
                    >
                      {!isUnlocked && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 backdrop-blur-[1px] group-hover:bg-black/10 transition-colors">
                          <Star className="w-4 h-4 mb-1" />
                          <span className="text-[8px] font-black">{t.locked}</span>
                          <span className="text-[7px] opacity-60">LVL {requiredLevel}</span>
                        </div>
                      )}
                      <div className="font-bold text-[10px] uppercase tracking-widest">{cat.label}</div>
                    </button>
                  );
                })}
              </div>

              <button onClick={() => setGameState('modes')} className="block mx-auto text-xs uppercase font-bold opacity-50 hover:opacity-100 underline underline-offset-8">Back to Modes</button>
            </motion.div>
          )}

          {gameState === 'regions' && (
            <motion.div key="regions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12 py-12">
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-serif italic font-black">{t.selectRegion}</h2>
                <p className="text-xs uppercase tracking-widest opacity-50">{t.filterNationalFlags}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {['Global', 'Americas', 'Europe', 'Africa', 'Asia', 'Oceania'].map(reg => (
                  <button 
                    key={reg} 
                    onClick={() => {
                      setSelectedRegion(reg as any);
                      startRound();
                    }}
                    className={`p-8 border-2 ${themeColors.border} text-center transition-all hover:${themeColors.accent} hover:${themeColors.accentText} group`}
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                      {reg === 'Global' && <Globe />}
                      {reg === 'Europe' && <MapIcon />}
                      {reg === 'Americas' && <MapIcon />}
                      {reg === 'Africa' && <MapIcon />}
                      {reg === 'Asia' && <MapIcon />}
                      {reg === 'Oceania' && <MapIcon />}
                    </div>
                    <div className="font-bold uppercase tracking-widest">{reg}</div>
                  </button>
                ))}
              </div>

              <button onClick={() => setGameState('categories')} className="block mx-auto text-xs uppercase font-bold opacity-50 hover:opacity-100 underline underline-offset-8">{t.backToCategories}</button>
            </motion.div>
          )}

          {(gameState === 'playing' || gameState === 'feedback') && currentCountry && (
            <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-mono px-2 py-0.5 ${themeColors.muted} rounded`}>{gameMode}</span>
                    <span className={`text-[10px] uppercase font-mono px-2 py-0.5 ${themeColors.muted} rounded`}>{selectedRegion}</span>
                  </div>
                  <h3 className="font-serif italic text-3xl">
                    {gameMode === 'population' ? t.popSubtitle : 
                     gameMode === 'capitalToFlag' ? `${t.identifyByCapital}: ${currentCountry.capital}` :
                     gameMode === 'silhouetteChallenge' ? t.identifySilhouette :
                     gameMode === 'flagFusion' ? t.identifyFused :
                     (currentCountry.category === 'World-Capitals' ? t.identifyCapital : currentCountry.category === 'Language-Guess' ? t.identifyLanguage : t.identifyFlag)}
                  </h3>
                </div>
                {gameMode !== 'zen' && (
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2 font-mono text-2xl font-bold">
                      <Timer className={`w-6 h-6 ${timeLeft < 5 ? 'text-red-500 animate-pulse' : ''}`} />
                      <span className={timeLeft < 5 ? 'text-red-500' : ''}>{timeLeft.toFixed(1)}s</span>
                    </div>
                    {streak > 2 && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        className="relative flex flex-col items-end"
                      >
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5]
                          }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="absolute -inset-4 bg-orange-500/20 blur-xl rounded-full"
                        />
                        <div className="flex items-center gap-1 text-orange-500 font-black italic text-xl uppercase relative">
                          <motion.span
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                          >
                            🔥
                          </motion.span>
                          {streak} {t.streak}!
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {gameMode === 'population' && challengerCountry ? (
                <div className="grid grid-cols-2 gap-4 md:gap-8">
                  {[
                    { country: currentCountry, id: 'current' as const },
                    { country: challengerCountry, id: 'challenger' as const }
                  ].map(({ country, id }) => (
                    <motion.button
                      key={id}
                      disabled={gameState === 'feedback'}
                      onClick={() => handlePopulationGuess(id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative group border-4 ${themeColors.border} rounded-3xl overflow-hidden bg-white text-[#141414] shadow-2xl transition-all ${gameState === 'feedback' ? 'cursor-default' : 'hover:ring-8 ring-current/5'}`}
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img 
                          src={`https://flagcdn.com/w640/${country.code}.png`} 
                          alt={country.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-4 md:p-8 text-center space-y-4">
                        <h4 className="text-xl md:text-2xl font-serif italic font-black uppercase tracking-tighter line-clamp-2 min-h-[3rem] md:min-h-[4rem] flex items-center justify-center">{country.name}</h4>
                        <div className="h-8 md:h-12 flex items-center justify-center">
                          {gameState === 'feedback' ? (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }} 
                              animate={{ opacity: 1, y: 0 }}
                              className="font-mono text-2xl font-black text-emerald-600"
                            >
                              {country.population?.toLocaleString()}
                            </motion.div>
                          ) : (
                            <div className="w-12 h-1 bg-black/10 rounded-full" />
                          )}
                        </div>
                      </div>
                      
                      {gameState === 'feedback' && (
                        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
                          (lastAnswerCorrect && id === (currentCountry.population! >= challengerCountry.population! ? 'current' : 'challenger')) ||
                          (!lastAnswerCorrect && id === (currentCountry.population! >= challengerCountry.population! ? 'current' : 'challenger'))
                            ? 'bg-emerald-500/10' : 'bg-red-500/10'
                        }`}>
                          {id === (currentCountry.population! >= challengerCountry.population! ? 'current' : 'challenger') && (
                            <CheckCircle2 className="w-24 h-24 text-emerald-500/50" />
                          )}
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              ) : (
                <>
                  <div className="relative aspect-[3/2] w-full max-w-2xl mx-auto border-[16px] border-white shadow-2xl overflow-hidden group rounded-sm flex items-center justify-center bg-slate-100">
                    {currentCountry.category === 'Language-Guess' ? (
                      <div className="flex flex-col items-center gap-6">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ repeat: Infinity, duration: 3 }}
                        >
                          <Volume2 className="w-32 h-32 text-slate-400" />
                        </motion.div>
                        <div className="space-y-2 text-center">
                          <p className="text-slate-400 font-mono text-xs uppercase tracking-widest animate-pulse">Listening to the language...</p>
                          <button 
                            onClick={() => currentCountry?.audioUrl && playLanguageAudio(currentCountry.audioUrl)}
                            className={`mt-4 flex items-center gap-2 px-6 py-3 rounded-full border-2 ${themeColors.border} hover:${themeColors.accent} hover:${themeColors.accentText} transition-all uppercase font-bold text-[10px] tracking-widest`}
                          >
                            <RotateCcw className="w-4 h-4" />
                            Replay Audio
                          </button>
                        </div>
                      </div>
                    ) : gameMode === 'capitalToFlag' ? (
                      <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center bg-slate-50">
                        <span className="text-[10px] uppercase font-mono opacity-50 mb-2">Identify the flag of</span>
                        <h2 className="text-4xl md:text-6xl font-serif italic font-black uppercase tracking-tighter text-[#141414]">
                          {currentCountry.capital}
                        </h2>
                        {gameState === 'feedback' && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                            <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">
                              {currentCountry.name}
                            </span>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <FlagImage 
                        country={currentCountry} 
                        themeColors={themeColors} 
                        isSilhouette={gameMode === 'silhouetteChallenge'} 
                      />
                    )}
                    <AnimatePresence>
                      {gameState === 'feedback' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md ${lastAnswerCorrect ? 'bg-emerald-500/30' : 'bg-red-500/30'}`}>
                          <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="bg-white p-8 rounded-full shadow-2xl mb-4">
                            {lastAnswerCorrect ? <CheckCircle2 className="w-20 h-20 text-emerald-500" /> : <XCircle className="w-20 h-20 text-red-500" />}
                          </motion.div>
                          {lastAnswerCorrect && currentCountry.fact && (
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white text-[#141414] p-4 max-w-xs text-center rounded-xl shadow-xl">
                              <p className="text-[10px] uppercase font-bold opacity-50 mb-1">{t.didYouKnow}</p>
                              <p className="text-xs font-medium italic">"{currentCountry.fact}"</p>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {gameMode === 'capitalToFlag' ? (
                    <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                      {options.map((option) => (
                        <motion.button
                          key={option.code}
                          disabled={gameState === 'feedback'}
                          onClick={() => handleSelectCountry(option)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`relative aspect-[3/2] border-4 ${
                            gameState === 'feedback' 
                              ? option.code === currentCountry.code 
                                ? 'border-emerald-500' 
                                : 'border-slate-200 opacity-50'
                              : `border-white hover:${themeColors.border}`
                          } bg-white shadow-lg rounded-xl overflow-hidden transition-all`}
                        >
                          <img 
                            src={`https://flagcdn.com/w640/${option.code}.png`} 
                            alt="Option" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          {gameState === 'feedback' && (
                            <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur-sm p-1 text-center">
                              <span className="text-[10px] font-bold uppercase truncate block">
                                {option.name}
                              </span>
                            </div>
                          )}
                          {gameState === 'feedback' && option.code === currentCountry.code && (
                            <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="max-w-md mx-auto relative" ref={dropdownRef}>
                      <div className={`flex items-center gap-3 border-2 ${themeColors.border} p-5 bg-white text-[#141414] transition-all rounded-xl ${isDropdownOpen ? 'ring-8 ring-current/5' : ''}`}>
                        <Search className="w-5 h-5 opacity-30" />
                        <input type="text" placeholder={t.searchPlaceholder} className="flex-1 bg-transparent outline-none font-bold text-xl" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setIsDropdownOpen(true); }} onFocus={() => setIsDropdownOpen(true)} disabled={gameState === 'feedback'} />
                        <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </div>
                      <AnimatePresence>
                        {isDropdownOpen && filteredCountries.length > 0 && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-full left-0 right-0 mb-4 bg-white text-[#141414] border-2 border-[#141414] max-h-80 overflow-y-auto z-40 shadow-2xl rounded-2xl p-2">
                            {filteredCountries.map((country) => (
                              <button key={country.code} onClick={() => handleSelectCountry(country)} className="w-full text-left p-4 hover:bg-[#141414] hover:text-[#E4E3E0] transition-all rounded-xl flex items-center justify-between group mb-1 last:mb-0">
                                <span className="font-bold">{country.name}</span>
                                <span className="text-[10px] uppercase opacity-30 font-mono">{country.region}</span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {gameState === 'customMode' && (
            <motion.div key="customMode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12 py-12">
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-serif italic font-black uppercase">{t.customMode}</h2>
                <p className="text-xs uppercase tracking-widest opacity-50">{t.createCustom}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                {/* Creation Form */}
                <div className={`p-8 border-2 ${themeColors.border} rounded-3xl space-y-6`}>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-mono font-bold opacity-50">{t.modeName}</label>
                    <input 
                      type="text" 
                      value={newCustomMode.name} 
                      onChange={e => setNewCustomMode({...newCustomMode, name: e.target.value})}
                      className={`w-full bg-transparent border-b-2 ${themeColors.border} p-2 font-bold text-xl outline-none`}
                      placeholder="My Expedition"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-mono font-bold opacity-50">{t.timerSettings}</label>
                    <input 
                      type="range" 
                      min="5" 
                      max="60" 
                      step="5"
                      value={newCustomMode.timer}
                      onChange={e => setNewCustomMode({...newCustomMode, timer: parseInt(e.target.value)})}
                      className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-current"
                    />
                    <div className="text-center font-mono font-bold">{newCustomMode.timer}s</div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-mono font-bold opacity-50">{t.selectCategory}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'National', label: t.nationalFlags },
                        { id: 'US-State', label: t.usStates },
                        { id: 'World-Capitals', label: t.worldCapitals },
                        { id: 'India-State', label: t.indianStates },
                        { id: 'Language-Guess', label: t.languageGuess },
                        { id: 'Danish-Kommune', label: t.danishKommune },
                        { id: 'Swedish-Lan', label: t.swedishLan },
                        { id: 'German-County', label: t.germanCounties },
                        { id: 'Swiss-Canton', label: t.swissCantons },
                        { id: 'Commonwealth', label: t.commonwealth }
                      ].filter(cat => unlockedCategories.includes(cat.id as any)).map(cat => (
                        <button 
                          key={cat.id} 
                          onClick={() => setNewCustomMode({...newCustomMode, category: cat.id as any})}
                          className={`p-3 border ${themeColors.border} rounded-xl text-[10px] uppercase font-bold transition-all ${newCustomMode.category === cat.id ? `${themeColors.accent} ${themeColors.accentText}` : `hover:${themeColors.muted}`}`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-mono font-bold opacity-50">{t.selectRegion}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Global', 'Americas', 'Europe', 'Africa', 'Asia', 'Oceania'].map(reg => (
                        <button 
                          key={reg} 
                          onClick={() => setNewCustomMode({...newCustomMode, region: reg as any})}
                          className={`p-3 border ${themeColors.border} rounded-xl text-[10px] uppercase font-bold transition-all ${newCustomMode.region === reg ? `${themeColors.accent} ${themeColors.accentText}` : `hover:${themeColors.muted}`}`}
                        >
                          {reg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={saveCustomMode}
                    className={`w-full ${themeColors.accent} ${themeColors.accentText} p-4 rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform`}
                  >
                    {t.saveMode}
                  </button>
                </div>

                {/* Saved Modes */}
                <div className="space-y-6">
                  <h3 className="text-xs uppercase font-black tracking-[0.3em] opacity-30">{t.myModes}</h3>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {customModes.map(mode => (
                      <div key={mode.id} className={`p-6 border-2 ${themeColors.border} rounded-2xl flex justify-between items-center group hover:border-current transition-colors`}>
                        <div className="space-y-1">
                          <h4 className="font-serif italic text-2xl font-bold uppercase">{mode.name}</h4>
                          <div className="flex gap-2">
                            <span className="text-[10px] uppercase opacity-50">{mode.region}</span>
                            <span className="text-[10px] opacity-20">|</span>
                            <span className="text-[10px] uppercase opacity-50">{mode.category}</span>
                            <span className="text-[10px] opacity-20">|</span>
                            <span className="text-[10px] uppercase opacity-50">{mode.timer}s</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => startGame('custom', mode)}
                            className={`p-3 ${themeColors.accent} ${themeColors.accentText} rounded-full hover:scale-110 transition-transform`}
                          >
                            <Play className="w-5 h-5 fill-current" />
                          </button>
                          <button 
                            onClick={() => deleteCustomMode(mode.id)}
                            className="p-3 opacity-30 hover:opacity-100 hover:text-red-500 transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={() => setGameState('modes')} className="block mx-auto text-xs uppercase font-bold opacity-50 hover:opacity-100 underline underline-offset-8">{t.backToMenu}</button>
            </motion.div>
          )}

          {gameState === 'gameover' && (
            <motion.div key="gameover" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-12 py-8">
              <div className="space-y-2">
                <h2 className="text-8xl font-serif italic font-black leading-none tracking-tighter">EXPEDITION <br /> ENDED</h2>
                <div className="flex justify-center gap-2">
                  <span className={`px-3 py-1 ${themeColors.muted} rounded-full text-[10px] font-bold uppercase tracking-widest`}>{gameMode}</span>
                  <span className={`px-3 py-1 ${themeColors.muted} rounded-full text-[10px] font-bold uppercase tracking-widest`}>{selectedRegion}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className={`bg-white text-[#141414] p-10 rounded-3xl shadow-2xl space-y-8 border-4 ${themeColors.border}`}>
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-black opacity-30">Final Score</span>
                    <div className="text-8xl font-mono font-black tracking-tighter">{score}</div>
                  </div>
                  <div className="flex justify-between items-center border-t-2 border-black/10 pt-6">
                    <div className="text-left">
                      <span className="text-[10px] uppercase font-bold opacity-30">Global Rank</span>
                      <div className="font-mono font-bold text-xl">#{Math.max(1, 10000 - (highScore * 100) - score)}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold opacity-30">Best</span>
                      <div className="font-mono font-bold text-xl">{highScore}</div>
                    </div>
                  </div>
                </div>

                {missedFlags.length > 0 && (
                  <div className={`${themeColors.muted} p-8 rounded-3xl space-y-4 text-left overflow-hidden relative`}>
                    <h3 className="text-xs font-black uppercase tracking-widest opacity-50">Review Missed Flags</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                      {Array.from(new Set(missedFlags.map(f => f.code))).map(code => {
                        const country = missedFlags.find(f => f.code === code)!;
                        return (
                          <div key={code} className={`flex items-center gap-4 ${isDarkMode ? 'bg-white/5' : 'bg-black/5'} p-3 rounded-xl`}>
                            {country.category === 'World-Capitals' ? (
                              <img src={country.imageUrl} className="w-12 h-8 object-cover rounded shadow-sm" referrerPolicy="no-referrer" />
                            ) : (
                              <img src={country.category === 'National' || country.category === 'US-State' 
                                ? `https://flagcdn.com/w80/${code}.png`
                                : `https://picsum.photos/seed/${code}/80/53`
                              } className="w-12 h-8 object-cover rounded shadow-sm" referrerPolicy="no-referrer" />
                            )}
                            <div className="flex-1">
                              <div className="font-bold text-sm">{country.name}</div>
                              <div className="text-[10px] opacity-50 uppercase">{country.region}</div>
                            </div>
                            <a href={`https://www.google.com/maps/search/${country.name}`} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-black/10 rounded-full transition-colors">
                              <MapIcon className="w-4 h-4" />
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-6">
                <button onClick={() => startGame(gameMode)} className={`group flex items-center gap-4 ${themeColors.accent} ${themeColors.accentText} px-16 py-8 rounded-full hover:scale-105 transition-transform shadow-2xl`}>
                  <RotateCcw className="w-6 h-6" />
                  <span className="font-black uppercase tracking-[0.2em] text-lg">{t.playAgain}</span>
                </button>
                <button onClick={() => {
                  setGameState('start');
                  if (currentAudioRef.current) {
                    currentAudioRef.current.pause();
                    currentAudioRef.current.currentTime = 0;
                  }
                }} className="text-xs uppercase tracking-widest font-black opacity-30 hover:opacity-100 transition-opacity border-b-2 border-transparent hover:border-current pb-1">{t.backToMenu}</button>
              </div>
            </motion.div>
          )}
          {gameState === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12 py-12">
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-serif italic font-black uppercase">{t.settings}</h2>
                <p className="text-xs uppercase tracking-widest opacity-50">Customize your expedition</p>
              </div>
              
              <div className="max-w-md mx-auto space-y-8">
                {/* Language Selection */}
                <div className="space-y-4">
                  <h3 className="text-[10px] uppercase font-mono font-bold opacity-50">{t.language}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'en', label: 'English' },
                      { id: 'da', label: 'Dansk' },
                      { id: 'sv', label: 'Svenska' },
                      { id: 'de', label: 'Deutsch' },
                      { id: 'fr', label: 'Français' },
                      { id: 'es', label: 'Español' },
                      { id: 'it', label: 'Italiano' },
                      { id: 'pt', label: 'Português' }
                    ].map(lang => (
                      <button 
                        key={lang.id} 
                        onClick={() => setLanguage(lang.id as any)}
                        className={`p-3 border-2 ${themeColors.border} text-center transition-all rounded-xl ${language === lang.id ? `${themeColors.accent} ${themeColors.accentText}` : `hover:${themeColors.muted}`}`}
                      >
                        <div className="font-bold text-[10px] uppercase">{lang.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Toggle */}
                <div className={`flex items-center justify-between p-6 border-2 ${themeColors.border} rounded-2xl`}>
                  <div>
                    <h3 className="font-bold uppercase tracking-widest">{t.darkMode}</h3>
                    <p className="text-[10px] opacity-60">Switch between light and dark mode</p>
                  </div>
                  <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-4 border-2 ${themeColors.border} rounded-xl hover:${themeColors.accent} hover:${themeColors.accentText} transition-all`}>
                    {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                  </button>
                </div>

                {/* Sound Toggle */}
                <div className={`flex items-center justify-between p-6 border-2 ${themeColors.border} rounded-2xl`}>
                  <div>
                    <h3 className="font-bold uppercase tracking-widest">{t.soundEffects}</h3>
                    <p className="text-[10px] opacity-60">Toggle game sounds and warnings</p>
                  </div>
                  <button onClick={() => setIsMuted(!isMuted)} className={`p-4 border-2 ${themeColors.border} rounded-xl hover:${themeColors.accent} hover:${themeColors.accentText} transition-all`}>
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </button>
                </div>

                {/* Timer Difficulty */}
                <div className="space-y-4">
                  <h3 className="text-[10px] uppercase font-mono font-bold opacity-50">{t.timerSpeed}</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'relaxed', label: t.relaxed, desc: '1.5x Time' },
                      { id: 'standard', label: t.standard, desc: '1.0x Time' },
                      { id: 'hardcore', label: t.hardcore, desc: '0.7x Time' }
                    ].map(diff => (
                      <button 
                        key={diff.id} 
                        onClick={() => setTimerDifficulty(diff.id as any)}
                        className={`p-4 border-2 ${themeColors.border} text-center transition-all rounded-xl ${timerDifficulty === diff.id ? `${themeColors.accent} ${themeColors.accentText}` : `hover:${themeColors.muted}`}`}
                      >
                        <div className="font-bold text-xs uppercase">{diff.label}</div>
                        <div className="text-[8px] opacity-60">{diff.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={handleToggleSettings} className={`block mx-auto ${themeColors.accent} ${themeColors.accentText} px-12 py-6 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform`}>{t.saveAndExit}</button>
            </motion.div>
          )}

          {gameState === 'achievements' && (
            <motion.div key="achievements" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12 py-12">
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-serif italic font-black">STATS & ACHIEVEMENTS</h2>
                <p className="text-xs uppercase tracking-widest opacity-50">Your journey's progress and milestones</p>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <div className={`p-6 border-2 ${themeColors.border} rounded-2xl text-center space-y-2`}>
                  <div className="text-3xl font-black font-serif italic">{totalGuessed}</div>
                  <div className="text-[10px] uppercase font-bold opacity-50">Flags Guessed</div>
                </div>
                <div className={`p-6 border-2 ${themeColors.border} rounded-2xl text-center space-y-2`}>
                  <div className="text-3xl font-black font-serif italic">{gamesPlayed}</div>
                  <div className="text-[10px] uppercase font-bold opacity-50">Games Played</div>
                </div>
                <div className={`p-6 border-2 ${themeColors.border} rounded-2xl text-center space-y-2`}>
                  <div className="text-3xl font-black font-serif italic">{COUNTRIES.filter(c => unlockedCategories.includes(c.category)).length}</div>
                  <div className="text-[10px] uppercase font-bold opacity-50">Flags Unlocked</div>
                </div>
                <div className={`p-6 border-2 ${themeColors.border} rounded-2xl text-center space-y-2`}>
                  <div className="text-3xl font-black font-serif italic">LVL {level}</div>
                  <div className="text-[10px] uppercase font-bold opacity-50">Current Rank</div>
                </div>
              </div>

              {/* High Scores Section */}
              <div className="max-w-4xl mx-auto space-y-6">
                <h3 className="text-xs uppercase font-black tracking-[0.3em] opacity-30 text-center">{t.personalBests}</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(highScores).map(([mode, score]) => (
                    <div key={mode} className={`p-4 border-2 ${themeColors.border} rounded-xl text-center`}>
                      <div className="text-[8px] uppercase font-bold opacity-50 mb-1">{t[mode] || mode}</div>
                      <div className="text-xl font-black font-serif italic">{score}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Level Progress Bar */}
              <div className="max-w-4xl mx-auto space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-black opacity-50">
                  <span>Level {level}</span>
                  <span>{xpInLevel}% to Level {level + 1}</span>
                </div>
                <div className="h-4 bg-black/5 rounded-full overflow-hidden border-2 border-black/10">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${xpInLevel}%` }}
                    className={`h-full ${themeColors.accent}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {ACHIEVEMENT_LIST
                  .sort((a, b) => {
                    const aDone = achievements.includes(a.id);
                    const bDone = achievements.includes(b.id);
                    if (aDone && !bDone) return -1;
                    if (!aDone && bDone) return 1;
                    return 0;
                  })
                  .map(ach => {
                    const isUnlocked = achievements.includes(ach.id);
                    const isExpanded = expandedAchievement === ach.id;
                    
                    return (
                      <motion.div 
                        key={ach.id} 
                        layout
                        onClick={() => setExpandedAchievement(isExpanded ? null : ach.id)}
                        className={`border-2 ${themeColors.border} p-6 flex flex-col gap-4 transition-all cursor-pointer overflow-hidden ${isUnlocked ? 'opacity-100' : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-100'}`}
                      >
                        <div className="flex items-center gap-6">
                          <div className={`p-4 rounded-xl ${isUnlocked ? 'bg-orange-500/10 text-orange-500' : 'bg-current/5'}`}>
                            {ach.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold uppercase tracking-widest">
                              {ach.secret && !isUnlocked ? '???' : ach.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${isUnlocked ? 'bg-emerald-500' : 'bg-black/20'}`} />
                              <span className="text-[8px] uppercase font-bold opacity-50">
                                {isUnlocked ? 'Accomplished' : 'Locked'}
                              </span>
                            </div>
                          </div>
                          <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-black/5 pt-4"
                            >
                              <p className="text-xs font-medium opacity-70 leading-relaxed">
                                {ach.secret && !isUnlocked ? 'This is a secret achievement. Keep exploring to uncover it!' : ach.desc}
                              </p>
                              {isUnlocked && (
                                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[8px] font-black uppercase tracking-widest">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Unlocked
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
              </div>
              <button onClick={() => {
                setGameState('start');
                if (currentAudioRef.current) {
                  currentAudioRef.current.pause();
                  currentAudioRef.current.currentTime = 0;
                }
              }} className="block mx-auto text-xs uppercase font-bold opacity-50 hover:opacity-100 underline underline-offset-8">Back to Menu</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 pointer-events-none opacity-10 flex justify-between items-end">
        <div className="font-mono text-[10px] uppercase leading-tight">
          Explorer_Rank: {level}<br />
          XP_Total: {xp}<br />
          Session_Active: True
        </div>
        <Globe className="w-20 h-20" />
      </footer>
    </div>
  );
}
