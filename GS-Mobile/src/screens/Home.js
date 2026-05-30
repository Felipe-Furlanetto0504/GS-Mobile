// src/screens/Home.js  (Fazendas — tela principal)
import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  StatusBar, RefreshControl, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, corStatus } from '../constants/colors';
import { mockFazendas } from '../services/mockData';
// import { getFazendas } from '../services/api';

export default function Home({ navigation }) {
  const [fazendas,   setFazendas]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = async () => {
    try {
      // const { data } = await getFazendas();
      // setFazendas(data);
      await new Promise((r) => setTimeout(r, 600));
      setFazendas(mockFazendas);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar as fazendas.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { carregar(); }, []);
  const onRefresh = useCallback(() => { setRefreshing(true); carregar(); }, []);

  async function sair() {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair', style: 'destructive', onPress: async () => {
          await AsyncStorage.removeItem('@agroguard:token');
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  }

  function statusFazenda(talhoes) {
    if (talhoes.some((t) => t.status_atual === 'Crítico'))       return 'Crítico';
    if (talhoes.some((t) => t.status_atual === 'Em Observação')) return 'Em Observação';
    return 'Saudável';
  }

  function renderTalhao(t) {
    return (
      <View key={t.id} style={[s.talhaoRow, { borderLeftColor: corStatus(t.status_atual) }]}>
        <View style={[s.talhaoDot, { backgroundColor: corStatus(t.status_atual) }]} />
        <View style={{ flex: 1 }}>
          <Text style={s.talhaoNome}>{t.nome}</Text>
          <Text style={s.talhaoSub}>{t.cultura_plantada} · {t.area_hectares} ha</Text>
        </View>
        <View style={s.ndviWrap}>
          <Text style={s.ndviLabel}>NDVI</Text>
          <Text style={[s.ndviValor, { color: corStatus(t.status_atual) }]}>
            {t.indice_ndvi.toFixed(2)}
          </Text>
        </View>
      </View>
    );
  }

  function renderFazenda({ item }) {
    const st     = statusFazenda(item.talhoes);
    const criticos = item.talhoes.filter((t) => t.status_atual === 'Crítico').length;
    return (
      <View style={s.card}>
        <View style={s.cardTop}>
          <View style={{ flex: 1 }}>
            <Text style={s.cardNome}>{item.nome}</Text>
            <Text style={s.cardLocal}>📍 {item.municipio}, {item.estado}</Text>
          </View>
          <View style={[s.badge, { backgroundColor: corStatus(st) + '22', borderColor: corStatus(st) }]}>
            <Text style={[s.badgeTexto, { color: corStatus(st) }]}>{st}</Text>
          </View>
        </View>

        <View style={s.metricas}>
          {[
            { v: item.area_total_hectares, l: 'ha total' },
            { v: item.talhoes.length,      l: 'talhões' },
            { v: criticos,                 l: 'críticos', c: criticos > 0 ? Colors.critico : null },
          ].map(({ v, l, c }) => (
            <View key={l} style={s.metricaItem}>
              <Text style={[s.metricaValor, c && { color: c }]}>{v}</Text>
              <Text style={s.metricaLabel}>{l}</Text>
            </View>
          ))}
        </View>

        <Text style={s.secaoLabel}>TALHÕES</Text>
        {item.talhoes.map(renderTalhao)}
      </View>
    );
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.fundo} />

      <View style={s.header}>
        <View style={s.headerTop}>
          <View style={s.divider} />
          <TouchableOpacity onPress={sair}>
            <Text style={s.sairTexto}>Sair</Text>
          </TouchableOpacity>
        </View>
        <Text style={s.titulo}>FAZENDAS</Text>
        <Text style={s.subtitulo}>{fazendas.length} fazenda{fazendas.length !== 1 ? 's' : ''} monitorada{fazendas.length !== 1 ? 's' : ''}</Text>
      </View>

      {loading ? (
        <View style={s.centrado}><Text style={s.loadingTexto}>Carregando fazendas...</Text></View>
      ) : (
        <FlatList
          data={fazendas}
          keyExtractor={(i) => String(i.id)}
          renderItem={renderFazenda}
          contentContainerStyle={s.lista}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primario} />}
          ListEmptyComponent={<View style={s.centrado}><Text style={s.emptyTexto}>Nenhuma fazenda cadastrada.</Text></View>}
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
    color: Colors.textoTercio,
    fontSize: 14,
  },
  header: {
    paddingTop: 64,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    width: 40,
    height: 3,
    backgroundColor: Colors.primario,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textoPrimario,
    letterSpacing: 5,
  },
  subtitulo: {
    fontSize: 11,
    color: Colors.textoSub,
    marginTop: 4,
    letterSpacing: 1,
  },
  sairTexto: {
    fontSize: 12,
    color: Colors.primarioClaro,
    fontWeight: '700',
    letterSpacing: 1,
  },
  lista: {
    padding: 16,
    gap: 14,
  },
  card: {
    backgroundColor: Colors.fundoCard,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primario,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardNome: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textoPrimario,
  },
  cardLocal: {
    fontSize: 11,
    color: Colors.textoSub,
    marginTop: 3,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    marginLeft: 8,
  },
  badgeTexto: {
    fontSize: 11,
    fontWeight: '700',
  },
  metricas: {
    flexDirection: 'row',
    backgroundColor: Colors.fundo,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  metricaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricaValor: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textoPrimario,
  },
  metricaLabel: {
    fontSize: 10,
    color: Colors.textoSub,
    marginTop: 2,
  },
  secaoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primario,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  talhaoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.fundo,
    borderRadius: 8,
    borderLeftWidth: 3,
    padding: 10,
    marginBottom: 6,
    gap: 10,
  },
  talhaoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  talhaoNome: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textoPrimario,
  },
  talhaoSub: {
    fontSize: 11,
    color: Colors.textoSub,
    marginTop: 2,
  },
  ndviWrap: {
    alignItems: 'flex-end',
  },
  ndviLabel: {
    fontSize: 9,
    color: Colors.textoTercio,
  },
  ndviValor: {
    fontSize: 16,
    fontWeight: '900',
  },
});
