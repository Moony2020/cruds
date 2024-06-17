let titleInput = document.getElementById("title");
let priceInput = document.getElementById("price");
let discountInput = document.getElementById("discount");
let totalDisplay = document.getElementById("total");
let countInput = document.getElementById("count");
let categoryInput = document.getElementById("category");
let create = document.getElementById("submit");
let searchInput = document.getElementById("search");
let searchButton = document.getElementById("searchTiltle");
let tableBody = document.querySelector("table tbody");
let mood = 'create'; // this is to change between Update and Create button when i click update , i will use in updateProductData function
let tmp;// will use it in updateProductData function to equal index (i)  

// handel total amount of the products
function calculateTotal() {

    if (priceInput.value != '') {
        let total = priceInput.value - discountInput.value;
        totalDisplay.textContent = total;
        totalDisplay.style.background = '#32CD32';
    }
    else {
        totalDisplay.textContent = '';
        totalDisplay.style.background = '#A52A2A';
    }

}
// handel localStorage if not empty
let productData = [];
if (localStorage.products != null) {
    productData = JSON.parse(localStorage.products)
} else {
    productData = [];
}
// handel create products
create.onclick = function () { // or write normal function createProduct() and put this "function createProduct()" after the function brackets 
    let product = {
        titleInput: titleInput.value.toLowerCase(), // if input data uper case it will be change lower case, if lower case it will be lower case
        priceInput: priceInput.value,
        discountInput: discountInput.value,
        totalDisplay: totalDisplay.textContent,
        countInput: countInput.value,
        categoryInput: categoryInput.value.toLowerCase(), // if input data uper case it will be change lower case , if lower case it will be lower case
    }
    if (titleInput.value != '' && priceInput.value != '' && categoryInput.value != '' && product.countInput < 100) {

        if (mood === 'create') { // when i click on update button create button will be change auto to Update button

            if (product.countInput > 1) { // handel count product greater than 1 , we can put many count instead of 1 only
                for (let i = 0; i < product.countInput; i++) // product.countInput; same countInput the user input 
                    productData.push(product) // if loop count 3 or 4 ,,,,etc it will create product as it mentioned in countInput
            } else {
                productData.push(product) // else create only one product 
            }

        } else { // else change update mood 
            productData[tmp] = product;
            mood = 'create'; // change to create mood 
            create.innerHTML = 'Create' // then after i click update button it will change back to Create
            countInput.style.display = 'block' // it will show count input after i click update button
        }
        clearInputData() // If the condition is not met, the data will not be deleted from input 
    }                    // when the user add some product but didnt input title, price or category


    // save to localStorage , convert into JSON strings format, since localStorage can only store strings
    localStorage.setItem('products', JSON.stringify(productData))
    showProductData()
    calculateTotal() // call calculateTotal function to change the total color to red color after 
}
//create.onclick = createProduct; this is just another way to write function createProduct

// Clear the input product data

function clearInputData() {
    titleInput.value = '';
    priceInput.value = '';
    discountInput.value = '';
    totalDisplay.innerHTML = '';
    countInput.value = '';
    categoryInput.value = '';
}
// handel read products
function showProductData() {

    let table = '';
    for (let i = 0; i < productData.length; i++) { //I added 1 to "<td>${i + 1}</td> " to start the table index from 1 not 0
        table += ` 
        <tr>
            <td>${i + 1}</td> 
            <td>${productData[i].titleInput}</td>
            <td>${productData[i].priceInput}</td>
            <td>${productData[i].discountInput}</td>
            <td>${productData[i].totalDisplay}</td>
            <td>${productData[i].categoryInput}</td>
            <td><button onclick="updateProductData(${i})" id="update">Update</button></td>
            <td><button onclick="confirmDeleteProduct(${i})" id="delete">Delete</button></td>
        </tr>
    `;

    }
    document.getElementById('tbody').innerHTML = table;
    let deleteAllBtn = document.getElementById('deleteAllData');
    if (productData.length > 0) {
        deleteAllBtn.innerHTML = `<button onclick="confirmDeleteAllData()" id= "deleteAll">Delete All Data (${productData.length})</button>`
    } else {
        deleteAllBtn.innerHTML = '';
    }
}
showProductData()// Without this function, the data in the table will be lost " disappear " when I refresh or reload the page.

