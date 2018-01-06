let nextOrderNumber = 100;

export const OrderNumberSequenceGenerator = {
  next() {
    let orderNumber = nextOrderNumber;

    if (nextOrderNumber < 200) {
      nextOrderNumber += 1;
    } else {
      nextOrderNumber = 100;
    }

    return orderNumber;
  }
};
