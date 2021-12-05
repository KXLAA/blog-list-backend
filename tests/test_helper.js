const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "Back-end basics",
    author: "kxla",
    url: "https://www.npmjs.com/package/nodemon",
    likes: 10,
  },
  {
    title: "How to create and sell HTML templates",
    author: "Lucian Tartea",
    url: "https://luciantartea.gumroad.com/l/QOdoy",
    likes: 30,
  },
];

const initialUser = {
  username: "testing",
  name: "testing",
  password: "testing",
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
  initialUser,
};
