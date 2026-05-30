export const Colors = {
  fundo:          '#1A1A1A',
  fundoCard:      '#242424',
  primario:       '#C8A96E',
  primarioEscuro: '#2A1F0E',
  primarioClaro:  '#E8C98E',
  textoPrimario:  '#F0EDE6',
  textoSub:       '#888888',
  textoTercio:    '#555555',
  critico:        '#EF4444',
  observacao:     '#F59E0B',
  saudavel:       '#22C55E',
};

export function corStatus(status) {
  switch (status) {
    case 'Crítico':        return Colors.critico;
    case 'Em Observação':  return Colors.observacao;
    default:               return Colors.saudavel;
  }
}
