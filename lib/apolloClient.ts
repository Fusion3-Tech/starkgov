import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from "@apollo/client";

const snapshotLink = createHttpLink({
  uri: `${process.env.NEXT_PUBLIC_SNAPSHOT_ENDPOINT}/graphql`,
  fetch,
});

const snapshotXLink = createHttpLink({
  uri: `${process.env.NEXT_PUBLIC_SNAPSHOTX_ENDPOINT}/graphql`,
  fetch,
});

const client = new ApolloClient({
    link: ApolloLink.split(
      (operation) => operation.getContext().clientName === "snapshotX",
      snapshotXLink,
      snapshotLink,
    ),
  cache: new InMemoryCache(),
});

export default client;
