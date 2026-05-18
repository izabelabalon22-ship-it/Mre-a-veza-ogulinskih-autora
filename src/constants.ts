/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Author, Connection, Legend } from './types';

export const AUTHORS: Author[] = [
  {
    id: 'ivana-brlic-mazuranic',
    name: 'Ivana Brlić-Mažuranić',
    bio: 'Najznačajnija hrvatska spisateljica za djecu, rođena u Ogulinu. Njezina djela transformiraju sirove ogulinske legende (napose one o vješticama s Kleka) u univerzalne bajke, čime je postavila temelje modernog identiteta Ogulina kao Grad bajke.',
    period: '1874 - 1938',
    roles: ['Književnica'],
    motives: ['Klek', 'Bajka', 'Mitologija', 'Zavičajni identitet'],
    works: ['Priče iz davnine', 'Čudnovate zgode šegrta Hlapića'],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Ivana_Brlic_Mazuranic.jpg'
  },
  {
    id: 'emil-laszowski',
    name: 'Emil Laszowski',
    bio: 'Hrvatski povjesničar i arhivist koji je kroz znanstveni rad legitimirao lokalne predaje o Frankopanima, pretvarajući arhivsku građu u čvrst oslonac za ogulinski povijesni identitet.',
    period: '1868 - 1949',
    roles: ['Povjesničar', 'Arhivist'],
    motives: ['Povijest', 'Frankopani', 'Gradina', 'Arhivi', 'Znanstvena verifikacija'],
    works: ['Povijest grada Ogulina', 'Gorski kotar i Vinodol'],
  },
  {
    id: 'djuro-dezelic',
    name: 'Đuro Deželić',
    bio: 'Književnik i javni djelatnik koji je Ogulinu davao društveni i politički značaj, promovirajući krasote zavičaja kao integralni dio hrvatskog narodnog preporoda i identiteta.',
    period: '1838 - 1907',
    roles: ['Književnik', 'Političar'],
    motives: ['Narodni identitet', 'Kultura', 'Politika', 'Domoljublje'],
    works: ['Ogulin i okolica'],
  },
  {
    id: 'milan-mogus',
    name: 'Milan Moguš',
    bio: 'Akademik i jezikoslovac koji je kroz proučavanje dijalekata sačuvao "glas" ogulinskog identiteta, dokazujući neraskidivu vezu između govora, prostora i zajednice.',
    period: '1936 - 2017',
    roles: ['Jezikoslovac', 'Akademik'],
    motives: ['Jezik', 'Dijalekt', 'Povijest jezika', 'Jezični identitet'],
    works: ['Kratka povijest hrvatskoga književnoga jezika'],
  },
  {
    id: 'rudolf-strohal',
    name: 'Rudolf Strohal',
    bio: 'Jezikoslovac koji je sustavno prikupljao usmenu građu, pretvarajući narodni govor i običaje Ogulina u zapisanu kulturnu baštinu koja definira lokalni karakter.',
    period: '1856 - 1936',
    roles: ['Jezikoslovac', 'Povjesničar'],
    motives: ['Govor', 'Dijalekt', 'Običaji', 'Etnološka baština'],
    works: ['Hrvatska narodna čitanka'],
  },
  {
    id: 'nikola-magdic',
    name: 'Nikola Magdić',
    bio: 'Pedagog koji je kroz dokumentaciju narodnog života osigurao da ogulinske legende ne ostanu samo usmena predaja, već da postanu obrazovni temelj za buduće generacije.',
    period: 'Moderno doba',
    roles: ['Pedagog', 'Pisac'],
    motives: ['Običaji', 'Školstvo', 'Narodna predaja', 'Pedagogija baštine'],
    works: ['Ogulinske narodne pripovijetke'],
  },
  {
    id: 'sabina-gvozdic',
    name: 'Sabina Gvozdić',
    bio: 'Suvremena čuvarica ogulinskog identiteta koja performativnim pripovijedanjem oživljava mitove o Kleku, vraćajući legendama njihovu prvotnu, živu snagu unutar zajednice.',
    period: 'Suvremeno doba',
    roles: ['Pripovjedačica', 'Interpretatorica baštine'],
    motives: ['Pripovijedanje', 'Bajke', 'Usmena predaja', 'Živa baština'],
    works: ['Programi pripovijedanja u Ogulinu'],
  },
  {
    id: 'marijana-hamersak',
    name: 'Marijana Hameršak',
    bio: 'Znanstvenica koja analitički dekonstruira nastanak i recepciju ogulinskih bajki, mapirajući kako se mitološki motivi transformiraju u gradivne elemente modernog brandinga i identiteta.',
    period: 'Suvremeno doba',
    roles: ['Etnologinja', 'Znanstvenica'],
    motives: ['Dječja književnost', 'Folkloristika', 'Stvaranje identiteta'],
    works: ['Uvod u dječju književnost', 'Pričalice'],
  }
];

