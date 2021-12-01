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
  //an object to store authors names and the number of times they appear
  const counter = {};
  array.forEach((blog) => {
    counter[blog.author] = (counter[blog.author] || 0) + 1;
  });
  //Loop over each object in the array and count how many times each author appears, ->add the name of the author as a key and the number of time the appear as a value in the counter object
  const findLargestObject = () => {
    //Get the values ie the number of time the author appears in the array
    const values = Object.values(counter);
    //Find the largest number
    const max = Math.max.apply(Math, values);
    //Loop over the counter object and create a new object with the largest number and the author name [the key]
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
