import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  StatusBar, RefreshControl, Alert,
} from 'react-native';
import { Colors } from '../constants/colors';
import { mockAlertas } from '../services/mockData';

function corUrgencia(urgencia) {
  switch (urgencia) {
    case 'Crítico': return Colors.critico;
    case 'Alto':    return '#F97316';
    case 'Médio':   return Colors.observacao;
    default:        return Colors.saudavel;
  }
}
export default function EstadoPlan() {
  const [alertas,    setAlertas]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = async () => {
    try {
      await new Promise((r) => setTimeout(r, 500));
      setAlertas(mockAlertas);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os alertas.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { carregar(); }, []);
  const onRefresh = useCallback(() => { setRefreshing(true); carregar(); }, []);

  function confirmarResolver(alerta) {
    Alert.alert('Resolver', `Marcar alerta de "${alerta.talhao_nome}" como resolvido?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Resolver', onPress: async () => {
          setAlertas((prev) => prev.filter((a) => a.id !== alerta.id));
        },
      },
    ]);
  }

  const abertos    = alertas.filter((a) => a.status !== 'Resolvido');
  const criticos   = abertos.filter((a) => a.nivel_urgencia === 'Crítico').length;

  function renderItem({ item }) {
    return (
      <View style={[s.card, { borderLeftColor: corUrgencia(item.nivel_urgencia) }]}>
        <View style={s.cardTop}>
          <View style={{ flex: 1 }}>
            <Text style={s.cardTalhao}>{item.talhao_nome}</Text>
            <Text style={s.cardFazenda}>{item.fazenda_nome}</Text>
          </View>
          <View style={[s.badge, { borderColor: corUrgencia(item.nivel_urgencia) }]}>
            <Text style={[s.badgeTexto, { color: corUrgencia(item.nivel_urgencia) }]}>{item.nivel_urgencia}</Text>
          </View>
        </View>

        <View style={s.tipoRow}>
          <Text style={s.tipoTexto}>⚠️ {item.tipo_alerta}</Text>
          <Text style={s.statusTexto}>{item.status}</Text>
        </View>

        <Text style={s.descricao}>{item.descricao}</Text>

        <View style={s.rodape}>
          <Text style={s.data}>{item.data_geracao}</Text>
          <TouchableOpacity onPress={() => confirmarResolver(item)} style={s.btnResolver}>
            <Text style={s.btnResolverTexto}>✓ Resolver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primarioEscuro} />

      <View style={s.header}>
        <View style={s.divider} />
        <Text style={s.titulo}>ALERTAS</Text>
        {criticos > 0 && (
          <View style={s.criticoBanner}>
            <Text style={s.criticoTexto}>🔴 {criticos} alerta{criticos > 1 ? 's' : ''} crítico{criticos > 1 ? 's' : ''}</Text>
          </View>
        )}
      </View>

      {loading ? (
        <View style={s.centrado}><Text style={s.loadingTexto}>Carregando alertas...</Text></View>
      ) : (
        <FlatList
          data={abertos}
          keyExtractor={(i) => String(i.id)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primario} />}
          ListEmptyComponent={
            <View style={s.centrado}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>✅</Text>
              <Text style={s.emptyTexto}>Nenhum alerta ativo.</Text>
              <Text style={s.emptySub}>Todas as lavouras estão saudáveis.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.fundo,
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingTexto: {
    color: Colors.textoSub,
    fontSize: 13,
    letterSpacing: 1,
  },
  emptyTexto: {
    color: Colors.textoSub,
    fontSize: 15,
    fontWeight: '700',
  },
  emptySub: {
    color: Colors.textoTercio,
    fontSize: 12,
    marginTop: 4,
  },
  header: {
    paddingTop: 64,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  divider: {
    width: 40,
    height: 3,
    backgroundColor: Colors.primario,
    marginBottom: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textoPrimario,
    letterSpacing: 5,
  },
  criticoBanner: {
    backgroundColor: '#3b0f0f',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.critico,
    alignSelf: 'flex-start',
  },
  criticoTexto: {
    color: Colors.critico,
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    backgroundColor: Colors.fundoCard,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTalhao: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textoPrimario,
  },
  cardFazenda: {
    fontSize: 11,
    color: Colors.textoSub,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 14,
    borderWidth: 1,
  },
  badgeTexto: {
    fontSize: 10,
    fontWeight: '700',
  },
  tipoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  tipoTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textoPrimario,
  },
  statusTexto: {
    fontSize: 11,
    color: Colors.textoSub,
  },
  descricao: {
    fontSize: 12,
    color: Colors.textoSub,
    lineHeight: 18,
    marginBottom: 10,
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  data: {
    fontSize: 11,
    color: Colors.textoTercio,
  },
  btnResolver: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: Colors.primarioEscuro,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.primario,
  },
  btnResolverTexto: {
    fontSize: 11,
    color: Colors.primarioClaro,
    fontWeight: '700',
  },
});