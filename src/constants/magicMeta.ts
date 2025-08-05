import Decimal from 'break_eternity.js';

export interface EssenceMeta {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface RuneRequirementMeta {
  essenceId: string;
  baseAmount: number;
  multiplier: number;
}

export interface RuneMeta {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirements: RuneRequirementMeta[];
}

export const RANKS = [
  {
    id: 1,
    name: 'Послушник',
    class: 'novice',
    minLevel: new Decimal(1),
    color: '#6b7280',
  },
  { id: 2, name: 'Ученик', class: 'apprentice', minLevel: new Decimal(10), color: '#059669' },
  {
    id: 3,
    name: 'Подмастерье',
    class: 'journeyman',
    minLevel: new Decimal(10).pow(2),
    color: '#0891b2',
  },
  { id: 4, name: 'Адепт', class: 'adept', minLevel: new Decimal(10).pow(3), color: '#2563eb' },
  {
    id: 5,
    name: 'Специалист',
    class: 'specialist',
    minLevel: new Decimal(10).pow(4),
    color: '#7c3aed',
  },
  { id: 6, name: 'Эксперт', class: 'expert', minLevel: new Decimal(10).pow(5), color: '#c2410c' },
  { id: 7, name: 'Мастер', class: 'master', minLevel: new Decimal(10).pow(6), color: '#dc2626' },
  { id: 8, name: 'Архимаг', class: 'archmage', minLevel: new Decimal(10).pow(7), color: '#be185d' },
  { id: 9, name: 'Повелитель', class: 'lord', minLevel: new Decimal(10).pow(8), color: '#a21caf' },
  {
    id: 10,
    name: 'Владыка',
    class: 'overlord',
    minLevel: new Decimal(10).pow(9),
    color: '#9333ea',
  },
  {
    id: 11,
    name: 'Магистр',
    class: 'magistrate',
    minLevel: new Decimal(10).pow(10),
    color: '#7c2d12',
  },
  {
    id: 12,
    name: 'Верховный',
    class: 'supreme',
    minLevel: new Decimal(10).pow(11),
    color: '#b45309',
  },
  {
    id: 13,
    name: 'Легендарный',
    class: 'legendary',
    minLevel: new Decimal(10).pow(12),
    color: '#ca8a04',
  },
  {
    id: 14,
    name: 'Мифический',
    class: 'mythical',
    minLevel: new Decimal(10).pow(13),
    color: '#eab308',
  },
  {
    id: 15,
    name: 'Божественный',
    class: 'divine',
    minLevel: new Decimal(10).pow(14),
    color: '#fbbf24',
  },
];

export const MAGE_SYLLABLES =
  'ар ир ор ур эр ал ил ол ул эл ан ин он ун эн ас ис ос ус эс ат ит от ут эт аж иж ож уж эж ай ий ой уй эй ам им ом ум эм ав ив ов ув эв аг иг ог уг эг ад ид од уд эд аз из оз уз эз ак ик ок ук эк ап ип оп уп эп аф иф оф уф эф ах их ох ух эх ац иц оц уц эц аш иш ош уш эш ба би бо бу бэ ва ви во ву вэ га ги го гу гэ да ди до ду дэ за зи зо зу зэ ка ки ко ку кэ ла ли ло лу лэ ма ми мо му мэ на ни но ну нэ па пи по пу пэ ра ри ро ру рэ са си со су сэ та ти то ту тэ фа фи фо фу фэ ха ки хо ху хэ ца ци цо цу цэ ша ши шо шу шэ я йе йо йу йа';

export const MAGE_ICONS = [
  { icon: 'fas fa-hat-wizard', color: '#3b82f6' },
  { icon: 'fas fa-fire', color: '#dc2626' },
  { icon: 'fas fa-snowflake', color: '#06b6d4' },
  { icon: 'fas fa-bolt', color: '#eab308' },
  { icon: 'fas fa-mountain', color: '#a3a3a3' },
  { icon: 'fas fa-water', color: '#0ea5e9' },
  { icon: 'fas fa-sun', color: '#f59e0b' },
  { icon: 'fas fa-moon', color: '#8b5cf6' },
  { icon: 'fas fa-wind', color: '#10b981' },
  { icon: 'fas fa-seedling', color: '#22c55e' },
  { icon: 'fas fa-skull', color: '#ef4444' },
  { icon: 'fas fa-eye', color: '#f97316' },
];

export const MAGE_RANK_STYLE = {
        novice: {
          background: 'linear-gradient(45deg, #6b7280, #4b5563)',
          color: '#f3f4f6',
          borderColor: '#9ca3af',
          boxShadow: 'none',
        },
        apprentice: {
          background: 'linear-gradient(45deg, #059669, #047857)',
          color: '#d1fae5',
          borderColor: '#10b981',
          boxShadow: 'none',
        },
        journeyman: {
          background: 'linear-gradient(45deg, #0891b2, #0e7490)',
          color: '#cffafe',
          borderColor: '#06b6d4',
          boxShadow: 'none',
        },
        adept: {
          background: 'linear-gradient(45deg, #2563eb, #1d4ed8)',
          color: '#dbeafe',
          borderColor: '#3b82f6',
          boxShadow: 'none',
        },
        specialist: {
          background: 'linear-gradient(45deg, #7c3aed, #6d28d9)',
          color: '#ede9fe',
          borderColor: '#8b5cf6',
          boxShadow: 'none',
        },
        expert: {
          background: 'linear-gradient(45deg, #c2410c, #9a3412)',
          color: '#fed7aa',
          borderColor: '#ea580c',
          boxShadow: 'none',
        },
        master: {
          background: 'linear-gradient(45deg, #dc2626, #b91c1c)',
          color: '#fecaca',
          borderColor: '#ef4444',
          boxShadow: 'none',
        },
        archmage: {
          background: 'linear-gradient(45deg, #be185d, #9d174d)',
          color: '#fce7f3',
          borderColor: '#ec4899',
          boxShadow: 'none',
        },
        lord: {
          background: 'linear-gradient(45deg, #a21caf, #86198f)',
          color: '#f3e8ff',
          borderColor: '#c084fc',
          boxShadow: 'none',
        },
        overlord: {
          background: 'linear-gradient(45deg, #9333ea, #7c3aed)',
          color: '#ede9fe',
          borderColor: '#a855f7',
          boxShadow: 'none',
        },
        magistrate: {
          background: 'linear-gradient(45deg, #7c2d12, #651e10)',
          color: '#fed7aa',
          borderColor: '#c2410c',
          boxShadow: 'none',
        },
        supreme: {
          background: 'linear-gradient(45deg, #b45309, #92400e)',
          color: '#fef3c7',
          borderColor: '#d97706',
          boxShadow: 'none',
        },
        legendary: {
          background: 'linear-gradient(45deg, #ca8a04, #a16207)',
          color: '#fef3c7',
          borderColor: '#eab308',
          boxShadow: 'none',
        },
        mythical: {
          background: 'linear-gradient(45deg, #eab308, #ca8a04)',
          color: '#fffbeb',
          borderColor: '#f59e0b',
          boxShadow: 'none',
        },
        divine: {
          background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
          color: '#fffbeb',
          borderColor: '#fbbf24',
          boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
        },
      };

export const ESSENCE_META: EssenceMeta[] = [
  { id: 'fire', name: 'Огонь', icon: 'fas fa-fire', color: '#ff4444' },
  { id: 'water', name: 'Вода', icon: 'fas fa-droplet', color: '#4444ff' },
  { id: 'earth', name: 'Земля', icon: 'fas fa-mountain', color: '#8b4513' },
  { id: 'air', name: 'Воздух', icon: 'fas fa-wind', color: '#87ceeb' },
  { id: 'light', name: 'Свет', icon: 'fas fa-sun', color: '#ffff00' },
  { id: 'dark', name: 'Тьма', icon: 'fas fa-moon', color: '#4b0082' },
  { id: 'order', name: 'Порядок', icon: 'fas fa-balance-scale', color: '#000080' },
  { id: 'chaos', name: 'Хаос', icon: 'fas fa-explosion', color: '#8b0000' },
  { id: 'arcane', name: 'Магия', icon: 'fas fa-star', color: '#9932cc' },
  { id: 'spirit', name: 'Дух', icon: 'fas fa-ghost', color: '#dda0dd' },
  { id: 'ice', name: 'Лёд', icon: 'fas fa-snowflake', color: '#00ffff' },
  { id: 'lightning', name: 'Молния', icon: 'fas fa-bolt', color: '#ffd700' },
  { id: 'nature', name: 'Природа', icon: 'fas fa-leaf', color: '#228b22' },
  { id: 'death', name: 'Смерть', icon: 'fas fa-skull-crossbones', color: '#2f4f4f' },
  { id: 'crystal', name: 'Кристалл', icon: 'fas fa-gem', color: '#48d1cc' },
  { id: 'metal', name: 'Металл', icon: 'fas fa-hammer', color: '#696969' },
  { id: 'poison', name: 'Яд', icon: 'fas fa-flask-poison', color: '#adff2f' },
  { id: 'blood', name: 'Кровь', icon: 'fas fa-droplet', color: '#dc143c' },
];

export const RUNE_META: RuneMeta[] = [
  {
    id: 'frost',
    name: 'Мороз',
    description: 'Замедляет восстановление здоровья врагов',
    icon: 'fas fa-icicles',
    color: '#3498db',
    requirements: [
      { essenceId: 'ice', baseAmount: 8, multiplier: 1.5 },
      { essenceId: 'water', baseAmount: 6, multiplier: 1.3 },
      { essenceId: 'air', baseAmount: 5, multiplier: 1.2 },
    ],
  },
  {
    id: 'poison',
    name: 'Отравление',
    description:
      'Накладывает яд на врага. Каждое новое наложение усиливает отравление и наносит 30% урона от яда',
    icon: 'fas fa-biohazard',
    color: '#8fbc8f',
    requirements: [
      { essenceId: 'poison', baseAmount: 8, multiplier: 1.5 },
      { essenceId: 'chaos', baseAmount: 6, multiplier: 1.3 },
      { essenceId: 'dark', baseAmount: 4, multiplier: 1.2 },
    ],
  },
  {
    id: 'storm',
    name: 'Буря',
    description: 'Постоянно разрушает броню врага при каждом попадании',
    icon: 'fas fa-cloud-bolt',
    color: '#1e90ff',
    requirements: [
      { essenceId: 'lightning', baseAmount: 8, multiplier: 1.5 },
      { essenceId: 'air', baseAmount: 6, multiplier: 1.3 },
      { essenceId: 'water', baseAmount: 4, multiplier: 1.2 },
    ],
  },
  {
    id: 'ultimate',
    name: 'Превосходство',
    description: 'Увеличивает получаемый опыт за убийство врага',
    icon: 'fas fa-crown',
    color: '#ffd700',
    requirements: [
      { essenceId: 'light', baseAmount: 10, multiplier: 1.8 },
      { essenceId: 'order', baseAmount: 8, multiplier: 1.5 },
      { essenceId: 'spirit', baseAmount: 6, multiplier: 1.3 },
    ],
  },
  {
    id: 'ignite',
    name: 'Поджог',
    description:
      'Наносит урон и поджигает врага, нанося 10% от изначального урона как горение. Горение ослабевает на 10% каждую секунду',
    icon: 'fas fa-fire-flame-curved',
    color: '#ff6600',
    requirements: [
      { essenceId: 'fire', baseAmount: 8, multiplier: 1.5 },
      { essenceId: 'arcane', baseAmount: 6, multiplier: 1.4 },
      { essenceId: 'crystal', baseAmount: 4, multiplier: 1.2 },
    ],
  },
  {
    id: 'death_curse',
    name: 'Проклятие',
    description:
      'Накладывает смертельное проклятие. Мгновенно убивает врага, если его здоровье меньше или равно силе проклятия',
    icon: 'fas fa-skull-crossbones',
    color: '#1a1a1a',
    requirements: [
      { essenceId: 'death', baseAmount: 10, multiplier: 1.7 },
      { essenceId: 'blood', baseAmount: 8, multiplier: 1.5 },
      { essenceId: 'nature', baseAmount: 6, multiplier: 1.3 },
    ],
  },
  {
    id: 'bleeding',
    name: 'Кровотечение',
    description:
      'Вызывает кровотечение, наносящее 5% урона каждую секунду. Кровотечение усиливается на 3% каждую секунду',
    icon: 'fas fa-heart-crack',
    color: '#8b0000',
    requirements: [
      { essenceId: 'metal', baseAmount: 10, multiplier: 1.6 },
      { essenceId: 'earth', baseAmount: 6, multiplier: 1.4 },
      { essenceId: 'lightning', baseAmount: 4, multiplier: 1.3 },
    ],
  },
  {
    id: 'saturation',
    name: 'Насыщение',
    description: 'Увеличивает количество эссенций, выпадающее с монстра',
    icon: 'fas fa-gem',
    color: '#32cd32',
    requirements: [
      { essenceId: 'ice', baseAmount: 8, multiplier: 1.4 },
      { essenceId: 'chaos', baseAmount: 6, multiplier: 1.5 },
      { essenceId: 'dark', baseAmount: 5, multiplier: 1.3 },
    ],
  },
];
