'use client'
import {ApolloClient, InMemoryCache, ApolloProvider, createHttpLink}  from '@apollo/client'

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
    const httpLink = createHttpLink({
        uri:'http://localhost:4000/'
    })

    const client = new ApolloClient({
        link: httpLink,
        
        cache: new InMemoryCache()
    })

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
