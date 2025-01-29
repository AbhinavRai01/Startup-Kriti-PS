import React, { useContext, useEffect, useState } from 'react';
import './FoodItem.css';
import { Box, Container, Grid, Paper, Typography, Divider, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { StoreContext } from '../../context/StoreContext';

function FoodItem() {
  const { cartItems, addToCart, countInc, countDec,changeFarmInCart } = useContext(StoreContext);
  const { foodItem, setFoodItem, setBuyPage } = useContext(StoreContext);
  const [count, setCount] = useState(10);
  const [addCount, setAddCount] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const [currentFarm, setFarm] = useState(foodItem.prices[0]);

  // Handling count of items
  const handleCount = (event) => {
    setCount(event.target.value);
  };

  const addItemInc = () => {
    setAddCount(addCount + 1);
  };

  const decreaseCountAdd = () => {
    if (addCount - 1 === 0) {
      setIsAdding(false);
      return;
    }
    setAddCount(addCount - 1);
  };

  // Go back to the previous page
  const handleBackToMainPag = () => {
    setFoodItem({});
    setBuyPage(false);
  };

  // Find the cart item and its quantity
  const cartItem = cartItems.find((cartItem) => cartItem.productName === foodItem.productName);
  const quantity = cartItem ? cartItem.quantity : 0;

  // Find the farm with the least price
  const findFarmWithLeastPrice = () => {
    return foodItem.prices.reduce((minFarm, currentFarm) => {
      return currentFarm.price < minFarm.price ? currentFarm : minFarm;
    });
  };

  const leastPriceFarm = findFarmWithLeastPrice();

  return (
    <Container sx={{ paddingTop: 2 }}>
      <Box sx={{ display: 'flex', marginBottom: 2, justifyContent: 'flex-start' }}>
        <ArrowBackIcon sx={{ cursor: 'pointer' }} onClick={handleBackToMainPag} />
      </Box>

      <Grid container spacing={4}>

        {/* Left Column (Product Info) */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <Box>
              <Typography variant='h6' sx={{ fontWeight: 300, fontFamily: 'Outfit' }}>
                {foodItem.category}
              </Typography>
              <Typography variant='h4' sx={{ marginBottom: 2, fontWeight: 500, fontFamily: 'Outfit' }}>
                {foodItem.productName}
              </Typography>
              <Divider sx={{ marginBottom: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }}>
                <Typography variant='h6' sx={{ fontWeight: 500 }}>
                  ₹{currentFarm.price}/ kg
                </Typography>
                <Typography variant='body2' sx={{ alignSelf: 'flex-end' }}>
                  (inclusive of all taxes)
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', marginTop: '10px', marginBottom: '10px' }}>
                <div style={{ fontFamily: 'Outfit', backgroundColor: 'orange', color: 'white', borderRadius: '20px', padding: '10px 20px', marginRight: '10px' }}>
                  {quantity > 0 ? (
                    <>
                      <button
                        onClick={() => countDec(foodItem)}
                        style={{ border: '1px solid black', backgroundColor: 'white', color: 'black', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', marginRight: '5px' }}>
                        -
                      </button>
                      <span style={{ display: 'inline-block', border: '1px solid black', backgroundColor: 'white', color: 'black', borderRadius: '8px', padding: '8px 12px', minWidth: '30px', textAlign: 'center' }}>
                        {quantity}
                      </span>
                      <button
                        onClick={() => countInc(foodItem)}
                        style={{ border: '1px solid black', backgroundColor: 'white', color: 'black', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', marginLeft: '5px' }}>
                        +
                      </button>
                    </>
                  ) : (
                    <div onClick={() => addToCart(item, currentFarm)}>Add to Cart</div>
                  )}
                </div>
              </Box>
                  <Divider></Divider>
              <Typography variant="h5" sx={{ fontWeight: '400', marginTop: 2 , fontFamily: 'Outfit'}}>
                Choose Your Farm:
              </Typography>

              <RadioGroup
                name="farmSelection"
                onChange={(event) => {
                  setFarm(foodItem.prices.find((farm) => farm._id.$oid === event.target.value));
                  changeFarmInCart(foodItem, foodItem.prices.find((farm) => farm._id.$oid === event.target.value));
                }}
              >
                {foodItem.prices.map((farm) => (
                  <Box key={farm._id.$oid} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, marginTop: 3 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: '400' }}>
                        Farm ID: {farm.soldBy.$oid}
                      </Typography>
                      <Typography variant='body2'>Price: ₹{farm.price} per kg</Typography>
                    </Box>
                    <FormControlLabel value={farm._id.$oid} control={<Radio />} label="" />
                  </Box>
                ))}
              </RadioGroup>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column (Product Image & Details) */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <img style={{ width: '100%', borderRadius: '5px', marginBottom: 2 }} src={foodItem.imageUrl} alt={foodItem.productName} />
            <Typography variant='h5'>Product Details</Typography>
            <Typography variant='h6' sx={{ marginTop: 2 }}>Description</Typography>
            <Typography>{foodItem.description}</Typography>
          </Paper>
        </Grid>

      </Grid>
    </Container>
  );
}

export default FoodItem;
