import { AppProps } from "next/app";
import Head from "next/head";
import { FC } from "react";
import {
  ChakraProvider,
  useColorMode,
  ColorModeProvider,
} from "@chakra-ui/react";
import { prismLightTheme, prismDarkTheme } from "../styles/prism";
import { css, Global } from "@emotion/react";
import { customTheme } from "../styles/theme";
import Container from "../src/components/container";

const GlobalStyle: FC = ({ children }) => {
  const { colorMode } = useColorMode();

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <Global
        styles={css`
          ${colorMode === "light" ? prismLightTheme : prismDarkTheme};
          ::selection {
            background-color: #90cdf4;
            color: #fefefe;
          }
          ::-moz-selection {
            background: #ffb7b7;
            color: #fefefe;
          }
          html {
            min-width: 356px;
            scroll-behavior: smooth;
          }
          #__next {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background: ${colorMode === "light" ? "white" : "#171717"};
          }
        `}
      />
      {children}
    </>
  );
};

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider resetCSS theme={customTheme}>
      <ColorModeProvider
        options={{
          initialColorMode: "dark",
          useSystemColorMode: true,
        }}
      >
        <GlobalStyle>
          <Container>
            <Component {...pageProps} />
          </Container>
        </GlobalStyle>
      </ColorModeProvider>
    </ChakraProvider>
  );
};

export default App;
