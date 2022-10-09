import React, { FC } from "react";
import {
  useColorMode,
  Flex,
  Container as CharkaContainer,
} from "@chakra-ui/react";

import styled from "@emotion/styled";

import WithSubnavigation from "./top-nav";

const Container: FC = ({ children }) => {
  const { colorMode } = useColorMode();

  const bgColor = {
    light: "white",
    dark: "#171717",
  };

  const color = {
    light: "black",
    dark: "white",
  };

  const StickyNav = styled(Flex)`
    position: sticky;
    z-index: 10;
    top: 0;
    backdrop-filter: saturate(180%) blur(20px);
    transition: height 0.5s, line-height 0.5s;
  `;

  return (
    <>
      <StickyNav
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        bg={bgColor[colorMode]}
        as="nav"
        minWidth="100%"
        px={[2, 6, 6]}
        py={2}
        mt={8}
        mb={[0, 0, 8]}
        mx="auto"
      >
        <WithSubnavigation />
      </StickyNav>
      <CharkaContainer maxW="1024px" color={color[colorMode]}>
        {children}
      </CharkaContainer>
    </>
  );
};

export default Container;
