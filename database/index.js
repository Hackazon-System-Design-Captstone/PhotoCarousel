const faker = require('faker');
const mysql = require('mysql');

// console.log(process.env);
const connection = mysql.createConnection({
  // waitForConnections : true,
  host: 'localhost',
  user: 'root',
  database: 'slideShowData',
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('DB connected!');
  }
});

const getRelated = (id, callback) => {
  const queryString = 'select * from products where id in (select relatedItemId from similarProducts where productId= ?)';
  connection.query(queryString, [id], callback);
};
// Passed addRelated
const addRelated = (data) => {
  const queryString = `INSERT INTO products (productName, productDescription, color, price, imageURL, rating, reviewNumber, isPrime)
  VALUES("${data.productName}", "${data.productDescription}", "${data.color}", "${data.price}", "${data.imageURL}", "${data.rating}", "${data.reviewNumber}", "${data.isPrime}")`;
  connection.query(queryString);
};
// Passed deleteRelated
const deleteRelated = (id) => {
  const queryString = `DELETE FROM products WHERE id = ${id}`;
  connection.query(queryString);
};
// Passed updateRelated
const updateRelated = (data) => {
  const queryString = `UPDATE products SET productName = "${data.productName}", productDescription = "${data.productDescription}"
  WHERE id="${data.id}"`;
  connection.query(queryString);
};

// function picks a random image from S3
const randomImage = () => {
  const imageList = ['https://s3-us-west-1.amazonaws.com/pictures-hrsf/download+(1).jpeg', 'https://s3-us-west-1.amazonaws.com/pictures-hrsf/download+(10).jpeg',
    'https://s3-us-west-1.amazonaws.com/pictures-hrsf/download+(2).jpeg', 'https://s3-us-west-1.amazonaws.com/pictures-hrsf/download+(3).jpeg', 'https://s3-us-west-1.amazonaws.com/pictures-hrsf/download+(4).jpeg', 'https://s3-us-west-1.amazonaws.com/pictures-hrsf/download+(5).jpeg',
    'https://s3-us-west-1.amazonaws.com/pictures-hrsf/download+(6).jpeg', 'https://s3-us-west-1.amazonaws.com/pictures-hrsf/download+(7).jpeg', 'https://s3-us-west-1.amazonaws.com/pictures-hrsf/download+(8).jpeg', 'https://s3-us-west-1.amazonaws.com/pictures-hrsf/download+(9).jpeg'];
  const item = imageList[Math.floor(Math.random() * imageList.length)];
  return item;
};
const list = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
function getRandomRating() {
  const rand = list[Math.floor(Math.random() * list.length)];
  return rand;
}

const DATA_NUMBER = 100;
const createTable = () => {
  for (let i = 0; i < DATA_NUMBER; i += 1) {
    const randomName = faker.commerce.productName();
    const randomDescription = faker.lorem.sentences();
    const randomColor = faker.commerce.color();
    const randomPrice = faker.commerce.price();
    const randomImageURL = randomImage();
    const randomRating = getRandomRating(list);
    const randomReviewNumber = Math.floor((Math.random() * 1000) + 36);
    const randomBoolean = faker.random.boolean();

    const queryString = `INSERT INTO products (productName, productDescription, color, price, imageURL, rating, reviewNumber, isPrime)
                            VALUES ("${randomName}", "${randomDescription}", "${randomColor}", "${randomPrice}", "${randomImageURL}", ${randomRating}, ${randomReviewNumber}, ${randomBoolean})`;
    connection.query(queryString);
    console.log('entering query');
  }
};
// preventing the funtion from running more than once
// createTable();

const getRelatedItems = () => {
  for (let i = 1; i <= 100; i += 1) {
    const relatedItems = ((Math.random() * 38) + 6); // two random numbers to generate number of related items
    for (let j = 0; j < relatedItems; j += 1) {
      const relatedTo = ((Math.random() * 100) + 1);
      connection.query(`INSERT INTO similarProducts (productId, relatedItemId) values (${i}, ${relatedTo})`);
    }
  }
};

// getRelatedItems();


module.exports.getRelated = getRelated;
module.exports.addRelated = addRelated;
module.exports.deleteRelated = deleteRelated;
module.exports.updateRelated = updateRelated;
