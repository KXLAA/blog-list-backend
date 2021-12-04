const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs.map((blog) => blog.toJSON()));
});

blogRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(note.toJSON());
  } else {
    response.status(404).end();
  }
});

blogRouter.post("/", async (request, response) => {
  //Check if new blog has like property, if it does not we add a default like property
  !request.body.hasOwnProperty("likes") && (request.body["likes"] = 0);
  const blog = new Blog(request.body);
  const savedBlog = await blog.save();
  response.json(savedBlog.toJSON());
});

blogRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog.toJSON());
});

module.exports = blogRouter;
