import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, RefreshControl, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/colors';

export default function Home({ navigation }) {
  const [fazenda,    setFazenda]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem('INFORMACOES');
      if (raw) setFazenda(JSON.parse(raw));
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const onRefresh = useCallback(() => { setRefreshing(true); carregar(); }, [carregar]);

  async function sair() {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair', style: 'destructive', onPress: async () => {
          await AsyncStorage.removeItem('Logado');
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
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
        <Text style={s.subtitulo}>{fazenda ? '1 fazenda monitorada' : 'Nenhuma fazenda cadastrada'}</Text>
      </View>

      {loading ? (
        <View style={s.centrado}>
          <Text style={s.loadingTexto}>Carregando...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={s.lista}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primario} />}
        >
          {fazenda ? (
            <View style={s.card}>
              <View style={s.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={s.cardNome}>{fazenda.nomeFazenda}</Text>
                  <Text style={s.cardDono}>👤 {fazenda.nome}</Text>
                </View>
                <View style={s.badge}>
                  <Text style={s.badgeTexto}>Saudável</Text>
                </View>
              </View>

              <Text style={s.secaoLabel}>TALHÕES</Text>
              <View style={s.talhaoVazio}>
                <Text style={s.talhaoVazioTexto}>Nenhum talhão cadastrado.</Text>
              </View>
            </View>
          ) : (
            <View style={s.centrado}>
              <Text style={s.emptyTexto}>Nenhuma fazenda cadastrada.</Text>
            </View>
          )}
        </ScrollView>
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
    marginBottom: 16,
  },
  cardNome: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textoPrimario,
  },
  cardDono: {
    fontSize: 11,
    color: Colors.textoSub,
    marginTop: 3,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.saudavel,
    backgroundColor: Colors.saudavel + '22',
    marginLeft: 8,
  },
  badgeTexto: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.saudavel,
  },
  secaoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primario,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  talhaoVazio: {
    backgroundColor: Colors.fundo,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  talhaoVazioTexto: {
    fontSize: 12,
    color: Colors.textoTercio,
  },
});
