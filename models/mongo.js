const mongoose = require("mongoose");
const logger = require("../utils/logger");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://kxla:${password}@cluster0.ptivn.mongodb.net/blog-app?retryWrites=true&w=majority`;

mongoose.connect(url);

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

const title = process.argv[3];
const author = process.argv[4];
const link = process.argv[5];
const likes = process.argv[6];

const blog = new Blog({
  title: `${title}`,
  author: `${author}`,
  url: `${link}`,
  likes: `${likes}`,
});

blog.save().then((result) => {
  logger.info(`added ${title} by ${author} to database`);
  mongoose.connection.close();
});

if (password) {
  Blog.find({}).then((result) => {
    result.forEach((blog) => {
      console.log(`${title} ${author} ${url} ${likes}`);
    });
    mongoose.connection.close();
  });
}
