import { Box, Text, Flex, Spacer } from "@chakra-ui/react";
import { Container, Header } from "semantic-ui-react";
const Card = ({ title, subtitle, subItem, footer, alignFooter, children }) => {
  return (
    <>
      {title && (
        <>
          <Container className="card-header">
            <Header className="card-title" as="h1">
              {title}
            </Header>
            <Header className="card-subtitle" as="h3">
              {subtitle}
            </Header>
            {subItem && <Container alignItems="flex-end">{subItem}</Container>}
          </Container>
        </>
      )}
      <Container className="card-content">{children}</Container>
      {footer && (
        <>
          <Container className={alignFooter}>{footer}</Container>
        </>
      )}
    </>
  );
};

export default Card;
