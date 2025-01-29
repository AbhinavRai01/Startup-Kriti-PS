import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState([]);
    const url = "http://localhost:4000"
    const [token,setToken] = useState("")
    const [food_list,setFoodList] = useState([])
    const [foodItem,setFoodItem]=useState({})
    const [BuyPage,setBuyPage]=useState(false)
    const [filterFood,setFilterFood]=useState(null);
    const [filterCat,setFilterCat]=useState(null)

    const removeItem = (id) => {


    }


    const addToCart = (item, farm) => {
        setCartItems((prevCart) => {
          const existingItem = prevCart.find(cartItem => cartItem.productName === item.productName);
          if (existingItem) {
            return prevCart.map(cartItem =>
              cartItem.productName === item.productName
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            );
          } else {
            const farmObj = farm ? farm: (findFarmIdOfLeastPrice(item));
            console.log(cartItems);
            return [...prevCart, { productName: item.productName, quantity: 1, farmObj:farmObj}];
            
          }
        });
      };

      const changeFarmInCart = (item, newFarm) => {
        setCartItems((prevCart) => {
          return prevCart.map((cartItem) => {
            if (cartItem.productName === item.productName) {
              // Update the farm object for the item
              return { ...cartItem, farmObj: newFarm };
            }
            return cartItem; // Leave other items unchanged
          });
        });
      };
    

      const findFarmIdOfLeastPrice = (item) => {
        if (!item.prices || item.prices.length === 0) return null; 

        const price = 0;
      
        const minPriceEntry = item.prices.reduce((min, current) => 
          current.price < min.price ? current : min 
        );
      
        return minPriceEntry; 
      };
    
      // Increase item quantity in cart
      const countInc = (item) => {
        setCartItems((prevCart) =>
          prevCart.map(cartItem =>
            cartItem.productName === item.productName
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          )
        );
      };
    
      // Decrease item quantity in cart
      const countDec = (item) => {
        setCartItems((prevCart) =>
          prevCart
            .map(cartItem =>
              cartItem.productName === item.productName
                ? { ...cartItem, quantity: cartItem.quantity - 1 }
                : cartItem
            )
            .filter(cartItem => cartItem.quantity > 0) // Remove item if quantity reaches 0
        );
      };

      const getTotalCartAmount = () => {
        let totalAmount = 0;
        console.log(cartItems);
        // Use for...of to loop through each item in cartItems
        for (const item of cartItems) {
            // Check if farmObj exists and then calculate the price
            if (item.farmObj) {
                totalAmount += item.farmObj.price * item.quantity;
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url+"/api/food/list");
        setFoodList(response.data.data)
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCartItems(response.data.cartData);
    }


    useEffect(()=>{
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    },[])


    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        countDec,
        countInc,
        getTotalCartAmount,
        url,
        token,
        setToken,
        foodItem,
        setFoodItem,
        BuyPage,
        setBuyPage,
        filterFood,setFilterFood,
        filterCat,setFilterCat, changeFarmInCart
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;