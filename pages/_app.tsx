/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable @next/next/google-font-display */
/* eslint-disable @next/next/no-css-tags */
import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';
import { useRouter } from 'next/dist/client/router';
import {
  ChakraProvider,
  useColorMode,
  ColorModeProvider,
} from '@chakra-ui/react';
import { prismLightTheme, prismDarkTheme } from '../styles/prism';
import { css, Global } from '@emotion/react';
import { customTheme } from '../styles/theme';
import Container from '../src/components/container';

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
          ${colorMode === 'light' ? prismLightTheme : prismDarkTheme};
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
            background: ${colorMode === 'light' ? 'white' : '#171717'};
          }
        `}
      />
      {children}
    </>
  );
};

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();

  const useBootstrap = router.pathname === '/';

  const BootstrapHead = useBootstrap ? (
    <Head>
      <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />

      <link
        href="vendor/fontawesome-free/css/all.min.css"
        rel="stylesheet"
        type="text/css"
      />
      <link href="css/agency.min.css" rel="stylesheet" />
    </Head>
  ) : null;

  return (
    <>
      {BootstrapHead}
      <ChakraProvider resetCSS theme={customTheme}>
        <ColorModeProvider
          options={{
            initialColorMode: 'light',
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
    </>
  );
};

export default App;
