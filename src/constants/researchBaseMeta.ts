export interface ResearchBaseType {
  key: string;
  icon: string;
  title: string;
  description: string;
}

export const researchBaseMeta: ResearchBaseType[] = [
  {
    key: 'cpuPow',
    icon: 'fa-duotone fa-microchip',
    title: 'Ускорение процессора',
    description: 'Процессоры увеличивают прирост числа в степени. За каждое улучшение +0.001',
  },
  {
    key: 'hddPow',
    icon: 'fa-duotone fa-hard-drive',
    title: 'Улучшение жёстких дисков',
    description:
      'Жёсткие диски увеличивает прирост хранилища в степени. За каждое улучшение +0.001',
  },
  {
    key: 'ramPow',
    icon: 'fa-duotone fa-memory',
    title: 'Расширение оперативной памяти',
    description:
      'Оперативная память увеличивает прирост хранилища в степени. За каждое улучшение +0.001',
  },
  {
    key: 'shopCostMultiplierDecrease',
    icon: 'fa-duotone fa-dollar-sign',
    title: 'Оптимизация множителей апгрейдов',
    description: 'Снижает стоимость апгрейдов множителей. За каждое улучшение на 5%',
  },
  {
    key: 'epicNumberMultiplierDecrease',
    icon: 'fa-duotone fa-feather',
    title: 'Ослабление замедления множителя числа',
    description:
      'Уменьшает замедление роста множителя числа. Каждый уровень ослабляет эффект логарифма на 10%',
  },
  {
    key: 'researchTimeMultiplierDecrease',
    icon: 'fa-duotone fa-feather',
    title: 'Ослабление замедления множителя времени исследований',
    description:
      'Уменьшает замедление роста множителя времени исследований. Каждый уровень ослабляет эффект логарифма на 10%',
  },
  {
    key: 'researchScientistsChance',
    icon: 'fa-duotone fa-dice',
    title: 'Увеличение шанса улучшения характеристик учёных',
    description: 'Увеличивает шанс получить характеристики учёным за тик на 1% за каждое улучшение',
  },
  {
    key: 'researchScientistsMultiplierStats',
    icon: 'fa-duotone fa-chart-line',
    title: 'Увеличение прироста характеристик учёных',
    description: 'Увеличивает количество получаемых характеристик на 10% за каждый уровень',
  },
  {
    key: 'researchScientistsMultiplierExperience',
    icon: 'fa-duotone fa-graduation-cap',
    title: 'Увеличение прироста опыта учёных',
    description: 'Увеличивает количество получаемого опыта на 10% за каждый уровень',
  },
  {
    key: 'shopMultiplierChanceReturn',
    icon: 'fa-duotone fa-dice-d20',
    title: 'Шанс при прокачке множителя магазина не использовать ресурс',
    description:
      'За каждый уровень к шансу не потратить ресурс при прокачке множителя добавляется 1%',
  },
];
