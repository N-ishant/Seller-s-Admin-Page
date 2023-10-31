const ApiUrl = "https://crudcrud.com/api/834d3d80588d47d096783f2cc322ba40";
const myForm = document.getElementById('my-form');
const productName = document.getElementById('name');
const amount = document.getElementById('price');
const category = document.getElementById('category');
const electronicsList = document.getElementById('electronics-list');
const foodList = document.getElementById('food-list');
const medicalList = document.getElementById('medical-list');
const skincareList = document.getElementById('skincare-list');
const mssg = document.querySelector('.msg');

myForm.addEventListener('submit' , onSubmit);

function onSubmit(e){
    e.preventDefault();

    if(productName.value === "" || amount.value === ""){
        //Display an error message
        mssg.classList.add('error');
        mssg.textContent = 'Please enter all fields';

        // Remove error after 3 seconds
        setTimeout(() => mssg.remove(), 3000);
    }else{
        const productName = e.target.name.value;
        const amount = e.target.price.value;
        const category = e.target.category.value;

        const productData = {
            productName,
            amount,
            category
        };

        //Sending a POST Request to CRUD Server
        axios
          .post(`${ApiUrl}/products` , productData)
          .then((res) => {
            showProductOnScreen(res.data)
            console.log(res);  
          })
          .catch((error) => {
            //document.body.innerHTML = document.body.innerHTML + "<h4>Something went wrong</h4>"
            console.log(error);
            displayErrorMessage("Failed to add the product. Please try again.");
          });
    }    
}

//Sending a GET Request to CRUD Server
window.addEventListener("DOMContentLoaded" , () => {
    axios
      .get(`${ApiUrl}/products`)
      .then((res) => {
        console.log(res);
        for(var i = 0 ; i<res.data.length ; i++){
            showProductOnScreen(res.data[i]);
        }
      })
      .catch((error) => {
        console.log(error);
        displayErrorMessage("Failed to retrieve products. Please try again.");
      })
})

function displayErrorMessage(message) {
  mssg.classList.add('error');
  mssg.textContent = message;

  setTimeout(() => {
    mssg.classList.remove('error');
    mssg.textContent = '';
  }, 3000);
}

function showProductOnScreen(productData){
    let li = document.createElement('li');
    const details = document.createTextNode(`${productData.productName} : ${productData.amount} : ${productData.category} `);

    let deleteBtn = document.createElement('input');
    deleteBtn.type = 'button';
    deleteBtn.value = "Delete Order";
    deleteBtn.style.color = 'white';
    deleteBtn.style.backgroundColor = 'Red';
    deleteBtn.onclick = () => {
        //Sending a Delete Request to CRUD Server
        axios
          .delete(`${ApiUrl}/products/${productData._id}`)
          .then((res) => {
            switch (productData.category) {
              case 'Electronics':
                  electronicsList.removeChild(li);
                  break;
              case 'Food':
                  foodList.removeChild(li);
                  break;
              case 'Medical':
                  medicalList.removeChild(li);
                  break;
              case 'Skincare':
                  skincareList.removeChild(li);
                  break;
              default:
                  break;
            }
          })
          .catch((error) => {
            console.log(error);
            displayErrorMessage("Failed to delete the product. Please try again.");
          })
      }

    let editBtn = document.createElement('input');
    editBtn.type = 'button';
    editBtn.value = 'Edit Order';
    editBtn.style.backgroundColor = 'yellowgreen';
    editBtn.onclick = () => {

      switch (productData.category) {
        case 'Electronics':
            electronicsList.removeChild(li);
            break;
        case 'Food':
            foodList.removeChild(li);
            break;
        case 'Medical':
            medicalList.removeChild(li);
            break;
        case 'Skincare':
            skincareList.removeChild(li);
            break;
        default:
            break;
      }
      
      document.getElementById('name').value = productData.productName;
      document.getElementById('price').value = productData.amount;
      document.getElementById('category').value = productData.category;

      //Replace the Existing Event Listener with new one
      myForm.removeEventListener('submit' , onSubmit);

      myForm.addEventListener('submit' , (e) => {
        e.preventDefault();

        const updatedProductData = {
          productName : document.getElementById('name').value,
          amount : document.getElementById('price').value,
          category : document.getElementById('category').value
        }
  
        axios
          .put(`${ApiUrl}/products/${productData._id}` , updatedProductData)
          .then((res) => {
            //Update the productData object
            productData.productName = updatedProductData.productName;
            productData.amount = updatedProductData.amount;
            productData.category = updatedProductData.category;

            //Update the details text node
            details.nodeValue = `${productData.productName} : ${productData.amount} : ${productData.category} `;

            // Call showProductOnScreen to re-add the updated item to the UI
            showProductOnScreen(productData);

            //Clear the form after updating
            productName.value = '';
            amount.value = '';
            category.value = 'Select..';
          })
          .catch((error) => {
            console.log(error);
            displayErrorMessage("Failed to update the product. Please try again.");
          })

          //Restore the original Event Listener
          myForm.addEventListener('submit' , onSubmit);
      })  
    }

    li.appendChild(details);
    li.appendChild(deleteBtn);
    li.appendChild(editBtn);
  
    switch (productData.category) {
      case 'Electronics':
        electronicsList.appendChild(li);
        break;
      case 'Food':
        foodList.appendChild(li);
        break;
      case 'Medical':
        medicalList.appendChild(li);
        break;
      case 'Skincare':
        skincareList.appendChild(li);
        break;
      default:
        break;
    }
    
    //Clear Fields
    productName.value = '';
    amount.value = '';
    category.value = '';
}