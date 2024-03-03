import { PrismaClient } from "@prisma/client";
import { decodeAuthHeader } from "./utils/auth";
import {Request} from 'express';
import {ContextFunction, BaseContext} from "@apollo/server"
import {StandaloneServerContextFunctionArgument } from '@apollo/server/standalone';
export const prisma = new PrismaClient;


export interface Context{
    prisma: PrismaClient;
    userId?: number

}

export const context = ({ req }: {req:Request}):Context => {
        const token =
          req && req.headers.authorization
            ? decodeAuthHeader(req.headers.authorization)
            : null;
        console.log("context");
        return {
          prisma,
          userId: token?.userId,
        };
      }


