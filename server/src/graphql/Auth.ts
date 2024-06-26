import { extendType, nonNull, objectType, stringArg } from "nexus";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.nonNull.string("token"),
      t.nonNull.field("user", {
        type: "User",
      });
  },
});

export const AuthMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("login", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(parent, args, context) {
        // 1
        const user = await context.prisma.user.findUnique({
          where: { email: args.email },
        });
        if (!user) {
          throw new Error("No such user found");
        }

        // 2
        const valid = await bcrypt.compare(args.password, user.password);
        if (!valid) {
          throw new Error("Invalid password");
        }

        // 3
        const token = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET as string
        );

        // 4
        return {
          token,
          user,
        };
      },
    });

    t.nonNull.field("signup", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        name: nonNull(stringArg()),
      },
      async resolve(parent, args, context) {
        const { email, name } = args;

        const password = await bcrypt.hash(args.password, 10);

        const user = await context.prisma.user.create({
          data: { email, name, password },
        });
        console.log("created user");


        const token = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET as string
        );

        return {
          token,
          user,
        };
      },
    });
  },
});
