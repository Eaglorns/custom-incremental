import { computed } from 'vue';
import { useStoreAchievement } from 'stores/achievement';

const storeAchievement = useStoreAchievement();

const achievementLevels = computed(() => storeAchievement.list);

export const achievements = computed(() => [
  {
    id: 'epicLevel',
    title: 'Магнат',
    description: 'Получайте новые уровни за экспоненциальный рост основной валюты',
    icon: 'fa-duotone fa-arrow-up-right-dots',
    color: 'primary',
    level: achievementLevels.value.epicLevel,
    unlocked: achievementLevels.value.epicLevel.gt(0),
    hint: 'Копите число. Каждый новый уровень требует в 1 000 000 000 раз больше.',
  },
  {
    id: 'cpuLevel',
    title: 'Коллекционер CPU',
    description: 'Получайте новые уровни за всё большее количество CPU',
    icon: 'fa-duotone fa-microchip',
    color: 'teal',
    level: achievementLevels.value.cpuLevel,
    unlocked: achievementLevels.value.cpuLevel.gt(0),
    hint: 'Покупайте CPU, чтобы повышать уровень достижения. Каждый новый уровень требует в 100 раз больше CPU.',
  },
  {
    id: 'hddLevel',
    title: 'Коллекционер HDD',
    description: 'Получайте новые уровни за всё большее количество HDD',
    icon: 'fa-duotone fa-hard-drive',
    color: 'blue-grey',
    level: achievementLevels.value.hddLevel,
    unlocked: achievementLevels.value.hddLevel.gt(0),
    hint: 'Покупайте HDD, чтобы повышать уровень достижения. Каждый новый уровень требует в 100 раз больше HDD.',
  },
  {
    id: 'ramLevel',
    title: 'Коллекционер RAM',
    description: 'Получайте новые уровни за всё большее количество RAM',
    icon: 'fa-duotone fa-memory',
    color: 'deep-orange',
    level: achievementLevels.value.ramLevel,
    unlocked: achievementLevels.value.ramLevel.gt(0),
    hint: 'Покупайте RAM, чтобы повышать уровень достижения. Каждый новый уровень требует в 100 раз больше RAM.',
  },
]);
