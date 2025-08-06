export interface PrestigeUpgradeType {
  key: string;
  icon: string;
  title: string;
  description: string;
}

export const prestigeUpgradeMeta: PrestigeUpgradeType[] = [
  {
    key: 'prestigeBonus',
    icon: 'fa-arrow-up-right-dots',
    title: 'Усиление бонуса престижа',
    description: 'Увеличивает множитель бонуса от престижа на 1% за уровень.',
  },
  {
    key: 'prestigeSoftening',
    icon: 'fa-wave-sine',
    title: 'Ослабление функции престижа',
    description: 'Смягчает формулу престижа, делая прирост более плавным.',
  },
  {
    key: 'prestigeBuyValueCount',
    icon: 'fa-cart-plus',
    title: 'Увеличение максимального количества покупки значения за клик.',
    description: 'Увеличивает максимальное количество покупок значения за клик.',
  },
  {
    key: 'prestigeBuyValueMultiply',
    icon: 'fa-xmark',
    title: 'Увеличение максимального количества покупки множителя за клик.',
    description: 'Увеличивает максимальное количество покупок множителя за клик.',
  },
  {
    key: 'autoShopCPUValue',
    icon: 'fa-microchip',
    title: 'Прирост CPU',
    description: 'Автоматически повышает значение CPU в магазине каждый тик.',
  },
  {
    key: 'autoShopHDDValue',
    icon: 'fa-hard-drive',
    title: 'Прирост HDD',
    description: 'Автоматически повышает значение HDD в магазине каждый тик.',
  },
  {
    key: 'autoShopRAMValue',
    icon: 'fa-memory',
    title: 'Прирост RAM',
    description: 'Автоматически повышает значение RAM в магазине каждый тик.',
  },
  {
    key: 'autoShopWorkerValue',
    icon: 'fa-users',
    title: 'Прирост работников',
    description: 'Автоматически повышает значение работников в магазине каждый тик.',
  },
  {
    key: 'autoShopCPUMultiply',
    icon: 'fa-microchip',
    title: 'Умножение CPU',
    description: 'Автоматически повышает множитель CPU в магазине каждый тик.',
  },
  {
    key: 'autoShopHDDMultiply',
    icon: 'fa-hard-drive',
    title: 'Умножение HDD',
    description: 'Автоматически повышает множитель HDD в магазине каждый тик.',
  },
  {
    key: 'autoShopRAMMultiply',
    icon: 'fa-memory',
    title: 'Умножение RAM',
    description: 'Автоматически повышает множитель RAM в магазине каждый тик.',
  },
  {
    key: 'autoShopWorkerMultiply',
    icon: 'fa-users',
    title: 'Умножение работников',
    description: 'Автоматически повышает множитель работников в магазине каждый тик.',
  },
];
