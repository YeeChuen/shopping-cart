// attempt on pagination
const itemsPerPage = 5;

const URL = "http://localhost:3000";


const API = (() => {
  const itemURL = `${URL}/inventory`;
  const cartURL = `${URL}/cart`;

  const getCart = () => {
    // define your method to get cart data
    const p = fetch(cartURL);
    return p.then((response) => response.json());
  };

  const getInventory = () => {
    // define your method to get inventory data
    const p = fetch(itemURL);
    return p.then((response) => response.json());
  };

  const addToCart = (inventoryItem) => {
    // define your method to add an item to cart
      const p = fetch(cartURL, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inventoryItem),
    });
    return p.then((response) => response.json());
  };

  const updateCart = (id, newAmount) => {
    // define your method to update an item in cart
      const p = fetch(`${cartURL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAmount),
    });
    return p.then((response) => response.json());
  };

  const deleteFromCart = (id) => {
    // define your method to delete an item in cart
        const p = fetch(`${cartURL}/${id}`,{
          method: "DELETE", // <-- for DELETE, give the full http url that ends with id
      });
      return p.then((response) => response.json()); // <-- resolve by returning data.json()
  };

  const checkout = () => {
    // you don't need to add anything here
    return getCart().then((data) =>
      Promise.all(data.map((item) => deleteFromCart(item.id)))
    );
  };

  return {
    getCart,
    updateCart,
    getInventory,
    addToCart,
    deleteFromCart,
    checkout,
  };
})();

const Model = (() => {
  // implement your logic for Model
  class State {
    #onChange;
    #inventory;
    #cart;

    constructor() {
      this.#inventory = []; //
      this.#cart = [];
    }
    get cart() {
      return this.#cart;
    }

    get inventory() {
      return this.#inventory;
    }

    set cart(newCart) {
      this.#cart = newCart;
      this.#onChange();
    }

    set inventory(newInventory) {
      this.#inventory = newInventory;
      this.#onChange();
    }
    
    subscribe(cb) {
      this.#onChange = cb;
    }
  }

  const {
    getCart,
    updateCart,
    getInventory,
    addToCart,
    deleteFromCart,
    checkout,
  } = API;

  return {
    State,
    getCart,
    updateCart,
    getInventory,
    addToCart,
    deleteFromCart,
    checkout,
  };
})();

const View = (() => {
  // View variables
  const ulInventoryElem = document.querySelector(".inventory__list-container");
  const ulCartElem = document.querySelector(".cart__list-container");
  const checkoutBtn = document.querySelector(".checkout-btn");

  // View helper functions
  const createElement = (tag, className, id, text) => {
    const elem = document.createElement(tag);
    if (className !== undefined) {elem.classList.add(className)};
    if (id !== undefined) {elem.setAttribute("id", id)};
    if (text !== undefined) {elem.appendChild(document.createTextNode(text))};
    return elem
  }
  
  const isInventoryAddBtn = (className) => {
    return className === "inventory__button-add";
  }
  
  const isInventorySubtractBtn = (className) => {
    return className === "inventory__button-subtract";
  }
  
  const isInventoryAddCartBtn = (className) => {
    return className === "inventory__button-addcart";
  }
  
  const isCartDeleteBtn = (className) => {
    return className === "cart__button-delete";
  }

  const createInventoryItem = (itemName, itemNumber, itemId) => {
    const divElem = createElement("div", "inventory__item-container", itemId, undefined);
    const spanElem1 = createElement("span", "inventory__item-name", undefined, itemName);
    divElem.appendChild(spanElem1);
    const btnElem1 = createElement("button", "inventory__button-subtract", undefined, "-");
    divElem.appendChild(btnElem1);    
    const spanElem2 = createElement("span", "inventory__item-number", undefined, itemNumber); // <-- number is not yet implemented
    divElem.appendChild(spanElem2);
    const btnElem2 = createElement("button", "inventory__button-add", undefined, "+");
    divElem.appendChild(btnElem2);
    const btnElem3 = createElement("button", "inventory__button-addcart", undefined, "add to cart");
    divElem.appendChild(btnElem3);
    return divElem;
  }

  
  const createCartItem = (itemName, itemNumber, itemId) => {
    const divElem = createElement("div", "cart__item-container", itemId, undefined);
    const spanElem1 = createElement("span", "cart__item-name", undefined, itemName);
    divElem.appendChild(spanElem1);
    const spanElemX = createElement("span", undefined, undefined, " x ");
    divElem.appendChild(spanElemX);
    const spanElem2 = createElement("span", "cart__item-number", undefined, itemNumber); // <-- number is not yet implemented
    divElem.appendChild(spanElem2);
    const btnElem = createElement("button", "cart__button-delete", undefined, "delete");
    divElem.appendChild(btnElem);
    return divElem;
  }

  // attempt to implement pagination
  // pagination container
  const divPaginationContainer = document.querySelector(".pagination__container");

  const renderPaginationButtons = (items) =>{
    const divElem = createElement("div", "pagination__container", undefined, undefined);
    const prevButton = createElement("button", "pagination__prev-btn", undefined, undefined);
    prevButton.appendChild(document.createTextNode("Prev"));
    divElem.appendChild(prevButton);

    const pagesElem = createElement("span", "pagination__pages", undefined, undefined);
    divElem.appendChild(pagesElem);

    const nextButton = createElement("button", "pagination__next-btn", undefined, undefined);
    nextButton.appendChild(document.createTextNode("Next"));
    divElem.appendChild(nextButton);

    
    const totalItemCount = items.length;
    const pageNum = Math.ceil(totalItemCount / itemsPerPage);

    for (let i = 0; i < pageNum; i++) {
      const button = createElement("button", "pagination__pages-btn", "p-" + (i+1).toString(), undefined); // <-- create button for pages
      button.appendChild(document.createTextNode((i + 1).toString()));
      pagesElem.appendChild(button);
    }    

    return divElem
  }
  
  const isPaginationNextButton = (className) => {
    return className === "pagination__next-btn";
  }
  const isPaginationPrevButton = (className) => {
    return className === "pagination__prev-btn";
  }
  const isPaginationPagesButton = (className) => {
    return className === "pagination__pages-btn";
  }

  // implement your logic for View, View functions
  const renderInventory = (items, currentPage) => {
    ulInventoryElem.innerHTML = "";
    items.forEach((e, i) => {
      if ((currentPage - 1) * itemsPerPage <= i && i < currentPage * itemsPerPage) {
        ulInventoryElem.appendChild(createInventoryItem(e.content, e.number, e.id));
      }
    })
    // added test pagination below
    divPaginationContainer.innerHTML = "";
    const pagination = renderPaginationButtons(items)
    divPaginationContainer.appendChild(pagination);
  }

  const renderCart = (items) => {
    ulCartElem.innerHTML = "";
    items.forEach((e, i) => {
      ulCartElem.appendChild(createCartItem(e.content, e.number, e.id));
    })
  }


  return {
    renderInventory,
    renderCart,
    ulCartElem,
    ulInventoryElem,
    isInventoryAddBtn,
    isInventorySubtractBtn,
    isInventoryAddCartBtn,
    isCartDeleteBtn,
    checkoutBtn,
    divPaginationContainer,
    isPaginationNextButton,
    isPaginationPrevButton,
    isPaginationPagesButton
  };
})();

const Controller = ((model, view) => {
  // implement your logic for Controller
  const state = new model.State();

  // pagination
  let currentPage = 1; // itemsPerPage

  const init = () => {
    model.getInventory().then((data) => {
      state.inventory = data.map((e, i) => {
        e.number = 0; // <-- track number here.
        return e;
      });
    })
    model.getCart().then((data) => {
      state.cart = data;
    })
  };

  const handleUpdateAmount = () => {
    view.ulInventoryElem.addEventListener("click", (event) => {
      if (view.isInventoryAddBtn(event.target.classList[0])) { // handle add button
        const temp = [...state.inventory];
        temp.forEach((e, i) => {
          if (e.content == event.target.parentNode.firstChild.innerText) {
            e.number++;
          }
        })
        state.inventory = temp;
      } else if (view.isInventorySubtractBtn(event.target.classList[0])) { // handle subtract button
        const temp = [...state.inventory];
        temp.forEach((e, i) => {
          if (e.content == event.target.parentNode.firstChild.innerText && e.number > 0) {
            e.number--;
          }
        })
        state.inventory = temp;
      }
    })
  };

  const handleAddToCart = () => {
    view.ulInventoryElem.addEventListener("click", (event) => {
      if (view.isInventoryAddCartBtn(event.target.classList[0])) { // handle add to cart button
        // if the item is not in cart.
        const inCart = state.cart.map((e) => e.content);
        const currId = event.target.parentNode.id; 
        if (inCart.includes(event.target.parentNode.firstChild.innerText)) { // use PUT
          const addedItem = {};
          let newNumber = 0;
          state.cart.forEach((e) => {
            if (e.content === event.target.parentNode.firstChild.innerText) {
              addedItem.content = e.content;
              newNumber += e.number;
            }
          })
          state.inventory.forEach((e) => {
            if (e.content === event.target.parentNode.firstChild.innerText) {
              newNumber += e.number;
            }
          })
          addedItem.number = newNumber;
          model.updateCart(currId, addedItem).then((data) => {
            const tempArr = state.cart.map((e) => {
                if (e.id.toString() !== currId) {
                    return e
                } else {
                    return data;
                }
            });
            state.cart = tempArr;
          })

        } else { // <-- here is if the item is not in cart, use POST
          const addItem = state.inventory.filter((e) => {
            return e.content === event.target.parentNode.firstChild.innerText && e.number > 0;
          });
          if (addItem.length === 1) {
            model.addToCart(addItem[0]).then((data) => {
              state.cart = [data, ...state.cart];
            })
          }
        }
      }
    })
  };

  const handleDelete = () => {
    view.ulCartElem.addEventListener("click", (event) => {
      if (view.isCartDeleteBtn(event.target.classList[0])) {
        const currId = event.target.parentNode.id;
        model.deleteFromCart(currId).then(() => {
          const tempArr = state.cart.filter((e) => {
            return e.id.toString() !== currId;
          });
          state.cart = tempArr;
        })
      }
    })
  };

  const handleCheckout = () => {
    view.checkoutBtn.addEventListener("click", (event) => {
      model.checkout().then(() => {
        state.cart = [];
      });
    })
  };

  const handlePagination = () => {
    view.divPaginationContainer.addEventListener("click", (event) => {
      const pageNum = Math.ceil(state.inventory.length / itemsPerPage);
      if (view.isPaginationNextButton(event.target.classList[0]) && currentPage < pageNum) {
        currentPage++;
        const temp = [...state.inventory];
        state.inventory = temp;
      }
      
      if (view.isPaginationPrevButton(event.target.classList[0]) && currentPage > 1) {
        currentPage--;
        const temp = [...state.inventory];
        state.inventory = temp;

      }
      
      if (view.isPaginationPagesButton(event.target.classList[0])) {
        currentPage = parseInt(event.target.id.split("-")[1]);
        const temp = [...state.inventory];
        state.inventory = temp;

      }
    })
  }

  const bootstrap = () => {
    state.subscribe(() => {
      view.renderInventory(state.inventory, currentPage);
      view.renderCart(state.cart);
    });

    init();
    handleUpdateAmount();
    handleAddToCart();
    handleDelete();
    handleCheckout();
    handlePagination();
  };

  return {
    bootstrap,
  };
})(Model, View);

Controller.bootstrap();
