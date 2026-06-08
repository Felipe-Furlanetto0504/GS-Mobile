import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  StatusBar,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useTema } from "../theme";

const INTEGRANTES = [
  {
    id: "1",
    nome: "Felipe Furlanetto",
    rm: "RM562766",
    github: "https://github.com/Felipe-Furlanetto0504",
  },
  {
    id: "2",
    nome: "Raul Rezende Iemini Aguiar",
    rm: "RM564002",
    github: "https://github.com/Raul-Rezende",
  },
  {
    id: "3",
    nome: "João Victor Caetano Alves da Silva",
    rm: "RM562074",
    github: "https://github.com/joaocaetano1310",
  },
  {
    id: "4",
    nome: "Ryan Victor da Silva Vetoriano",
    rm: "RM565667",
    github: "https://github.com/ryanvetoriano",
  },
  {
    id: "5",
    nome: "João Victor Bueno Castelini da Silva",
    rm: "RM564115",
    github: "https://github.com/Buenozw",
  },
];

const LINKS = {
  github: "https://github.com/Felipe-Furlanetto0504/GS-Mobile",
  video: "https://youtube.com/watch?v=SEU_VIDEO_ID",
};

const TECNOLOGIAS = [
  {
    icone: "phone-android",
    cor: "#4A90E2",
    nome: "React Native",
    detalhe: "Interface mobile multiplataforma",
  },
  {
    icone: "code",
    cor: "#C8A96E",
    nome: "Java Spring Boot",
    detalhe: "API REST com JWT e HATEOAS",
  },
  {
    icone: "storage",
    cor: "#e74c3c",
    nome: "Oracle 19c",
    detalhe: "Banco de dados relacional",
  },
  {
    icone: "storage",
    cor: "#4caf50",
    nome: "MongoDB",
    detalhe: "Dados satelitais em formato JSON",
  },
  {
    icone: "cloud",
    cor: "#3b82f6",
    nome: "Docker + Azure",
    detalhe: "Containers e deploy em nuvem",
  },
  {
    icone: "wifi",
    cor: "#f59e0b",
    nome: "ESP32 IoT",
    detalhe: "Sensor DHT22 e umidade do solo",
  },
  {
    icone: "satellite",
    cor: "#8b5cf6",
    nome: "ESA Sentinel-2",
    detalhe: "Dados satelitais abertos para NDVI",
  },
  {
    icone: "security",
    cor: "#10b981",
    nome: "Spring Security",
    detalhe: "Autenticação e autorização JWT",
  },
  {
    icone: "precision-manufacturing",
    cor: "#f97316",
    nome: "Drone Dispatch",
    detalhe: "Missões de pulverização automatizadas",
  },
];

