import React, { useContext, useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import { Box, Button, Drawer, Grid, MenuItem, Pagination, Paper, Stack, Typography } from '@mui/material';
import dummyData from '../../dummyData/dummy';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import { StoreContext } from '../../context/StoreContext';
import Filters from '../filters/Filters';

const FoodDisplay = ({ category }) => {
  const { setBuyPage, setFoodItem } = useContext(StoreContext);
//  const [cartItems, setCartItems] = useState([]);
const { cartItems, addToCart, countInc, countDec } = useContext(StoreContext);  
  const [OpenDrawer, setDrawerOpen] = useState(false);
  const [searchResults, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [page, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleChange = (event, value) => {
    setPageNo(value);
  };

  // Add item to cart or increase quantity if it exists
 {/* const addToCart = (item) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find(cartItem => cartItem.productName === item.productName);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.productName === item.productName
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { productName: item.productName, quantity: 1 }];
      }
    });
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

  */}

  // Handle category filtering logic
  useEffect(() => {
    const filteredData = dummyData.filter(item =>
      category === "All" || item.category.toLowerCase() === category.toLowerCase()
    );
    setFilteredResults(filteredData);
    setPageNo(1);
    setTotalPages(Math.ceil(filteredData.length / 6));
  }, [category]);

  // Paginate through the filtered results
  useEffect(() => {
    const startIndex = (page - 1) * 6;
    const paginatedData = filteredResults.slice(startIndex, startIndex + 6);
    setResults(paginatedData);
  }, [page, filteredResults]);

  return (
    <Container maxWidth="100%">
      <Typography sx={{ fontFamily: 'Outfit', fontWeight: 500, fontSize: '2rem' }}>
        Search results
      </Typography>
      <Container sx={{ my: 1.5 }}>
        <Stack direction='row' spacing={2}>
          <MenuItem onClick={() => setDrawerOpen(true)} sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button>Filter</Button>
            <FilterListIcon />
          </MenuItem>
          <Drawer open={OpenDrawer} onClose={() => setDrawerOpen(false)}>
            <Filters />
          </Drawer>
          <MenuItem sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Typography>Sort</Typography>
            <SortIcon />
          </MenuItem>
        </Stack>
      </Container>
      <Box>
        <Grid container spacing={3}>
          {searchResults.map((item, index) => {
            const cartItem = cartItems.find(cartItem => cartItem.productName === item.productName);
            const quantity = cartItem ? cartItem.quantity : 0;

            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper elevation={3} sx={{ p: 2, cursor: 'pointer' }}>
                  <Container onClick={() => { setBuyPage(true); setFoodItem(item); }} sx={{ padding: 0 }}>
                    <Box>
                      <img style={{ borderRadius: '5px', width: '100%' }} src={item.imageUrl} alt={item.productName} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontFamily: 'Outfit', fontWeight: 'semibold' }} variant='h5'>
                        {item.productName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>
                        ₹{Math.min(...item.prices.map(p => p.price))}
                      </Typography>
                    </Box>
                  </Container>
                  <Box sx={{ display: 'flex', marginTop: '20px' }}>
                    <div style={{ fontFamily: 'Outfit', backgroundColor: 'orange', color: 'white', borderRadius: '20px', padding: '10px 20px', marginRight: '10px' }}>
                      {quantity > 0 ? (
                        <>
                          <button
                            onClick={() => countDec(item)}
                            style={{ border: '1px solid black', backgroundColor: 'white', color: 'black', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', marginRight: '5px' }}>
                            -
                          </button>
                          <span style={{ display: 'inline-block', border: '1px solid black', backgroundColor: 'white', color: 'black', borderRadius: '8px', padding: '8px 12px', minWidth: '30px', textAlign: 'center' }}>
                            {quantity}
                          </span>
                          <button
                            onClick={() => countInc(item)}
                            style={{ border: '1px solid black', backgroundColor: 'white', color: 'black', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', marginLeft: '5px' }}>
                            +
                          </button>
                        </>
                      ) : (
                        <div onClick={() => addToCart(item, null)}>Add to Cart</div>
                      )}
                    </div>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
      <Pagination onChange={handleChange} variant="outlined" shape="rounded" sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }} count={totalPages} color='primary' />
    </Container>
  );
};

export default FoodDisplay;
