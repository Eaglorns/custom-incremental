export interface HelperMeta {
  key: string;
  icon: string;
  title: string;
  description: string;
}

export const helpersMeta: HelperMeta[] = [
  {
    key: 'cpu',
    icon: 'fa-duotone fa-microchip',
    title: 'Скупщик процессоров',
    description: 'Находит выгодные предложения и автоматически закупает процессоры.',
  },
  {
    key: 'hdd',
    icon: 'fa-duotone fa-hard-drive',
    title: 'Скупщик жёстких дисков',
    description: 'Знает все тайные склады и всегда находит лучшие жёсткие диски для вашей системы.',
  },
  {
    key: 'ram',
    icon: 'fa-duotone fa-memory',
    title: 'Скупщик памяти',
    description: 'Постоянно мониторит рынок и пополняет запасы оперативной памяти.',
  },
];
