const dummy = (blogs) => {
  if (blogs) {
    return 1;
  }
};

const totalLikes = (array) => {
  return array.reduce((acc, current) => {
    return acc + current.likes;
  }, 0);
};

const favoriteBlog = (array) => {
  return array.reduce((acc, current) => {
    return acc.likes > current.likes
      ? { title: acc.title, author: acc.author, likes: acc.likes }
      : { title: current.title, author: current.author, likes: current.likes };
  });
};

const mostBlogs = (array) => {
  const counter = {};
  array.forEach((blog) => {
    counter[blog.author] = (counter[blog.author] || 0) + 1;
  });
  const findLargestObject = () => {
    const values = Object.values(counter);
    const max = Math.max.apply(Math, values);
    for (key in counter) {
      if (counter[key] === max) {
        return { author: key, blogs: max };
      }
    }
  };
  return findLargestObject(array);
};

const mostLikes = (array) => {
  return array.reduce((acc, current) => {
    return acc.likes > current.likes
      ? { author: acc.author, likes: acc.likes }
      : { author: current.author, likes: current.likes };
  });
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostLikes,
  mostBlogs,
};
