import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert, StatusBar } from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const INTEGRANTES = [
  { id: "1", nome: "Felipe Furlanetto", rm: "RM562766", github: "https://github.com/Felipe-Furlanetto0504" },
  { id: "2", nome: "Raul Rezende Iemini Aguiar", rm: "RM564002", github: "https://github.com/Raul-Rezende" },
  { id: "3", nome: "João Victor Caetano Alves da Silva", rm: "RM562074", github: "https://github.com/joaocaetano1310" },
  { id: "4", nome: "Ryan Victor da Silva Vetoriano", rm: "RM565667", github: "https://github.com/ryanvetoriano" },
  { id: "5", nome: "João Victor Bueno Castelini da Silva", rm: "RM564115", github: "https://github.com/Buenozw" },
];

const LINKS = {
  github: "https://github.com/Felipe-Furlanetto0504/GS-Mobile",
  video: "https://youtube.com/watch?v=SEU_VIDEO_ID",
};

const TECNOLOGIAS = [
  { icone: "phone-android", cor: "#4A90E2", nome: "React Native", detalhe: "Interface mobile multiplataforma" },
  { icone: "", cor: "", nome: "", detalhe: "" },
  { icone: "", cor: "", nome: "", detalhe: "" },
  { icone: "", cor: "", nome: "", detalhe: "" },
  { icone: "", cor: "", nome: "", detalhe: "" },
  { icone: "", cor: "", nome: "", detalhe: "" },
  { icone: "", cor: "", nome: "", detalhe: "" },
  { icone: "", cor: "", nome: "", detalhe: "" },
  { icone: "", cor: "", nome: "", detalhe: "" },
];

export default function Sobre() {
  async function abrirLink(url, nome) {
    const podeAbrir = await Linking.canOpenURL(url);
    if (podeAbrir) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Erro", `Não foi possível abrir o link de ${nome}.`);
    }
  }

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cabecalho}>
          <View style={styles.dividerTop} />
          <Text style={styles.titulo}>SOBRE</Text>
          <View style={styles.appIcone}>
            <FontAwesome5 name="sun" size={32} color="#C8A96E" />
          </View>
          <Text style={styles.appNome}>A</Text>
          <Text style={styles.appVersao}>v1.0.0 · FIAP 2025</Text>
          <Text style={styles.appDescricao}>
           AAAAAA
          </Text>
        </View>

        <Text style={styles.secaoTitulo}>O PROBLEMA</Text>
        <View style={styles.card}>
          <View style={[styles.cardIcone, { backgroundColor: "#e74c3c20" }]}>
            <MaterialIcons name="wb-sunny" size={22} color="#e74c3c" />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardNome}>A</Text>
            <Text style={styles.cardDetalhe}>
             AAAAAAA
            </Text>
          </View>
        </View>

        
        <Text style={styles.secaoTitulo}>A SOLUÇÃO</Text>
        <View style={styles.card}>
          <View style={[styles.cardIcone, { backgroundColor: "#f39c1220" }]}>
            <MaterialIcons name="grass" size={22} color="#f39c12" />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardNome}>A</Text>
            <Text style={styles.cardDetalhe}>
             AAAAAA
            </Text>
          </View>
        </View>

        <Text style={styles.secaoTitulo}>ENTREGÁVEIS</Text>
        {[
          { icone: "code", cor: "#C8A96E", nome: "Repositório GitHub", url: LINKS.github, urlLabel: LINKS.github },
          { icone: "play-circle-outline", cor: "#e74c3c", nome: "Vídeo Pitch — YouTube", url: LINKS.video, urlLabel: LINKS.video },
        ].map((item) => (
          <TouchableOpacity
            key={item.nome}
            style={styles.cardLink}
            onPress={() => abrirLink(item.url, item.nome)}
            activeOpacity={0.7}
          >
            <View style={[styles.cardIcone, { backgroundColor: item.cor + "20" }]}>
              <MaterialIcons name={item.icone} size={22} color={item.cor} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardNome}>{item.nome}</Text>
              <Text style={styles.cardLink2} numberOfLines={1}>{item.urlLabel}</Text>
            </View>
            <MaterialIcons name="open-in-new" size={18} color="#C8A96E" />
          </TouchableOpacity>
        ))}

        <Text style={styles.secaoTitulo}>TECNOLOGIAS</Text>
        {TECNOLOGIAS.map((tech) => (
          <View key={tech.nome} style={styles.card}>
            <View style={[styles.cardIcone, { backgroundColor: tech.cor + "20" }]}>
              <MaterialIcons name={tech.icone} size={22} color={tech.cor} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardNome}>{tech.nome}</Text>
              <Text style={styles.cardDetalhe}>{tech.detalhe}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.secaoTitulo}>O TIME</Text>
        {INTEGRANTES.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={styles.card}
            onPress={() => abrirLink(p.github, p.nome)}
            activeOpacity={0.7}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarLetra}>{p.nome.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardNome}>{p.nome}</Text>
              <Text style={styles.cardDetalhe}>{p.rm}</Text>
            </View>
            <MaterialIcons name="open-in-new" size={16} color="#555" />
          </TouchableOpacity>
        ))}

        <View style={styles.rodape}>
          <FontAwesome5 name="sun" size={12} color="#444" />
          <Text style={styles.rodapeTexto}>
            FIAP · Disruptive Architectures: IoT, IoB & Generative IA · Global Solution · 1º Sprint 2026
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 48,
  },

  cabecalho: {
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 32,
  },
  dividerTop: {
    width: 40,
    height: 3,
    backgroundColor: "#C8A96E",
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  titulo: {
    fontSize: 32,
    fontWeight: "900",
    color: "#F0EDE6",
    letterSpacing: 6,
    alignSelf: "flex-start",
    marginBottom: 32,
  },
  appIcone: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#242424",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  appNome: {
    fontSize: 24,
    fontWeight: "900",
    color: "#F0EDE6",
    letterSpacing: 2,
  },
  appVersao: {
    fontSize: 11,
    color: "#555",
    letterSpacing: 1.5,
    marginTop: 4,
    marginBottom: 14,
    textTransform: "uppercase",
  },
  appDescricao: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    lineHeight: 22,
  },

  secaoTitulo: {
    fontSize: 11,
    fontWeight: "700",
    color: "#C8A96E",
    letterSpacing: 2,
    marginTop: 28,
    marginBottom: 12,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#242424",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  cardLink: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#242424",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#2E2E2E",
  },
  cardIcone: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardNome: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F0EDE6",
    marginBottom: 3,
  },
  cardDetalhe: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
  cardLink2: {
    fontSize: 11,
    color: "#555",
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#C8A96E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarLetra: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1A1A1A",
  },

  rodape: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 32,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
  rodapeTexto: {
    fontSize: 10,
    color: "#444",
    textAlign: "center",
    flex: 1,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
});