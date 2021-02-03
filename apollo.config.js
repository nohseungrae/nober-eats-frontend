module.exports = {
  client: {
    includes: ["./src/**/*.tsx"],
    tagName: "gql",
    service: {
      name: "nober-eats-backend",
      url: "http://localhost:5000/graphql",
    },
  },
};
