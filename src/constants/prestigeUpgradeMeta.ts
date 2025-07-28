export interface PrestigeUpgradeType {
  key: string;
  icon: string;
  title: string;
  description: string;
}

export const prestigeUpgradeMeta: PrestigeUpgradeType[] = [
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
    key: 'autoShopCPUValue',
    icon: 'fa-duotone fa-microchip',
    title: 'Прирост CPU',
    description: 'Автоматически повышает значение CPU в магазине каждый тик.',
  },
  {
    key: 'autoShopHDDValue',
    icon: 'fa-duotone fa-hard-drive',
    title: 'Прирост HDD',
    description: 'Автоматически повышает значение HDD в магазине каждый тик.',
  },
  {
    key: 'autoShopRAMValue',
    icon: 'fa-duotone fa-memory',
    title: 'Прирост RAM',
    description: 'Автоматически повышает значение RAM в магазине каждый тик.',
  },
  {
    key: 'autoShopWorkerValue',
    icon: 'fa-duotone fa-users',
    title: 'Прирост работников',
    description: 'Автоматически повышает значение работников в магазине каждый тик.',
  },
  {
    key: 'autoShopCPUMultiply',
    icon: 'fa-duotone fa-microchip',
    title: 'Умножение CPU',
    description: 'Автоматически повышает множитель CPU в магазине каждый тик.',
  },
  {
    key: 'autoShopHDDMultiply',
    icon: 'fa-duotone fa-hard-drive',
    title: 'Умножение HDD',
    description: 'Автоматически повышает множитель HDD в магазине каждый тик.',
  },
  {
    key: 'autoShopRAMMultiply',
    icon: 'fa-duotone fa-memory',
    title: 'Умножение RAM',
    description: 'Автоматически повышает множитель RAM в магазине каждый тик.',
  },
  {
    key: 'autoShopWorkerMultiply',
    icon: 'fa-duotone fa-users',
    title: 'Умножение работников',
    description: 'Автоматически повышает множитель работников в магазине каждый тик.',
  },
];
