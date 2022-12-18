import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import "@gravity-ui/uikit/styles/styles.scss";

import { BrowserRouter } from "react-router-dom";
import Root from "./root";

const client = new ApolloClient({
  uri: "http://localhost:5001/graphql",
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </ApolloProvider>
);
