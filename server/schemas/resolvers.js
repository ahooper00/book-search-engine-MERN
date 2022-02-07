const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: (root, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
  Mutation: {
    addUser: async (root, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (root, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const token = signToken(user);
      return { token, user };
    },
    removeBook: async (root, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    saveBook: async (root, savedBooks, context) => {
      console.log(context.user)
      if (context.user) {
        try {
        const updatedUser = User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: savedBooks } },
          { new: true }
        );
        return updatedUser;
        } catch (e) {
          throw new AuthenticationError("You need to be logged in!");
        }
      }
      throw new AuthenticationError("You need to be logged in!")
    },
  },
};

module.exports = resolvers;