export const CONNECTIONS: Connection[] = [
  {
    source: 'ivana-brlic-mazuranic',
    target: 'emil-laszowski',
    type: 'influence',
    description: 'Sinteza umjetničke imaginacije i historiografske točnosti u definiranju frankopanskog mita.'
  },
  {
    source: 'ivana-brlic-mazuranic',
    target: 'nikola-magdic',
    type: 'theme',
    description: 'Kontinuitet od sirove narodne predaje do literarnog remek-djela koje oblikuje zavičajni kod.'
  },
  {
    source: 'emil-laszowski',
    target: 'djuro-dezelic',
    type: 'collaboration',
    description: 'Zajednički rad na institucionalizaciji ogulinske povijesti kao temelja nacionalnog ponosa.'
  },
  {
    source: 'rudolf-strohal',
    target: 'milan-mogus',
    type: 'influence',
    description: 'Razvoj filološkog identiteta kroz strogu analizu ogulinskog govora kao živog spomenika.'
  },
  {
    source: 'rudolf-strohal',
    target: 'nikola-magdic',
    type: 'theme',
    description: 'Dokumentiranje svakodnevice i običaja kao obrana od zaborava autentičnog lokalnog identiteta.'
  },
  {
    source: 'emil-laszowski',
    target: 'rudolf-strohal',
    type: 'collaboration',
    description: 'Povezivanje zapisanog dokumenta i izgovorene riječi u jedinstvenu kulturnu povijest Ogulina.'
  },
  {
    source: 'sabina-gvozdic',
    target: 'ivana-brlic-mazuranic',
    type: 'influence',
    description: 'Prevođenje pisane baštine natrag u usmenu formu, čime legenda ponovno postaje dio aktivne tradicije.'
  },
  {
    source: 'marijana-hamersak',
    target: 'ivana-brlic-mazuranic',
    type: 'theme',
    description: 'Analiza procesa kojim književna bajka postaje ključni faktor suvremene identifikacije grada.'
  },
  {
    source: 'sabina-gvozdic',
    target: 'marijana-hamersak',
    type: 'collaboration',
    description: 'Dijalog između performanse i teorije u istraživanju suvremenog folklornog identiteta.'
  },
  {
    source: 'sabina-gvozdic',
    target: 'nikola-magdic',
    type: 'theme',
    description: 'Transgeneracijski prijenos narodnih pripovijedaka: od zapisa u knjizi do živog glasa pripovjedača.'
  }
];

export const LEGENDS: Legend[] = [
  {
    id: 'legend-klecke-vjestice',
    name: 'Klečke vještice',
    description: 'Najpoznatija ogulinska legenda o vješticama koje se za olujnih noći skupljaju na vrhu Kleka.',
    identityImpact: 'Oblikovala Ogulin kao mistično središte i inspirirala naziv "Grad bajke".'
  },
  {
    id: 'legend-djulin-ponor',
    name: 'Đulin ponor',
    description: 'Legenda o nesretnoj ljubavi Đule koja se bacila u ponor rijeke Dobre zbog neuzvraćene ili zabranjene ljubavi.',
    identityImpact: 'Simbol romantičarskog i tragičnog segmenta lokalnog identiteta, integriran u samu geografiju grada.'
  },
  {
    id: 'legend-frankopani',
    name: 'Frankopanska baština',
    description: 'Povijesne predaje o osnutku Starog grada i plemićkoj lozi Frankopana.',
    identityImpact: 'Osigurava povijesni legitimitet i ratnički, plemićki ponos ogulinskog kraja.'
  },
  {
    id: 'legend-uspavani-div',
    name: 'Uspavani div (Klek)',
    description: 'Legenda koja kaže da je planina Klek zapravo okamenjeni div koji čeka trenutak buđenja.',
    identityImpact: 'Glavni vizualni simbol grada koji spaja prirodu s mitologijom u kolektivnoj svijesti.'
  },
  {
    id: 'legend-smitovo-jezero',
    name: 'Šmitovo jezero',
    description: 'Narodna predaja o zmaju koji je živio u jezeru i vilama koje su se tamo okupljale.',
    identityImpact: 'Čuva mističnu auru ogulinskog krajolika kao mjesta gdje su granice svjetova propusne.'
  }
];

export const AUTHOR_LEGEND_LINKS = [
  { authorId: 'ivana-brlic-mazuranic', legendId: 'legend-klecke-vjestice', description: 'Glavna inspiracija za Regoča i mističnu atmosferu bajki.' },
  { authorId: 'ivana-brlic-mazuranic', legendId: 'legend-uspavani-div', description: 'Transformacija vizure Kleka u lik Regoča u Pričama iz davnine.' },
  { authorId: 'sabina-gvozdic', legendId: 'legend-klecke-vjestice', description: 'Interpretacija kroz živu usmenu predaju turistima i djeci.' },
  { authorId: 'sabina-gvozdic', legendId: 'legend-uspavani-div', description: 'Pripovijedanje o nastanku planine kao ključni dio zavičajne edukacije.' },
  { authorId: 'emil-laszowski', legendId: 'legend-frankopani', description: 'Znanstvena obrada povijesnog konteksta legendi.' },
  { authorId: 'nikola-magdic', legendId: 'legend-djulin-ponor', description: 'Zapisivanje narodnih varijanti priče o Đuli.' },
  { authorId: 'rudolf-strohal', legendId: 'legend-smitovo-jezero', description: 'Dokumentiranje vjerovanja o zmaju i vilama u okviru filoloških istraživanja.' },
  { authorId: 'marijana-hamersak', legendId: 'legend-klecke-vjestice', description: 'Istraživanje kako legenda postaje kulturni brend.' },
  { authorId: 'marijana-hamersak', legendId: 'legend-smitovo-jezero', description: 'Analiza folklorne topografije i njezine uloge u modernoj identifikaciji.' }
];
