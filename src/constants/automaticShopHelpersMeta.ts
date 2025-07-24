export interface AutomaticShopHelpersType {
  key: string;
  icon: string;
  title: string;
}

export const automaticShopHelpersMeta: AutomaticShopHelpersType[] = [
  {
    key: 'cpu',
    icon: 'fa-duotone fa-microchip',
    title: 'Скупщик процессоров',
  },
  {
    key: 'hdd',
    icon: 'fa-duotone fa-hard-drive',
    title: 'Скупщик жёстких дисков',
  },
  {
    key: 'ram',
    icon: 'fa-duotone fa-memory',
    title: 'Скупщик оперативной памяти',
  },
  {
    key: 'cpuMultiplier',
    icon: 'fa-duotone fa-gauge-circle-bolt',
    title: 'Скупщик множителей процессоров',
  },
  {
    key: 'hddMultiplier',
    icon: 'fa-duotone fa-database',
    title: 'Скупщик множителей жёстких дисков',
  },
  {
    key: 'ramMultiplier',
    icon: 'fa-duotone fa-bolt',
    title: 'Скупщик множителей оперативной памяти',
  },
];
