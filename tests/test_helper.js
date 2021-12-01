const Blog = require("../models/blog");

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

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
};
