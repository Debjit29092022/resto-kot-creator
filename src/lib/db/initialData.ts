// Add initial menu data
export const addInitialMenuData = (store: IDBObjectStore) => {
  // Traditional Wings
  store.add({
    category: 'TRADITIONAL WINGS',
    name: 'AAM KASHMUNDI WINGS',
    prices: { '4 PCS': 125, '8 PCS': 175, '12 PCS': 425 },
    isVeg: false
  });
  store.add({
    category: 'TRADITIONAL WINGS',
    name: 'DARJEELING DALLE WINGS',
    prices: { '4 PCS': 125, '8 PCS': 175, '12 PCS': 425 },
    isVeg: false
  });
  store.add({
    category: 'TRADITIONAL WINGS',
    name: 'STICKY SOY GINGER WINGS',
    prices: { '4 PCS': 125, '8 PCS': 175, '12 PCS': 425 },
    isVeg: false
  });
  store.add({
    category: 'TRADITIONAL WINGS',
    name: 'CLASSIC CRACKLING CHICKEN WINGS',
    prices: { '4 PCS': 125, '8 PCS': 175, '12 PCS': 425 },
    isVeg: false
  });

  // Boneless Wings
  store.add({
    category: 'BONELESS WINGS',
    name: 'AAM KASHMUNDI BONELESS WINGS',
    prices: { '4 PCS': 125, '8 PCS': 175, '12 PCS': 425 },
    isVeg: false
  });
  store.add({
    category: 'BONELESS WINGS',
    name: 'BONELESS WINGS IN DALLE KHURSANI SAUCE',
    prices: { '4 PCS': 125, '8 PCS': 175, '12 PCS': 425 },
    isVeg: false
  });
  store.add({
    category: 'BONELESS WINGS',
    name: 'STICKY SOY GINGER BONELESS WINGS',
    prices: { '4 PCS': 125, '8 PCS': 175, '12 PCS': 425 },
    isVeg: false
  });
  store.add({
    category: 'BONELESS WINGS',
    name: 'BBQ BONELESS WINGS',
    prices: { '4 PCS': 125, '8 PCS': 175, '12 PCS': 425 },
    isVeg: false
  });

  // Wingers
  store.add({
    category: 'WINGERS',
    name: 'AAM KASHMUNDI WINGER',
    price: 135,
    description: 'ADD ON BURGER BREAD WITH BONELESS WINGS',
    isVeg: false
  });
  store.add({
    category: 'WINGERS',
    name: 'DALLE KHURSANI SAUCE WINGER',
    price: 135,
    description: 'ADD ON BURGER BREAD WITH BONELESS WINGS',
    isVeg: false
  });
  store.add({
    category: 'WINGERS',
    name: 'STICKY SOY GINGER WINGER',
    price: 135,
    description: 'ADD ON BURGER BREAD WITH BONELESS WINGS',
    isVeg: false
  });
  store.add({
    category: 'WINGERS',
    name: 'BBQ BONELESS WINGER',
    price: 135,
    description: 'ADD ON BURGER BREAD WITH BONELESS WINGS',
    isVeg: false
  });
  store.add({
    category: 'WINGERS',
    name: 'FALAFEL WITH HOT SAUCE HUMMUS BURGER',
    price: 135,
    description: 'ADD ON BURGER BREAD WITH BONELESS WINGS',
    isVeg: true
  });

  // Bad Wow (Baos)
  store.add({
    category: 'BAO WOW',
    name: 'SESAME CHICKEN BAO',
    prices: { '1 PC': 75, '2 PCS': 135, '3 PCS': 195 },
    isVeg: false
  });
  store.add({
    category: 'BAO WOW',
    name: 'CHICKEN TIKKA BAO',
    prices: { '1 PC': 75, '2 PCS': 135, '3 PCS': 195 },
    isVeg: false
  });
  store.add({
    category: 'BAO WOW',
    name: 'WILD MUSHROOM BAO',
    prices: { '1 PC': 75, '2 PCS': 135, '3 PCS': 195 },
    isVeg: true
  });
  store.add({
    category: 'BAO WOW',
    name: 'PANEER BHURJI BAO',
    prices: { '1 PC': 75, '2 PCS': 135, '3 PCS': 195 },
    isVeg: true
  });

  // Add Ons
  store.add({
    category: 'ADD ONS',
    name: 'REGULAR FRIES',
    price: 65,
    isVeg: true
  });
  store.add({
    category: 'ADD ONS',
    name: 'PERI PERI FRIES',
    price: 75,
    isVeg: true
  });
  store.add({
    category: 'ADD ONS',
    name: 'ZINGER FRIES',
    price: 65,
    isVeg: true
  });

  // Signature Beverages
  store.add({
    category: 'SIGNATURE BEVERAGES',
    name: 'CUCUMBER FIZZ',
    price: 75,
    isVeg: true
  });
  store.add({
    category: 'SIGNATURE BEVERAGES',
    name: 'WATERMELON COOLER',
    price: 75,
    isVeg: true
  });

  // Other Beverages
  store.add({
    category: 'OTHER BEVERAGES',
    name: 'BOTTLED WATER (500 ML)',
    price: 0, // MRP
    description: 'MRP',
    isVeg: true
  });
  store.add({
    category: 'OTHER BEVERAGES',
    name: 'COKE/SPRITE/SODA BY THE GLASS',
    price: 30,
    description: '250 ML',
    isVeg: true
  });
};
