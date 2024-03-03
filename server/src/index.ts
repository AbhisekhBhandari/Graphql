import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "./schema";
import { Context,context } from "./context";
import dotenv from "dotenv";
import { decodeAuthHeader } from "./utils/auth";
import { PrismaClient } from "@prisma/client";
dotenv.config();

export const prisma = new PrismaClient();
async function init() {
  const server = new ApolloServer({ schema });

  const utl = await startStandaloneServer(server, {
    listen: { port: 4000 },
    // ts-ignore
    context
  }).then(({ url }) => console.log("runninasdg at " + url));
}
init();
