// import { objectType } from "nexus";


// export const User = objectType({
//     name :"User",
//     definition(t){
//         t.nonNull.int("id");
//         t.nonNull.string("name");
//         t.nonNull.string("email");
//         t.nonNull.list.nonNull.field("links",{
//             type:'Link',
//             resolve(parent,args, context){
//                 return context.prisma.user.findUnique({where:{id:parent.id}}).links();
//             }
//         })
//     }
// })
import { objectType } from "nexus";

export const User = objectType({
    name: "User",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("name");
        t.nonNull.string("email");
        t.nonNull.list.nonNull.field("links", {    // 1
            type: "Link",
            async resolve(parent, args, context) {   // 2
                 const links = await context.prisma.user  // 3
                    .findUnique({ where: { id: parent.id } })
                    .links();
                    if (!links) return []
                    return links;
            },
        }); 
        t.nonNull.list.nonNull.field("votes",{
            type:"Link",
            async resolve(parent, args, context) {
                const res=  await context.prisma.user.findUnique({where:{id:parent.id}})
                .votes();
                if(!res) return [];
                return res;
            }
        })
    },
});