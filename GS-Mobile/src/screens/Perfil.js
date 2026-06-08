import { useEffect, useState } from "react";
import {
  Text, View, StyleSheet, StatusBar,
  TouchableOpacity, Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { useTema } from "../theme";

export default function Perfil({ navigation }) {
  const { tema, modoEscuro, alternarTema } = useTema();
  const s = estilos(tema);

  const [dados,           setDados]           = useState(null);
  const [totalPlantacoes, setTotalPlantacoes] = useState(0);

  useEffect(() => {
    async function carregar() {
      const dadosSalvos = await AsyncStorage.getItem("INFORMACOES");
      if (dadosSalvos) setDados(JSON.parse(dadosSalvos));

      const plantacoes = await AsyncStorage.getItem("PLANTACOES");
      if (plantacoes) setTotalPlantacoes(JSON.parse(plantacoes).length);
    }
    carregar();
  }, []);

  async function sair() {
    Alert.alert("Sair", "Deseja encerrar a sessão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.clear();
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);
  }

  if (!dados) {
    return (
      <View style={s.loadingContainer}>
        <StatusBar barStyle={tema.statusBar} backgroundColor={tema.statusBarBg} />
        <Text style={s.loadingText}>CARREGANDO...</Text>
      </View>
    );
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
          <Text style={s.itemLabel}>E-MAIL</Text>
          <Text style={s.itemValor}>{dados.email ?? "—"}</Text>
        </View>
        <View style={s.separador} />
        <View style={s.item}>
          <Text style={s.itemLabel}>CPF</Text>
          <Text style={s.itemValor}>{dados.cpf}</Text>
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
  loadingText: {
    color: tema.textoSecundario,
    fontSize: 11,
    letterSpacing: 2,
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