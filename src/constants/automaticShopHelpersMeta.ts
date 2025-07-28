export interface AutomaticShopHelpersType {
  key: string;
  icon: string;
  title: string;
}

export const automaticShopHelpersMeta: AutomaticShopHelpersType[] = [
  {
    key: 'cpu',
    icon: 'fa-duotone fa-microchip',
    title: 'Скупщик CPU',
  },
  {
    key: 'hdd',
    icon: 'fa-duotone fa-hard-drive',
    title: 'Скупщик HDD',
  },
  {
    key: 'ram',
    icon: 'fa-duotone fa-memory',
    title: 'Скупщик RAM',
  },
  {
    key: 'worker',
    icon: 'fa-duotone fa-users',
    title: 'Скупщик работников',
  },
  {
    key: 'cpuMultiplier',
    icon: 'fa-duotone fa-gauge-circle-bolt',
    title: 'Скупщик множителей CPU',
  },
  {
    key: 'hddMultiplier',
    icon: 'fa-duotone fa-database',
    title: 'Скупщик множителей HDD',
  },
  {
    key: 'ramMultiplier',
    icon: 'fa-duotone fa-bolt',
    title: 'Скупщик множителей RAM',
  },
  {
    key: 'workerMultiplier',
    icon: 'fa-duotone fa-users',
    title: 'Скупщик множителей работников',
  },
];
