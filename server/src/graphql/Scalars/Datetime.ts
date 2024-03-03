import { asNexusMethod } from "nexus";
import { GraphQLDateTime } from 'graphql-scalars';


export const GQLDatetime = asNexusMethod(GraphQLDateTime, "dateTime");