import { useEffect, useState, useCallback } from "react";
import {
  Text, View, StyleSheet, StatusBar,
  TouchableOpacity, Alert, ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useTema } from "../theme";

const API_BASE_URL = "https://agrovision-gs-fewn.onrender.com";

async function fetchComToken(path, options = {}) {
  const token = await AsyncStorage.getItem("token");
  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}

export default function Perfil({ navigation }) {
  const { tema, modoEscuro, alternarTema } = useTema();
  const s = estilos(tema);

  const [dados, setDados] = useState(null);
  const [totalPlantacoes, setTotalPlantacoes] = useState(0);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    setLoading(true);
    try {
      const rawUsuario = await AsyncStorage.getItem("usuarioLogado");
      if (!rawUsuario) {
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        return;
      }

      const usuario = JSON.parse(rawUsuario);
      setDados(usuario);

      const response = await fetchComToken(`/api/plantacoes/usuario/${usuario.id}`);
      if (response.ok) {
        const plantacoes = await response.json();
        setTotalPlantacoes(plantacoes.length);
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );

  async function sair() {
    Alert.alert("Sair", "Deseja encerrar a sessão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.multiRemove(["token", "usuarioLogado"]);
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);
  }

  if (loading || !dados) {
    return (
      <View style={s.loadingContainer}>
        <StatusBar barStyle={tema.statusBar} backgroundColor={tema.statusBarBg} />
        <ActivityIndicator size="large" color={tema.acento} />
      </View>
    );
  }

  function formatarCpf(cpf) {
    const c = String(cpf).padStart(11, "0");
    return `${c.slice(0, 3)}.${c.slice(3, 6)}.${c.slice(6, 9)}-${c.slice(9)}`;
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle={tema.statusBar} backgroundColor={tema.statusBarBg} />

      <View style={s.header}>
        <View style={s.dividerTop} />
        <View style={s.headerRow}>
          <Text style={s.titulo}>PERFIL</Text>
          <TouchableOpacity onPress={alternarTema} style={s.botaoTema} activeOpacity={0.75}>
            <MaterialIcons
              name={modoEscuro ? "light-mode" : "dark-mode"}
              size={20}
              color={tema.acentoTexto}
            />
            <Text style={s.botaoTemaTexto}>
              {modoEscuro ? "CLARO" : "ESCURO"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={s.avatarWrapper}>
        <View style={s.avatar}>
          <Text style={s.avatarLetra}>
            {dados.nome?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={s.nomeDestaque}>{dados.nome}</Text>
        <Text style={s.fazendaDestaque}>{dados.nomeFazenda}</Text>
      </View>

      <View style={s.statsRow}>
        <View style={s.statItem}>
          <Text style={s.statValor}>{totalPlantacoes}</Text>
          <Text style={s.statLabel}>TALHÕES</Text>
        </View>
        <View style={s.statDivisor} />
        <View style={s.statItem}>
          <Text style={s.statValor}>3</Text>
          <Text style={s.statLabel}>ALERTAS</Text>
        </View>
        <View style={s.statDivisor} />
        <View style={s.statItem}>
          <Text style={s.statValor}>2</Text>
          <Text style={s.statLabel}>MISSÕES</Text>
        </View>
      </View>

      <View style={s.card}>
        <View style={s.item}>
          <Text style={s.itemLabel}>NOME COMPLETO</Text>
          <Text style={s.itemValor}>{dados.nome}</Text>
        </View>
        <View style={s.separador} />
        <View style={s.item}>
          <Text style={s.itemLabel}>CPF</Text>
          <Text style={s.itemValor}>{formatarCpf(dados.cpf)}</Text>
        </View>
        <View style={s.separador} />
        <View style={s.item}>
          <Text style={s.itemLabel}>NOME DA FAZENDA</Text>
          <Text style={s.itemValor}>{dados.nomeFazenda}</Text>
        </View>
      </View>

      <TouchableOpacity style={s.btnSair} onPress={sair} activeOpacity={0.85}>
        <Text style={s.btnSairTexto}>ENCERRAR SESSÃO</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = (tema) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tema.fundo,
    paddingHorizontal: 28,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: tema.fundo,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 64,
    paddingBottom: 28,
  },
  dividerTop: {
    width: 40,
    height: 3,
    backgroundColor: tema.acento,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titulo: {
    fontSize: 32,
    fontWeight: "900",
    color: tema.texto,
    letterSpacing: 6,
  },
  botaoTema: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: tema.acento,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 4,
  },
  botaoTemaTexto: {
    fontSize: 11,
    fontWeight: "800",
    color: tema.acentoTexto,
    letterSpacing: 1.5,
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: tema.acento,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarLetra: {
    fontSize: 36,
    fontWeight: "900",
    color: "#1A1A1A",
  },
  nomeDestaque: {
    fontSize: 18,
    fontWeight: "800",
    color: tema.texto,
    letterSpacing: 1,
  },
  fazendaDestaque: {
    fontSize: 12,
    color: tema.textoSecundario,
    marginTop: 4,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: tema.fundoCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 0.5,
    borderColor: tema.borda,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValor: {
    fontSize: 22,
    fontWeight: "900",
    color: tema.acento,
  },
  statLabel: {
    fontSize: 10,
    color: tema.textoSecundario,
    marginTop: 4,
    letterSpacing: 1,
  },
  statDivisor: {
    width: 1,
    backgroundColor: tema.borda,
  },
  card: {
    backgroundColor: tema.fundoCard,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 8,
    marginBottom: 24,
    borderWidth: 0.5,
    borderColor: tema.borda,
  },
  item: {
    paddingVertical: 18,
  },
  itemLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: tema.acento,
    letterSpacing: 2,
    marginBottom: 6,
  },
  itemValor: {
    fontSize: 15,
    color: tema.texto,
    letterSpacing: 0.3,
  },
  separador: {
    height: 1,
    backgroundColor: tema.borda,
  },
  btnSair: {
    borderWidth: 1.5,
    borderColor: "#e74c3c",
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnSairTexto: {
    color: "#e74c3c",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },
});