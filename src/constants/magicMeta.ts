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

// Метаданные эссенций
export const ESSENCE_META: EssenceMeta[] = [
  { id: 'fire', name: 'Огонь', icon: 'fas fa-fire', color: '#ff4444' },
  { id: 'water', name: 'Вода', icon: 'fas fa-droplet', color: '#4444ff' },
  { id: 'earth', name: 'Земля', icon: 'fas fa-mountain', color: '#8b4513' },
  { id: 'air', name: 'Воздух', icon: 'fas fa-wind', color: '#87ceeb' },
  { id: 'light', name: 'Свет', icon: 'fas fa-sun', color: '#ffff00' },
  { id: 'dark', name: 'Тьма', icon: 'fas fa-moon', color: '#4b0082' },
  { id: 'arcane', name: 'Магия', icon: 'fas fa-star', color: '#9932cc' },
  { id: 'nature', name: 'Природа', icon: 'fas fa-leaf', color: '#228b22' },
  { id: 'ice', name: 'Лёд', icon: 'fas fa-snowflake', color: '#00ffff' },
  { id: 'lightning', name: 'Молния', icon: 'fas fa-bolt', color: '#ffd700' },
  { id: 'blood', name: 'Кровь', icon: 'fas fa-heart', color: '#dc143c' },
  { id: 'spirit', name: 'Дух', icon: 'fas fa-ghost', color: '#dda0dd' },
  { id: 'chaos', name: 'Хаос', icon: 'fas fa-explosion', color: '#8b0000' },
  { id: 'order', name: 'Порядок', icon: 'fas fa-balance-scale', color: '#000080' },
  { id: 'time', name: 'Время', icon: 'fas fa-clock', color: '#ff8c00' },
  { id: 'space', name: 'Пространство', icon: 'fas fa-expand', color: '#663399' },
  { id: 'life', name: 'Жизнь', icon: 'fas fa-seedling', color: '#32cd32' },
  { id: 'death', name: 'Смерть', icon: 'fas fa-skull-crossbones', color: '#2f4f4f' },
  { id: 'crystal', name: 'Кристалл', icon: 'fas fa-gem', color: '#48d1cc' },
  { id: 'metal', name: 'Металл', icon: 'fas fa-hammer', color: '#696969' },
  { id: 'poison', name: 'Яд', icon: 'fas fa-flask-poison', color: '#adff2f' },
  { id: 'shadow', name: 'Тень', icon: 'fas fa-mask', color: '#36454f' },
];

