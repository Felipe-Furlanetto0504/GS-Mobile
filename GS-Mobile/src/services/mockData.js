export const mockFazendas = [
  {
    id: 1,
    nome: 'Fazenda São João',
    municipio: 'Ribeirão Preto',
    estado: 'SP',
    area_total_hectares: 320,
    talhoes: [
      { id: 1, nome: 'Talhão A1', cultura_plantada: 'Soja', area_hectares: 80, indice_ndvi: 0.72, status_atual: 'Saudável' },
      { id: 2, nome: 'Talhão A2', cultura_plantada: 'Soja', area_hectares: 95, indice_ndvi: 0.31, status_atual: 'Crítico' },
      { id: 3, nome: 'Talhão B1', cultura_plantada: 'Milho', area_hectares: 145, indice_ndvi: 0.55, status_atual: 'Em Observação' },
    ],
  },
  {
    id: 2,
    nome: 'Fazenda Boa Esperança',
    municipio: 'Uberaba',
    estado: 'MG',
    area_total_hectares: 210,
    talhoes: [
      { id: 4, nome: 'Talhão C1', cultura_plantada: 'Cana-de-açúcar', area_hectares: 110, indice_ndvi: 0.68, status_atual: 'Saudável' },
      { id: 5, nome: 'Talhão C2', cultura_plantada: 'Cana-de-açúcar', area_hectares: 100, indice_ndvi: 0.61, status_atual: 'Saudável' },
    ],
  },
];

export const mockAlertas = [
  {
    id: 1,
    talhao_nome: 'Talhão A1',
    fazenda_nome: 'Fazenda São João',
    nivel_urgencia: 'Crítico',
    tipo_alerta: 'Deficiência hídrica severa',
    status: 'Pendente',
    descricao: 'Solo com umidade abaixo de 15%. Irrigação imediata necessária para evitar perda de produção.',
    data_geracao: '30/05/2026',
  },
  {
    id: 2,
    talhao_nome: 'Talhão B3',
    fazenda_nome: 'Fazenda São João',
    nivel_urgencia: 'Alto',
    tipo_alerta: 'Praga identificada',
    status: 'Em análise',
    descricao: 'Presença de lagarta-do-cartucho detectada. Recomenda-se aplicação de defensivo.',
    data_geracao: '29/05/2026',
  },
  {
    id: 3,
    talhao_nome: 'Talhão C2',
    fazenda_nome: 'Fazenda Boa Esperança',
    nivel_urgencia: 'Médio',
    tipo_alerta: 'Nutrição deficiente',
    status: 'Pendente',
    descricao: 'Análise foliar indica baixo teor de nitrogênio. Verificar plano de adubação.',
    data_geracao: '28/05/2026',
  },
  {
    id: 4,
    talhao_nome: 'Talhão D1',
    fazenda_nome: 'Fazenda Boa Esperança',
    nivel_urgencia: 'Baixo',
    tipo_alerta: 'Variação de temperatura',
    status: 'Monitorando',
    descricao: 'Temperatura noturna abaixo da média esperada para o período. Acompanhar por 48h.',
    data_geracao: '27/05/2026',
  },
];
