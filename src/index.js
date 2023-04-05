const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");

// 1
let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
];

// 2
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (parent, args) => {
      let link = links.filter((l) => l.id === args.id);
      return link[0];
    },
  },
  Mutation: {
    // 2
    post: (parent, args) => {
      let idCount = links.length;

      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
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
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