// Метаданные рун
export const RUNE_META: RuneMeta[] = [
  // Базовые руны (1-2 эссенции)
  {
    id: 'strength',
    name: 'Руна Силы',
    description: 'Увеличивает физическую мощь',
    icon: 'fas fa-fist-raised',
    color: '#ff6b35',
    requirements: [
      { essenceId: 'fire', baseAmount: 10, multiplier: 1.5 },
      { essenceId: 'earth', baseAmount: 5, multiplier: 1.3 },
    ],
  },
  {
    id: 'wisdom',
    name: 'Руна Мудрости',
    description: 'Увеличивает магическую силу',
    icon: 'fas fa-brain',
    color: '#4ecdc4',
    requirements: [
      { essenceId: 'arcane', baseAmount: 8, multiplier: 1.4 },
      { essenceId: 'light', baseAmount: 6, multiplier: 1.2 },
    ],
  },
  {
    id: 'speed',
    name: 'Руна Скорости',
    description: 'Увеличивает скорость действий',
    icon: 'fas fa-running',
    color: '#45b7d1',
    requirements: [
      { essenceId: 'air', baseAmount: 12, multiplier: 1.6 },
      { essenceId: 'lightning', baseAmount: 4, multiplier: 1.8 },
    ],
  },
  {
    id: 'vitality',
    name: 'Руна Жизни',
    description: 'Увеличивает здоровье',
    icon: 'fas fa-heart-pulse',
    color: '#27ae60',
    requirements: [{ essenceId: 'life', baseAmount: 8, multiplier: 1.4 }],
  },
  {
    id: 'protection',
    name: 'Руна Защиты',
    description: 'Увеличивает сопротивление',
    icon: 'fas fa-shield-alt',
    color: '#8e44ad',
    requirements: [
      { essenceId: 'earth', baseAmount: 15, multiplier: 1.2 },
      { essenceId: 'metal', baseAmount: 8, multiplier: 1.3 },
    ],
  },
  {
    id: 'frost',
    name: 'Руна Мороза',
    description: 'Замедляет врагов',
    icon: 'fas fa-icicles',
    color: '#3498db',
    requirements: [
      { essenceId: 'ice', baseAmount: 10, multiplier: 1.6 },
      { essenceId: 'water', baseAmount: 6, multiplier: 1.3 },
    ],
  },
  {
    id: 'poison',
    name: 'Руна Яда',
    description: 'Отравляет врагов',
    icon: 'fas fa-biohazard',
    color: '#8fbc8f',
    requirements: [
      { essenceId: 'poison', baseAmount: 7, multiplier: 1.5 },
      { essenceId: 'nature', baseAmount: 5, multiplier: 1.2 },
    ],
  },
  {
    id: 'crystal',
    name: 'Руна Кристалла',
    description: 'Увеличивает точность',
    icon: 'fas fa-gem',
    color: '#48d1cc',
    requirements: [{ essenceId: 'crystal', baseAmount: 6, multiplier: 1.4 }],
  },

  // Продвинутые руны (3 эссенции)
  {
    id: 'vampire',
    name: 'Руна Вампиризма',
    description: 'Восстанавливает здоровье от урона',
    icon: 'fas fa-vampire-bite',
    color: '#722f37',
    requirements: [
      { essenceId: 'blood', baseAmount: 6, multiplier: 2.0 },
      { essenceId: 'dark', baseAmount: 8, multiplier: 1.5 },
      { essenceId: 'life', baseAmount: 4, multiplier: 1.3 },
    ],
  },
  {
    id: 'storm',
    name: 'Руна Бури',
    description: 'Призывает молнии и ветер',
    icon: 'fas fa-cloud-bolt',
    color: '#1e90ff',
    requirements: [
      { essenceId: 'lightning', baseAmount: 8, multiplier: 1.6 },
      { essenceId: 'air', baseAmount: 10, multiplier: 1.4 },
      { essenceId: 'water', baseAmount: 6, multiplier: 1.2 },
    ],
  },
  {
    id: 'necromancy',
    name: 'Руна Некромантии',
    description: 'Воскрешает мертвых',
    icon: 'fas fa-skull',
    color: '#2f4f4f',
    requirements: [
      { essenceId: 'death', baseAmount: 5, multiplier: 1.8 },
      { essenceId: 'dark', baseAmount: 7, multiplier: 1.5 },
      { essenceId: 'spirit', baseAmount: 4, multiplier: 1.6 },
    ],
  },
  {
    id: 'forge',
    name: 'Руна Кузнеца',
    description: 'Улучшает оружие и броню',
    icon: 'fas fa-hammer',
    color: '#ff4500',
    requirements: [
      { essenceId: 'fire', baseAmount: 12, multiplier: 1.4 },
      { essenceId: 'metal', baseAmount: 10, multiplier: 1.3 },
      { essenceId: 'earth', baseAmount: 8, multiplier: 1.2 },
    ],
  },
  {
    id: 'healing',
    name: 'Руна Исцеления',
    description: 'Мощное восстановление здоровья',
    icon: 'fas fa-heart-circle-plus',
    color: '#ff69b4',
    requirements: [
      { essenceId: 'life', baseAmount: 10, multiplier: 1.5 },
      { essenceId: 'light', baseAmount: 8, multiplier: 1.4 },
      { essenceId: 'nature', baseAmount: 12, multiplier: 1.3 },
    ],
  },

  // Эпические руны (4-5 эссенций)
  {
    id: 'elemental',
    name: 'Руна Стихий',
    description: 'Контролирует все элементы',
    icon: 'fas fa-magic',
    color: '#ff6347',
    requirements: [
      { essenceId: 'fire', baseAmount: 8, multiplier: 1.3 },
      { essenceId: 'water', baseAmount: 8, multiplier: 1.3 },
      { essenceId: 'earth', baseAmount: 8, multiplier: 1.3 },
      { essenceId: 'air', baseAmount: 8, multiplier: 1.3 },
    ],
  },
  {
    id: 'chaos_order',
    name: 'Руна Равновесия',
    description: 'Баланс между хаосом и порядком',
    icon: 'fas fa-yin-yang',
    color: '#800080',
    requirements: [
      { essenceId: 'chaos', baseAmount: 3, multiplier: 2.0 },
      { essenceId: 'order', baseAmount: 3, multiplier: 2.0 },
      { essenceId: 'light', baseAmount: 5, multiplier: 1.4 },
      { essenceId: 'dark', baseAmount: 5, multiplier: 1.4 },
    ],
  },
  {
    id: 'spacetime',
    name: 'Руна Пространства-Времени',
    description: 'Искажает реальность',
    icon: 'fas fa-infinity',
    color: '#4b0082',
    requirements: [
      { essenceId: 'time', baseAmount: 2, multiplier: 2.5 },
      { essenceId: 'space', baseAmount: 3, multiplier: 2.0 },
      { essenceId: 'arcane', baseAmount: 6, multiplier: 1.5 },
      { essenceId: 'crystal', baseAmount: 4, multiplier: 1.6 },
    ],
  },
  {
    id: 'ultimate',
    name: 'Руна Превосходства',
    description: 'Высшая магическая сила',
    icon: 'fas fa-crown',
    color: '#ffd700',
    requirements: [
      { essenceId: 'arcane', baseAmount: 10, multiplier: 1.8 },
      { essenceId: 'spirit', baseAmount: 5, multiplier: 2.0 },
      { essenceId: 'crystal', baseAmount: 6, multiplier: 1.7 },
      { essenceId: 'light', baseAmount: 8, multiplier: 1.5 },
      { essenceId: 'order', baseAmount: 3, multiplier: 2.2 },
    ],
  },
  {
    id: 'shadow_master',
    name: 'Руна Владыки Теней',
    description: 'Контроль над тьмой и тенями',
    icon: 'fas fa-eye-evil',
    color: '#191970',
    requirements: [
      { essenceId: 'shadow', baseAmount: 8, multiplier: 1.6 },
      { essenceId: 'dark', baseAmount: 10, multiplier: 1.5 },
      { essenceId: 'death', baseAmount: 4, multiplier: 1.8 },
      { essenceId: 'chaos', baseAmount: 3, multiplier: 2.0 },
    ],
  },
];
