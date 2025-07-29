import { computed } from 'vue';
import { useStoreAchievement } from 'stores/achievement';
import type Decimal from 'break_eternity.js';

const storeAchievement = useStoreAchievement();

const achievementLevels = computed(() => storeAchievement.list);

export interface AchievementsType {
  key: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  level: Decimal;
  unlocked: boolean;
  hint: string;
}

export const achievements = computed<AchievementsType[]>(() => [
  {
    key: 'epicNumberValue',
    title: 'Экспонента',
    description: 'Получайте новые уровни за экспоненциальный рост основной валюты',
    icon: 'fa-duotone fa-arrow-up-right-dots',
    color: 'primary',
    level: achievementLevels.value.epicNumberValue,
    unlocked: achievementLevels.value.epicNumberValue.gt(0),
    hint: 'Копите число. Каждый новый уровень требует в 10 раз больше.',
  },
  {
    key: 'shopCpuValue',
    title: 'Коллекционер CPU',
    description: 'Получайте новые уровни за большее количество CPU',
    icon: 'fa-duotone fa-microchip',
    color: 'teal',
    level: achievementLevels.value.shopCpuValue,
    unlocked: achievementLevels.value.shopCpuValue.gt(0),
    hint: 'Покупайте CPU, чтобы повышать уровень достижения. Каждый новый уровень требует в 5 раз больше CPU.',
  },
  {
    key: 'shopHddValue',
    title: 'Коллекционер HDD',
    description: 'Получайте новые уровни за большее количество HDD',
    icon: 'fa-duotone fa-hard-drive',
    color: 'blue-grey',
    level: achievementLevels.value.shopHddValue,
    unlocked: achievementLevels.value.shopHddValue.gt(0),
    hint: 'Покупайте HDD, чтобы повышать уровень достижения. Каждый новый уровень требует в 4 раза больше HDD.',
  },
  {
    key: 'shopRamValue',
    title: 'Коллекционер RAM',
    description: 'Получайте новые уровни за большее количество RAM',
    icon: 'fa-duotone fa-memory',
    color: 'deep-orange',
    level: achievementLevels.value.shopRamValue,
    unlocked: achievementLevels.value.shopRamValue.gt(0),
    hint: 'Покупайте RAM, чтобы повышать уровень достижения. Каждый новый уровень требует в 3 раза больше RAM.',
  },
  {
    key: 'shopRamValue',
    title: 'Коллекционер работников',
    description: 'Получайте новые уровни за большее количество работников',
    icon: 'fa-duotone fa-memory',
    color: 'deep-orange',
    level: achievementLevels.value.shopWorkerValue,
    unlocked: achievementLevels.value.shopWorkerValue.gt(0),
    hint: 'Покупайте работников, чтобы повышать уровень достижения. Каждый новый уровень требует в 2 раза больше работников.',
  },
  {
    key: 'prestigePoints',
    title: 'Мастер сброса',
    description: 'Получайте новые уровни за большее количество очков престижа',
    icon: 'fa-duotone fa-trophy',
    color: 'purple',
    level: achievementLevels.value.prestigePoints,
    unlocked: achievementLevels.value.prestigePoints.gt(0),
    hint: 'Получайте очки престижа, чтобы повышать уровень достижения. Каждый новый уровень требует в 1.5 раз больше очков престижа.',
  },
  {
    key: 'researchPoints',
    title: 'Учёный',
    description: 'Получайте новые уровни за большее количество очков исследований',
    icon: 'fa-duotone fa-flask',
    color: 'green',
    level: achievementLevels.value.researchPoints,
    unlocked: achievementLevels.value.researchPoints.gt(0),
    hint: 'Получайте очки исследований, чтобы повышать уровень достижения. Каждый новый уровень требует в 2 раза больше очков исследований.',
  },
  {
    key: 'shopPoints',
    title: 'Магнат',
    description: 'Получайте новые уровни за большее количество монет.',
    icon: 'fa-duotone fa-store',
    color: 'blue',
    level: achievementLevels.value.shopPoints,
    unlocked: achievementLevels.value.shopPoints.gt(0),
    hint: 'Получайте монеты, чтобы повышать уровень достижения. Каждый новый уровень требует в 4 раза больше монет.',
  },
]);
