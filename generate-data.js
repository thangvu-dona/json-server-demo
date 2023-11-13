const { faker } = require('@faker-js/faker')
const fs = require('fs')

// Set local to use Vietnamese
faker.location = 'vi'

// Random data
// console.log(faker.commerce.department());
// console.log(faker.commerce.productName());
// console.log(faker.commerce.productDescription());

// console.log(faker.string.uuid());
// console.log(faker.internet.userName());
// console.log(faker.internet.avatar());

const randomCategoryList = (n) => {
  if (n <= 0) return [];

  const categoryList = [];

  // loop and push category
  Array.from(new Array(n)).forEach(() => {
    const category = {
      id: faker.string.uuid(),
      name: faker.commerce.department(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    categoryList.push(category);
  })

  return categoryList;
};

const randomProductList = (categoryList, numberOfProducts) => {
  if (numberOfProducts <= 0) return [];

  const productList = [];

  // random data
  for (const category of categoryList) {
    Array.from(new Array(numberOfProducts)).forEach(() => {
      const product = {
        categoryId: category.id,
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        color: faker.color.human(),
        price: Number.parseFloat(faker.commerce.price()),
        discription: faker.commerce.productDescription(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        thumnailUrl: faker.internet.avatar(400, 400),
      };

      productList.push(product);
    });
  }


  return productList
};

// IIFE
(() => {
  // random data
  const categoryList = randomCategoryList(4);
  const productList = randomProductList(categoryList, 5);

  // prepare db object
  const db = {
    categories: categoryList,
    products: productList,
    profiles: {
      name: "WinVu",
    },
  }

  //write db object to db.json
  fs.writeFile('db.json', JSON.stringify(db), () => {
    console.log('Generate data successfully !!!');
  })
})();