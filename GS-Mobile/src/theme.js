import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TEMA_KEY = "APP_TEMA";

export const temas = {
  escuro: {
    fundo:            "#1A1A1A",
    fundoCard:        "#242424",
    fundoModal:       "#1E1E1E",
    fundoInput:       "#242424",
    fundoIcone:       "#C8A96E20",
    fundoStatus:      "#242424",
    texto:            "#F0EDE6",
    textoSecundario:  "#666",
    textoPlaceholder: "#444",
    textoBotaoIcone:  "#555",
    borda:            "#2A2A2A",
    bordaInput:       "#333",
    bordaStatus:      "#333",
    acento:           "#C8A96E",
    acentoTexto:      "#1A1A1A",
    vazioIcone:       "#333",
    vazioTexto:       "#444",
    vazioSubTexto:    "#333",
    statusBar:        "light-content",
    statusBarBg:      "#1A1A1A",
    tabBg:            "#111111",
    tabBorda:         "#2A2A2A",
    tabAtivo:         "#C8A96E",
    tabInativo:       "#555",
  },
  claro: {
    fundo:            "#F5F2ED",
    fundoCard:        "#FFFFFF",
    fundoModal:       "#FFFFFF",
    fundoInput:       "#EEEBE5",
    fundoIcone:       "#C8A96E20",
    fundoStatus:      "#EEEBE5",
    texto:            "#1A1A1A",
    textoSecundario:  "#888",
    textoPlaceholder: "#AAAAAA",
    textoBotaoIcone:  "#888",
    borda:            "#E5E0D8",
    bordaInput:       "#D8D0C4",
    bordaStatus:      "#D8D0C4",
    acento:           "#C8A96E",
    acentoTexto:      "#1A1A1A",
    vazioIcone:       "#CCCCCC",
    vazioTexto:       "#AAAAAA",
    vazioSubTexto:    "#CCCCCC",
    statusBar:        "dark-content",
    statusBarBg:      "#F5F2ED",
    tabBg:            "#FFFFFF",
    tabBorda:         "#E5E0D8",
    tabAtivo:         "#C8A96E",
    tabInativo:       "#AAAAAA",
  },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [modoEscuro, setModoEscuro] = useState(true);

  useEffect(() => {
    async function carregarTema() {
      const salvo = await AsyncStorage.getItem(TEMA_KEY);
      if (salvo !== null) setModoEscuro(salvo === "escuro");
    }
    carregarTema();
  }, []);

  async function alternarTema() {
    const novo = !modoEscuro;
    setModoEscuro(novo);
    await AsyncStorage.setItem(TEMA_KEY, novo ? "escuro" : "claro");
  }

  const tema = modoEscuro ? temas.escuro : temas.claro;

  return (
    <ThemeContext.Provider value={{ tema, modoEscuro, alternarTema }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTema() {
  return useContext(ThemeContext);
}