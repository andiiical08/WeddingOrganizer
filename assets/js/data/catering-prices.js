/* Demo configuration only. Replace values and mode only after official approval. */
window.RAESSA_CATERING_DATA = {
  mode: "demo",
  verified: false,
  minimumOrder: 250,
  packages: {
    essential: {
      label: "Essential Menu",
      pricePerPortion: 95000,
      included: ["Food & beverage"],
      extras: {
        buffetEquipment: null,
        serviceStaff: null,
        deliverySetup: null,
        tax: null,
      },
    },
    signature: {
      label: "Signature Menu",
      pricePerPortion: 125000,
      included: ["Food & beverage"],
      extras: {
        buffetEquipment: null,
        serviceStaff: null,
        deliverySetup: null,
        tax: null,
      },
    },
    premium: {
      label: "Premium Menu",
      pricePerPortion: 150000,
      included: ["Food & beverage"],
      extras: {
        buffetEquipment: null,
        serviceStaff: null,
        deliverySetup: null,
        tax: null,
      },
    },
  },
  services: { buffet: "Buffet / Prasmanan", served: "Served Dining" },
};
