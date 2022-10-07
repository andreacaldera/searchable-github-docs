import { Html, Head, Main, NextScript } from "next/document";
import { GoogleFonts } from "next-google-fonts";
import { FC } from "react";
import { ColorModeScript } from "@chakra-ui/react";

const MyDocument: FC = () => {
  return (
    <Html>
      <GoogleFonts href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" />
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Searchable Github documentation" />
        <meta name="author" content="Searchable Github documentation" />
        <link rel="shortcut icon" type="image/png" href="/favicon-32x32.png" />
      </Head>
      <body>
        <ColorModeScript />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default MyDocument;
