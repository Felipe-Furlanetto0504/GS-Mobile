import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {Text, View, TextInput, TouchableOpacity,FlatList, Alert, Modal, ScrollView, StyleSheet, StatusBar} from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Plantacao() {
  const insets = useSafeAreaInsets();
  const [plantacoes, SetPlantacoes] = useState([]);
  const [modalVisivel, SetModalVisivel] = useState(false);
  const [cultura, SetCultura] = useState("");
  const [area, SetArea] = useState("");
  const [dataPlantio, SetDataPlantio] = useState("");
  const [talhao, SetTalhao] = useState("");
  const [status, SetStatus] = useState("");

  useEffect(() => {
    carregarPlantacoes();
  }, []);

  async function carregarPlantacoes() {
    const dados = await AsyncStorage.getItem("PLANTACOES");
    if (dados) SetPlantacoes(JSON.parse(dados));
  }

  async function salvarPlantacao() {
    if (!cultura || !area || !dataPlantio || !talhao || !status) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    const nova = {
      id: Date.now().toString(),
      cultura, area, dataPlantio, talhao, status,
    };

    const novaLista = [...plantacoes, nova];
    SetPlantacoes(novaLista);
    await AsyncStorage.setItem("PLANTACOES", JSON.stringify(novaLista));

    SetCultura("");
    SetArea("");
    SetDataPlantio("");
    SetTalhao("");
    SetStatus("");
    SetModalVisivel(false);
  }

  async function excluirPlantacao(id) {
    Alert.alert("Excluir", "Deseja excluir esta plantação?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          const novaLista = plantacoes.filter((p) => p.id !== id);
          SetPlantacoes(novaLista);
          await AsyncStorage.setItem("PLANTACOES", JSON.stringify(novaLista));
        },
      },
    ]);
  }

  function renderPlantacao({ item }) {
    const partes = item.dataPlantio.split("/");
    const dia = partes[0] || "--";
    const mes = partes[1] || "--";

    return (
      <View style={styles.card}>
        <View style={styles.cardData}>
          <Text style={styles.cardDia}>{dia}</Text>
          <Text style={styles.cardMes}>/{mes}</Text>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.cardNome}>{item.cultura}</Text>

          <View style={styles.cardLinha}>
            <Feather name="map-pin" size={12} color="#C8A96E" />
            <Text style={styles.cardDetalhe}> {item.talhao}</Text>
          </View>

          <View style={styles.cardLinha}>
            <Feather name="maximize" size={12} color="#666" />
            <Text style={styles.cardDetalhe}> {item.area} ha</Text>
          </View>

          <View style={styles.cardLinha}>
            <Feather name="activity" size={12} color="#666" />
            <Text style={styles.cardDetalhe}> {item.status}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => excluirPlantacao(item.id)}
          style={styles.cardExcluir}
        >
          <MaterialIcons name="delete-outline" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />

      <View style={styles.header}>
        <View style={styles.dividerTop} />
        <Text style={styles.titulo}>PLANTAÇÃO</Text>
      </View>

      {plantacoes.length === 0 ? (
        <View style={styles.vazio}>
          <Feather name="sun" size={56} color="#333" />
          <Text style={styles.vazioTexto}>Nenhuma plantação cadastrada</Text>
          <Text style={styles.vazioSubTexto}>Toque no botão para adicionar</Text>
        </View>
      ) : (
        <FlatList
          data={plantacoes}
          keyExtractor={(item) => item.id}
          renderItem={renderPlantacao}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={[styles.botaoAdicionar, { marginBottom: 64 + insets.bottom + 16 }]}
        onPress={() => SetModalVisivel(true)}
        activeOpacity={0.85}
      >
        <MaterialIcons name="add" size={20} color="#1A1A1A" />
        <Text style={styles.botaoAdicionarTexto}>NOVA PLANTAÇÃO</Text>
      </TouchableOpacity>

      <Modal visible={modalVisivel} animationType="fade" transparent>
        <View style={styles.modalFundo}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>NOVA PLANTAÇÃO</Text>
              <TouchableOpacity onPress={() => SetModalVisivel(false)}>
                <MaterialIcons name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Plantio</Text>
              <TextInput
                value={cultura}
                onChangeText={SetCultura}
                style={styles.input}
                placeholder="Ex: Soja, Milho, Cana..."
                placeholderTextColor="#444"
              />

              <Text style={styles.label}>ÁREA (hectares)</Text>
              <TextInput
                value={area}
                onChangeText={SetArea}
                style={styles.input}
                placeholder="Ex: 12.5"
                placeholderTextColor="#444"
                keyboardType="numeric"
              />

              <Text style={styles.label}>DATA DE PLANTIO</Text>
              <MaskedTextInput
                mask="99/99/9999"
                value={dataPlantio}
                onChangeText={(text) => SetDataPlantio(text)}
                style={styles.input}
                keyboardType="numeric"
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#444"
              />

              <Text style={styles.label}>LOCAL</Text>
              <View style={styles.localContainer}>
                <Feather name="map-pin" size={18} color="#555" style={styles.localIcone} />
                <TextInput
                  value={talhao}
                  onChangeText={SetTalhao}
                  style={styles.localInput}
                  placeholder="Ex: Talhão A, Área Norte..."
                  placeholderTextColor="#444"
                />
              </View>

              <Text style={styles.label}>STATUS</Text>
              <TextInput
                value={status}
                onChangeText={SetStatus}
                style={styles.input}
                placeholder="Ex: Em crescimento, Colhida..."
                placeholderTextColor="#444"
              />

              <View style={styles.modalBotoes}>
                <TouchableOpacity
                  style={styles.botaoCancelar}
                  onPress={() => SetModalVisivel(false)}
                >
                  <Text style={styles.botaoCancelarTexto}>CANCELAR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.botaoSalvar}
                  onPress={salvarPlantacao}
                >
                  <Text style={styles.botaoSalvarTexto}>SALVAR</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 24,
  },

  header: {
    paddingTop: 64,
    paddingBottom: 28,
  },
  dividerTop: {
    width: 40,
    height: 3,
    backgroundColor: "#C8A96E",
    marginBottom: 20,
  },
  titulo: {
    fontSize: 32,
    fontWeight: "900",
    color: "#F0EDE6",
    letterSpacing: 6,
  },

  vazio: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  vazioTexto: {
    color: "#444",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 12,
    letterSpacing: 0.5,
  },
  vazioSubTexto: {
    color: "#333",
    fontSize: 12,
    letterSpacing: 0.5,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#242424",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#C8A96E",
  },
  cardData: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C8A96E20",
    borderRadius: 10,
    width: 52,
    height: 52,
    marginRight: 14,
  },
  cardDia: {
    fontSize: 20,
    fontWeight: "900",
    color: "#C8A96E",
    lineHeight: 22,
  },
  cardMes: {
    fontSize: 12,
    color: "#C8A96E",
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },
  cardNome: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F0EDE6",
    marginBottom: 2,
  },
  cardLinha: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardDetalhe: {
    fontSize: 12,
    color: "#666",
  },
  cardExcluir: {
    padding: 4,
  },

  botaoAdicionar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C8A96E",
    paddingVertical: 16,
    borderRadius: 4,
    gap: 8,
    marginBottom: 16,
  },
  botaoAdicionarTexto: {
    color: "#1A1A1A",
    fontWeight: "800",
    fontSize: 13,
    letterSpacing: 2,
  },

  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxHeight: "85%",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitulo: {
    fontSize: 16,
    fontWeight: "900",
    color: "#F0EDE6",
    letterSpacing: 3,
  },

  label: {
    fontSize: 10,
    fontWeight: "700",
    color: "#C8A96E",
    letterSpacing: 2,
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#242424",
    borderBottomWidth: 1.5,
    borderBottomColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontSize: 14,
    color: "#F0EDE6",
  },
  localContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#242424",
    borderBottomWidth: 1.5,
    borderBottomColor: "#333",
  },
  localIcone: {
    paddingRight: 8,
  },
  localInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: "#F0EDE6",
  },

  modalBotoes: {
    flexDirection: "row",
    gap: 10,
    marginTop: 28,
    marginBottom: 10,
  },
  botaoCancelar: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#333",
  },
  botaoCancelarTexto: {
    color: "#666",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 2,
  },
  botaoSalvar: {
    flex: 1,
    backgroundColor: "#C8A96E",
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: "center",
  },
  botaoSalvarTexto: {
    color: "#1A1A1A",
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 2,
  },
});