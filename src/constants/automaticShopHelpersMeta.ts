export interface AutomaticShopHelpersType {
  key: string;
  icon: string;
  title: string;
}

export const automaticShopHelpersMeta: AutomaticShopHelpersType[] = [
  {
    key: 'cpu',
    icon: 'fa-microchip',
    title: 'Скупщик CPU',
  },
  {
    key: 'hdd',
    icon: 'fa-hard-drive',
    title: 'Скупщик HDD',
  },
  {
    key: 'ram',
    icon: 'fa-memory',
    title: 'Скупщик RAM',
  },
  {
    key: 'worker',
    icon: 'fa-users',
    title: 'Скупщик работников',
  },
  {
    key: 'cpuMultiplier',
    icon: 'fa-gauge-circle-bolt',
    title: 'Скупщик множителей CPU',
  },
  {
    key: 'hddMultiplier',
    icon: 'fa-database',
    title: 'Скупщик множителей HDD',
  },
  {
    key: 'ramMultiplier',
    icon: 'fa-bolt',
    title: 'Скупщик множителей RAM',
  },
  {
    key: 'workerMultiplier',
    icon: 'fa-users',
    title: 'Скупщик множителей работников',
  },
];
