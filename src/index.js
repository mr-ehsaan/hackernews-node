const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// 2
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: async (parent, args, context) => {
      return context.prisma.link.findMany();
    },
    link: (parent, args) => {
      let link = links.filter((l) => l.id === args.id);
      return link[0];
    },
  },
  Mutation: {
    // 2
    post: (parent, args, context, info) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      });
      return newLink;
    },
    updateLink: (parent, args) => {
      let ind;
      let linkss = links.map((link, index) => {
        if (link.id === args.id) {
          ind = index;
          return {
            id: link.id,
            description: args.description,
            url: args.url,
          };
        }
        return link;
      });
      links = linkss;
      return links[ind];
    },

    deleteLink: (parent, args) => {
      let link = links.find((l) => l.id === args.id);
      let index = links.indexOf((l) => l.id === args.id);
      links.splice(index, 1);
      return link;
    },
  },
};

// 3
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: {
    prisma,
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
