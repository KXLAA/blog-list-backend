const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const helper = require("./test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 100000);

test("All blogs returned", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("id to be defined", async () => {
  const response = await api.get("/api/blogs");
  const id = response.body.map((blog) => blog.id);
  expect(id[0]).toBeDefined();
});

test("a blog can be added", async () => {
  const newBlog = {
    title: "The styled-components Happy Path",
    author: "josh comeau",
    url: "https://www.joshwcomeau.com/css/styled-components/",
    likes: 40,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
});

test("like is equal to zero", async () => {
  const newBlog = {
    title: "The styled-components Happy Path",
    author: "josh comeau",
    url: "https://www.joshwcomeau.com/css/styled-components/",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  const lastItem = blogsAtEnd[blogsAtEnd.length - 1];
  expect(lastItem.likes).toEqual(0);
});

test("blog without title or url not added", async () => {
  const newBlog = {
    author: "josh comeau",
    likes: 40,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

afterAll(() => {
  mongoose.connection.close();
});