// Handle delete product with confirmation modal
function confirmDeleteProduct(index) {
    let productName = productData[index].titleInput;
    showModal(`Are you sure you want to delete this item? <p>(ID: ${index + 1}, ${productName})`, function () {
        deleteProductData(index);
    });
}

// Handle delete product
function deleteProductData(index) {
    productData.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(productData));
    showProductData();
}
// Handle delete all products with confirmation modal
function confirmDeleteAllData(index) {
    showModal('Are you sure you want to delete all items?', function () {
        deleteAllData(index);
    });
}
// Handle delete all products
function deleteAllData() {
    localStorage.clear() // clear all data from local storage (cuz data storage in local storage and array productData)
    //productData.splice(0)  // clear all data from array that show in web page start from index 0
    productData = [];
    showProductData();  // update show products data in web page
}

// Handle updata product
function updateProductData(index) {
    titleInput.value = productData[index].titleInput;
    priceInput.value = productData[index].priceInput;
    discountInput.value = productData[index].discountInput;
    calculateTotal()
    countInput.style.display = 'none'; // display count input when i click on update button
    categoryInput.value = productData[index].categoryInput;
    create.innerHTML = 'Update' // when i click on update button create button will be change auto to Update button
    mood = 'update';
    tmp = index; // make global variable tmp = index , the index in product index to be able to update
    //e (tmp) will be used in create function
    scroll({ // scroll to top when i click update button in the table 
        top: 0,
        behavior: 'smooth'
    });
}

// Handle search for products 
let searchProduct = 'title'
function search(id) {

    let search = document.getElementById("search");
    if (id === 'searchTiltle') {
        searchProduct = 'title';
        search.style.background = 'black';
    } else {
        searchProduct = 'category';
        search.style.background = 'black';
        // search.style.background = 'black';
    }
    search.placeholder = 'Search by ' + searchProduct; // will display word Search by title or category when i click on title or category buttons
    search.focus()
    search.value = '';
    showProductData()
}

function searchData(value) {
    let table = '';
    for (let i = 0; i < productData.length; i++) {
        if (searchProduct === 'title') {
            if (productData[i].titleInput.includes(value.toLowerCase())) { // 
                table += ` 
                    <tr>
                    <td>${i + 1}</td> 
                    <td>${productData[i].titleInput}</td>
                    <td>${productData[i].priceInput}</td>
                    <td>${productData[i].discountInput}</td>
                    <td>${productData[i].totalDisplay}</td>
                    <td>${productData[i].categoryInput}</td>
                    <td><button onclick="updateProductData(${i})" id="update">Update</button></td>
                    <td><button onclick="deleteProductData(${i})" id="delete">Delete</button></td>
                    </tr>
                    `;
            }
        } else {

            if (productData[i].categoryInput.includes(value.toLowerCase())) {
                table += ` 
                    <tr>
                    <td>${i + 1}</td> 
                    <td>${productData[i].titleInput}</td>
                    <td>${productData[i].priceInput}</td>
                    <td>${productData[i].discountInput}</td>
                    <td>${productData[i].totalDisplay}</td>
                    <td>${productData[i].categoryInput}</td>
                    <td><button onclick="updateProductData(${i})" id="update">Update</button></td>
                    <td><button onclick="deleteProductData(${i})" id="delete">Delete</button></td>
                    </tr>
                    `;
            }
        }
    }
    document.getElementById('tbody').innerHTML = table;
}
// Modal handling
function showModal(message, callback) {
    let model = document.getElementById('confirmModal');
    let confirmMessage = document.getElementById('confirmMessage');
    let confirmYes = document.getElementById('confirmYes');
    let confirmNo = document.getElementById('confirmNo');

    confirmMessage.innerHTML = message;
    model.style.display = 'flex';

    confirmYes.onclick = function () {
        model.style.display = 'none';
        callback();
    };

    confirmNo.onclick = function () {
        model.style.display = 'none';
    };
}