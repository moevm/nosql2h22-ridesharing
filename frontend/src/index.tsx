import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import "@gravity-ui/uikit/styles/styles.scss";

import { BrowserRouter } from "react-router-dom";
import Root from "./root";
import { ThemeProvider } from "@gravity-ui/uikit";

const cache = new InMemoryCache();

const client = new ApolloClient({
  uri: "http://localhost:5001/graphql",
  cache,
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <ThemeProvider theme="light">
        <Root />
      </ThemeProvider>
    </BrowserRouter>
  </ApolloProvider>
);
