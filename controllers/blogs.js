const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs.map((blog) => blog.toJSON()));
});

blogRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate("user", {
    username: 1,
    name: 1,
  });
  if (blog) {
    response.json(note.toJSON());
  } else {
    response.status(404).end();
  }
});

blogRouter.post("/", userExtractor, async (request, response) => {
  const user = request.user;
  const body = request.body;
  //Check if new blog has like property, if it does not we add a default like property
  !body.hasOwnProperty("likes") && (body["likes"] = 0);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.like,
    user: user._id,
  });
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.json(savedBlog);
});

blogRouter.delete("/:id", userExtractor, async (request, response) => {
  const user = request.user;
  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() !== user.id.toString()) {
    return response
      .status(401)
      .json({ error: "Invalid request, only the creator can delete blogs" });
  }

  user.blogs = user.blogs.filter(
    (blog) => blog.toString() !== blog.id.toString()
  );
  await blog.remove();
  await user.save();
  response.status(204).end();
});

blogRouter.put("/:id", userExtractor, async (request, response) => {
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
