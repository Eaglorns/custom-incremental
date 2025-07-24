export interface HelperMeta {
  key: string;
  icon: string;
  title: string;
  description: string;
}

export const helpersMeta: HelperMeta[] = [
  {
    key: 'prestigeBonus',
    icon: 'fa-duotone fa-arrow-up-right-dots',
    title: 'Усиление бонуса престижа',
    description: 'Увеличивает множитель бонуса от престижа на 1% за уровень.',
  },
  {
    key: 'prestigeSoftening',
    icon: 'fa-duotone fa-wave-sine',
    title: 'Ослабление функции престижа',
    description: 'Смягчает формулу престижа, делая прирост более плавным.',
  },
  {
    key: 'autoShopCPU',
    icon: 'fa-duotone fa-microchip',
    title: 'Прирост CPU',
    description: 'Автоматически повышает значение CPU в магазине каждый тик.',
  },
  {
    key: 'autoShopHard',
    icon: 'fa-duotone fa-hard-drive',
    title: 'Прирост HDD',
    description: 'Автоматически повышает значение HDD в магазине каждый тик.',
  },
  {
    key: 'autoShopRAM',
    icon: 'fa-duotone fa-memory',
    title: 'Прирост RAM',
    description: 'Автоматически повышает значение RAM в магазине каждый тик.',
  },
];
