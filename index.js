const API = (() => {
  const URL = "http://localhost:3000";

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

    static increment(state, item) {
      console.log(state.inventory);
      const tempInventory = state.inventory.map((e, i) => {
        if (e.content == item) {
          e.number = parseInt(e.number) + 1;
        }
        return e;
      });
      console.log(tempInventory);
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

  // implement your logic for View, View functions
  const renderInventory = (items) => {
    ulInventoryElem.innerHTML = "";
    items.forEach((e, i) => {
      ulInventoryElem.appendChild(createInventoryItem(e.content, e.number, e.id));
    })
}


  return {
    renderInventory,
    ulInventoryElem,
    isInventoryAddBtn,
    isInventorySubtractBtn,
    isInventoryAddCartBtn,
  };
})();

const Controller = ((model, view) => {
  // implement your logic for Controller
  const state = new model.State();

  const init = () => {
    model.getInventory().then((data) => {
      state.inventory = data.map((e, i) => {
        e.number = 0; // <-- track number here.
        return e;
      });
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
        console.log("add to cart");
        console.log(state.inventory);
        const addItem = state.inventory.filter((e) => {
          return e.content === event.target.parentNode.firstChild.innerText && e.number > 0;
        });

        console.log(addItem);
      }
    })
  };

  const handleDelete = () => {};

  const handleCheckout = () => {};

  const bootstrap = () => {
    state.subscribe(() => {
      view.renderInventory(state.inventory)
    });

    init();
    handleUpdateAmount();
    handleAddToCart();
    
  };

  return {
    bootstrap,
  };
})(Model, View);

Controller.bootstrap();