export default function Sobre() {
  const { tema } = useTema();
  const s = estilos(tema);

  async function abrirLink(url, nome) {
    const podeAbrir = await Linking.canOpenURL(url);
    if (podeAbrir) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Erro", `Não foi possível abrir o link de ${nome}.`);
    }
  }

  return (
    <View style={s.wrapper}>
      <StatusBar barStyle={tema.statusBar} backgroundColor={tema.statusBarBg} />
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.cabecalho}>
          <View style={s.dividerTop} />
          <Text style={s.titulo}>SOBRE</Text>
          <View style={s.appIcone}>
            <FontAwesome5 name="sun" size={32} color={tema.acento} />
          </View>
          <Text style={s.appNome}>AgroVision</Text>
          <Text style={s.appVersao}>v1.0.0 · FIAP 2026</Text>
          <Text style={s.appDescricao}>
            Monitoramento agrícola via satélite com detecção de pragas e gestão
            de missões de drone.
          </Text>
        </View>

        <Text style={s.secaoTitulo}>O PROBLEMA</Text>
        <View style={s.card}>
          <View style={[s.cardIcone, { backgroundColor: "#e74c3c20" }]}>
            <MaterialIcons name="wb-sunny" size={22} color="#e74c3c" />
          </View>
          <View style={s.cardInfo}>
            <Text style={s.cardNome}>Pragas não detectadas a tempo</Text>
            <Text style={s.cardDetalhe}>
              Até 40% da produção pode ser perdida quando pragas são
              identificadas apenas no estágio visual, sem monitoramento contínuo
              das lavouras.
            </Text>
          </View>
        </View>

        <Text style={s.secaoTitulo}>A SOLUÇÃO</Text>
        <View style={s.card}>
          <View style={[s.cardIcone, { backgroundColor: "#f39c1220" }]}>
            <MaterialIcons name="grass" size={22} color="#f39c12" />
          </View>
          <View style={s.cardInfo}>
            <Text style={s.cardNome}>Satélite + IoT + Drone</Text>
            <Text style={s.cardDetalhe}>
              Cruzamento de índice NDVI satelital com sensores ESP32 em campo
              para gerar alertas automáticos e acionar drones de forma cirúrgica
              na área afetada.
            </Text>
          </View>
        </View>

        <Text style={s.secaoTitulo}>ENTREGÁVEIS</Text>
        {[
          {
            icone: "code",
            cor: "#C8A96E",
            nome: "Repositório GitHub",
            url: LINKS.github,
            urlLabel: LINKS.github,
          },
          {
            icone: "play-circle-outline",
            cor: "#e74c3c",
            nome: "Vídeo Pitch — YouTube",
            url: LINKS.video,
            urlLabel: LINKS.video,
          },
        ].map((item) => (
          <TouchableOpacity
            key={item.nome}
            style={s.cardLinkContainer}
            onPress={() => abrirLink(item.url, item.nome)}
            activeOpacity={0.7}
          >
            <View style={[s.cardIcone, { backgroundColor: item.cor + "20" }]}>
              <MaterialIcons name={item.icone} size={22} color={item.cor} />
            </View>
            <View style={s.cardInfo}>
              <Text style={s.cardNome}>{item.nome}</Text>
              <Text style={s.cardLinkTexto} numberOfLines={1}>
                {item.urlLabel}
              </Text>
            </View>
            <MaterialIcons name="open-in-new" size={18} color={tema.acento} />
          </TouchableOpacity>
        ))}

        <Text style={s.secaoTitulo}>TECNOLOGIAS</Text>
        {TECNOLOGIAS.map((tech) => (
          <View key={tech.nome} style={s.card}>
            <View style={[s.cardIcone, { backgroundColor: tech.cor + "20" }]}>
              <MaterialIcons name={tech.icone} size={22} color={tech.cor} />
            </View>
            <View style={s.cardInfo}>
              <Text style={s.cardNome}>{tech.nome}</Text>
              <Text style={s.cardDetalhe}>{tech.detalhe}</Text>
            </View>
          </View>
        ))}

        <Text style={s.secaoTitulo}>O TIME</Text>
        {INTEGRANTES.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={s.card}
            onPress={() => abrirLink(p.github, p.nome)}
            activeOpacity={0.7}
          >
            <View style={s.avatar}>
              <Text style={s.avatarLetra}>
                {p.nome.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={s.cardInfo}>
              <Text style={s.cardNome}>{p.nome}</Text>
              <Text style={s.cardDetalhe}>{p.rm}</Text>
            </View>
            <MaterialIcons
              name="open-in-new"
              size={16}
              color={tema.textoSecundario}
            />
          </TouchableOpacity>
        ))}

        <View style={s.rodape}>
          <FontAwesome5 name="sun" size={12} color={tema.textoSecundario} />
          <Text style={s.rodapeTexto}>
            FIAP · Global Solution 2026/1 · Análise e Desenvolvimento de
            Sistemas
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = (tema) =>
  StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: tema.fundo },
    scroll: { paddingHorizontal: 24, paddingTop: 20 },
    cabecalho: { alignItems: "center", paddingTop: 48, paddingBottom: 32 },
    dividerTop: {
      width: 40,
      height: 3,
      backgroundColor: tema.acento,
      marginBottom: 20,
      alignSelf: "flex-start",
    },
    titulo: {
      fontSize: 32,
      fontWeight: "900",
      color: tema.texto,
      letterSpacing: 6,
      alignSelf: "flex-start",
      marginBottom: 32,
    },
    appIcone: {
      width: 80,
      height: 80,
      borderRadius: 20,
      backgroundColor: tema.fundoCard,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
      borderWidth: 0.5,
      borderColor: tema.borda,
    },
    appNome: {
      fontSize: 24,
      fontWeight: "900",
      color: tema.texto,
      letterSpacing: 2,
    },
    appVersao: {
      fontSize: 11,
      color: tema.textoSecundario,
      letterSpacing: 1.5,
      marginTop: 4,
      marginBottom: 14,
      textTransform: "uppercase",
    },
    appDescricao: {
      fontSize: 13,
      color: tema.textoSecundario,
      textAlign: "center",
      lineHeight: 22,
    },
    secaoTitulo: {
      fontSize: 11,
      fontWeight: "700",
      color: tema.acento,
      letterSpacing: 2,
      marginTop: 28,
      marginBottom: 12,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: tema.fundoCard,
      borderRadius: 12,
      padding: 14,
      marginBottom: 8,
      borderWidth: 0.5,
      borderColor: tema.borda,
    },
    cardLinkContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: tema.fundoCard,
      borderRadius: 12,
      padding: 14,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: tema.borda,
    },
    cardIcone: {
      width: 44,
      height: 44,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    cardInfo: { flex: 1 },
    cardNome: {
      fontSize: 14,
      fontWeight: "700",
      color: tema.texto,
      marginBottom: 3,
    },
    cardDetalhe: { fontSize: 12, color: tema.textoSecundario, lineHeight: 18 },
    cardLinkTexto: { fontSize: 11, color: tema.textoSecundario },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: tema.acento,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    avatarLetra: { fontSize: 18, fontWeight: "900", color: "#1A1A1A" },
    rodape: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginTop: 32,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: tema.borda,
    },
    rodapeTexto: {
      fontSize: 10,
      color: tema.textoSecundario,
      textAlign: "center",
      flex: 1,
      lineHeight: 16,
      letterSpacing: 0.5,
    },
  });
