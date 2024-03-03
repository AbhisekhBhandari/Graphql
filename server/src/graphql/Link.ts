import { Prisma } from "@prisma/client";
import {
  arg,
  enumType,
  extendType,
  idArg,
  inputObjectType,
  intArg,
  list,
  nonNull,
  objectType,
  stringArg,
} from "nexus";

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
    t.nonNull.dateTime("createdAt");
    t.field("postedBy",{
        type: "User",
        resolve(parent, args, context){
            return context.prisma.link.findUnique({
                where :{ id: parent.id}
            }).postedBy();
        }
    })
    t.nonNull.list.nonNull.field("voters",{
      type:"User",
      async resolve(parent,args, context){
        const res= await context.prisma.link.findUnique({where:{id:parent.id}})
        .voters()
        if(!res) return [];
        return res;

      }
    })
  },
});

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      type: "Link",
      args:{
        filter: stringArg(),
        skip:intArg(),
        take: intArg(),
        orderBy: arg({type:list(nonNull(LinkOrderByInput))})

      },
      resolve(parent, args, context, info) {
        const where = args.filter ? {
          OR: [
            {description:{contains: args.filter}},
            {url:{contains: args.filter}}
          ]
        }:{};

        return context.prisma.link.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as Prisma.Enumerable<Prisma.LinkOrderByWithRelationInput | undefined>
        });
      },
    });
  },
});
export const SingleLinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("link", {
      type: "Link",
      args: {
        id: nonNull(intArg()),
      },
      resolve(parent, args, context) {
        const { id } = args;
        return context.prisma.link.findUnique({ where: { id: id } });
      },
    });
  },
});

export const LinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("post", {
      type: "Link",
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },
      resolve(parent, args, context) {
        const { description, url } = args;
        const {  userId  } = context;
        if(!userId) throw new Error("Cannot post without logging in")
        return context.prisma.link.create({
            data:{
                description,
                url,
                postedBy:{connect:{id:userId}}
            }
        })
      
      },
    });
  },
});

export const UpdateLink = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateLink", {
      type: "Link",
      args: {
        id: nonNull(intArg()),
        url: stringArg(),
        description: stringArg(),
      },
      resolve(parent: any, args: any, context: any) {
        const { id, url, description } = args;
    
        const dataToUpdate: { description?: string; url?: string } = {};
    
        if (description !== undefined) {
            dataToUpdate.description = description;
        }
    
        if (url !== undefined) {
            dataToUpdate.url = url;
        }
        
        return context.prisma.link.update({
            where: {
                id: Number(id)
            },
            data: dataToUpdate
        });
    
    }
    
    });
  },
});
export const DeleteLink = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteLink", {
      type: "Link",
      args: {
        id: nonNull(idArg()),
      },
      resolve(parent, args,context) {
        const { id } = args;

        return context.prisma.link.delete({
            where:{
                id: Number(id)
            }
        })

      },
    });
  },
});


export const Sort = enumType({
  name:"Sort",
  members: ["asc", "des"]
}) 

export const LinkOrderByInput = inputObjectType({
  name:"LinkOrderByInput",
  definition(t){
    t.field("description",{type:Sort});
    t.field("url", {type: Sort});
    t.field("createdAt", {type:Sort})
  }
})