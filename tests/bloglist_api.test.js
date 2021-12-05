const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let token;

describe("when there is initially some blogs saved", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(
      helper.initialUser.password,
      saltRounds
    );
    const user = new User({
      username: helper.initialUser.username,
      name: helper.initialUser.name,
      passwordHash,
    });
    const savedUser = await user.save();
    const userForToken = {
      username: savedUser.username,
      id: savedUser.id,
    };
    token = jwt.sign(userForToken, process.env.SECRET);
    const blogs = helper.initialBlogs.map(
      (blog) => new Blog({ ...blog, user: savedUser._id })
    );
    await Blog.insertMany(blogs);
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 100000);

  test("all blogs returned", async () => {
    const response = await api
      .get("/api/blogs")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("id to be defined in correct format", async () => {
    const response = await api
      .get("/api/blogs")
      .set("Authorization", `Bearer ${token}`);
    const id = response.body.map((blog) => blog.id);
    expect(id[0]).toBeDefined();
  });
});

describe("addition of a new note", () => {
  test("a blog can be added", async () => {
    const newBlog = {
      title: "The styled-components Happy Path",
      author: "josh comeau",
      url: "https://www.joshwcomeau.com/css/styled-components/",
      likes: 40,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  }, 100000);

  test("like is equal to zero by default if no like property is provided", async () => {
    const newBlog = {
      title: "The styled-components Happy Path",
      author: "josh comeau",
      url: "https://www.joshwcomeau.com/css/styled-components/",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const lastItem = blogsAtEnd[blogsAtEnd.length - 1];
    expect(lastItem.likes).toEqual(0);
  });

  test("blog without title or url not added", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const newBlog = {
      author: "josh comeau",
      likes: 40,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length).toBe(blogsAtStart.length);
  });
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("testPassword", 10);
    const user = new User({ username: "root", passwordHash });
    await user.save();
  });

  test("creation of new user", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "kxlaa",
      name: "Tooka Lore",
      password: "hfhhsuhhuu2WDD",
    };

    await api
      .post("/api/users")
      .set("Authorization", `Bearer ${token}`)
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation of new user fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Manny Wellz",
      password: "444rrrttt666",
    };

    const result = await api
      .post("/api/users")
      .set("Authorization", `Bearer ${token}`)
      .send(newUser)
      .expect(500)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("`username` to be unique");
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  }, 100000);

  test("creation fails if password is too short", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "tupple",
      name: "Manny weinger",
      password: "456",
    };

    const result = await api
      .post("/api/users")
      .set("Authorization", `Bearer ${token}`)
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("password too short");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  }, 100000);
});

afterAll(() => {
  mongoose.connection.close();
});
