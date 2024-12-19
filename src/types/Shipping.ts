interface Shipping {
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  shippingMethod: string;
}

export default Shipping;