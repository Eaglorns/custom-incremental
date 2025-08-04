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
