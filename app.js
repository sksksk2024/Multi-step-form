const steps = document.querySelectorAll(".stp");
const circleSteps = document.querySelectorAll(".step");
const formInputs = document.querySelectorAll(".step-1 form input");
const plans = document.querySelectorAll(".plan-card");
const switcher = document.querySelector(".switch");
const addons = document.querySelectorAll(".box");
const total = document.querySelector(".total b");
const planPrice = document.querySelector(".plan-price");

let time; // To keep track of whether it's yearly or monthly
let currentStep = 1;
let currentCircle = 0;

const obj = {
  plan: null,
  kind: null, // true for yearly, false for monthly
  price: null,
};

steps.forEach((step) => {
  const nextBtn = step.querySelector(".next-stp");
  const prevBtn = step.querySelector(".prev-stp");
  
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      document.querySelector(`.step-${currentStep}`).style.display = "none";
      currentStep--;
      document.querySelector(`.step-${currentStep}`).style.display = "flex";
      circleSteps[currentCircle].classList.remove("active");
      currentCircle--;
    });
  }

  nextBtn.addEventListener("click", () => {
    if (currentStep < 5 && validateForm()) {
      document.querySelector(`.step-${currentStep}`).style.display = "none";
      currentStep++;
      currentCircle++;
      setTotal(); // Ensure total is updated before moving to the next step
      document.querySelector(`.step-${currentStep}`).style.display = "flex";
      circleSteps[currentCircle].classList.add("active");
      summary(obj); // Update summary with the current selected options
    }
  });
});

function summary(obj) {
  const planName = document.querySelector(".plan-name");
  const planPriceElement = document.querySelector(".plan-price");
  
  // Check if obj.price is valid before trying to use it
  if (obj.price) {
    planPriceElement.innerHTML = `${obj.price.innerText}`;
    planName.innerHTML = `${obj.plan.innerText} (${obj.kind ? "yearly" : "monthly"})`;
  }

  const addOns = document.querySelectorAll(".selected-addon .servic-price");
  addOns.forEach(addOn => {
    if (obj.kind) {
      addOn.innerHTML = addOn.innerHTML.replace('/mo', '/yr');
    } else {
      addOn.innerHTML = addOn.innerHTML.replace('/yr', '/mo');
    }
  });

  setTotal(); // Update the total in the summary as well
}

function validateForm() {
  let valid = true;
  formInputs.forEach(input => {
    if (!input.value) {
      valid = false;
      input.classList.add("err");
      findLabel(input).nextElementSibling.style.display = "flex";
    } else {
      input.classList.remove("err");
      findLabel(input).nextElementSibling.style.display = "none";
    }
  });
  return valid;
}

function findLabel(el) {
  const idVal = el.id;
  const labels = document.getElementsByTagName("label");
  for (let i = 0; i < labels.length; i++) {
    if (labels[i].htmlFor === idVal) return labels[i];
  }
}

plans.forEach((plan) => {
  plan.addEventListener("click", () => {
    document.querySelector(".selected").classList.remove("selected");
    plan.classList.add("selected");
    const planName = plan.querySelector("b");
    const planPrice = plan.querySelector(".plan-priced");
    obj.plan = planName;
    obj.price = planPrice;
  });
});

switcher.addEventListener("click", () => {
  const isYearly = switcher.querySelector("input").checked;
  obj.kind = isYearly; // Update the type in obj (yearly or monthly)
  
  if (isYearly) {
    document.querySelector(".monthly").classList.remove("sw-active");
    document.querySelector(".yearly").classList.add("sw-active");
  } else {
    document.querySelector(".monthly").classList.add("sw-active");
    document.querySelector(".yearly").classList.remove("sw-active");
  }

  switchPrice(isYearly);
  setTotal(); // Recalculate total when the time changes
});

addons.forEach((addon) => {
  addon.addEventListener("click", (e) => {
    const addonSelect = addon.querySelector("input");
    const ID = addon.getAttribute("data-id");
    if (addonSelect.checked) {
      addonSelect.checked = false;
      addon.classList.remove("ad-selected");
      showAddon(ID, false);
    } else {
      addonSelect.checked = true;
      addon.classList.add("ad-selected");
      showAddon(addon, true);
      e.preventDefault();
    }
  });
});

function switchPrice(checked) {
  const monthlyPrices = [9, 12, 15]; // Plan prices in monthly mode
  const yearlyPrices = monthlyPrices.map(price => price * 12); // Plan prices in yearly mode

  const addOnMonthlyPrices = [1, 2, 2]; // Add-on prices in monthly mode
  const addOnYearlyPrices = addOnMonthlyPrices.map(price => price * 12); // Add-on prices in yearly mode

  const prices = document.querySelectorAll(".plan-priced");
  const addOnPrices = document.querySelectorAll(".box .price");

  prices.forEach((price, index) => {
    price.innerHTML = checked
      ? `$${yearlyPrices[index]}/yr`
      : `$${monthlyPrices[index]}/mo`;
  });

  addOnPrices.forEach((price, index) => {
    price.innerHTML = checked
      ? `+$${addOnYearlyPrices[index]}/yr`
      : `+$${addOnMonthlyPrices[index]}/mo`;
  });

  setTime(checked);
}

function showAddon(ad, val) {
  const temp = document.getElementsByTagName("template")[0];
  const clone = temp.content.cloneNode(true);
  const serviceName = clone.querySelector(".service-name");
  const servicePrice = clone.querySelector(".servic-price");
  const serviceID = clone.querySelector(".selected-addon");

  if (ad && val) {
    serviceName.innerText = ad.querySelector("label").innerText;
    servicePrice.innerText = ad.querySelector(".price").innerText;
    serviceID.setAttribute("data-id", ad.dataset.id);
    document.querySelector(".addons").appendChild(clone);
  } else {
    const addons = document.querySelectorAll(".selected-addon");
    addons.forEach((addon) => {
      const attr = addon.getAttribute("data-id");
      if (attr === ad) {
        addon.remove();
      }
    });
  }
}

function setTotal() {
  const planPriceValue = parseFloat(planPrice.innerHTML.replace(/\D/g, "")); // Get the numeric value of the plan price
  const addonPrices = document.querySelectorAll(".selected-addon .servic-price");

  let totalPrice = planPriceValue;

  addonPrices.forEach((priceElement) => {
    const addonPriceValue = parseFloat(priceElement.innerHTML.replace(/\D/g, ""));
    totalPrice += addonPriceValue; // Add each add-on price to the total
  });

  total.innerHTML = `$${totalPrice}/${time ? "yr" : "mo"}`;
}

function setTime(t) {
  return (time = t);
}


switcher.addEventListener("click", () => {
  const val = switcher.querySelector("input").checked;
  if (val) {
    document.querySelector(".monthly").classList.remove("sw-active");
    document.querySelector(".yearly").classList.add("sw-active");
  } else {
    document.querySelector(".monthly").classList.add("sw-active");
    document.querySelector(".yearly").classList.remove("sw-active");
  }
  
  // Uncheck all selected add-ons and remove them from the summary
  resetAddOns();

  // Update the pricing display and recalculate the total
  switchPrice(val);
  obj.kind = val;
  setTotal(); // Recalculate the total after resetting add-ons
});

function resetAddOns() {
  // Uncheck all add-ons
  addons.forEach((addon) => {
    const addonSelect = addon.querySelector("input");
    const ID = addon.getAttribute("data-id");

    if (addonSelect.checked) {
      addonSelect.checked = false;
      addon.classList.remove("ad-selected");
      showAddon(ID, false); // Remove from summary
    }
  });

  // Clear add-on selections in the summary
  const selectedAddons = document.querySelectorAll(".selected-addon");
  selectedAddons.forEach((addon) => addon.remove());
}

// Existing functions like summary, validateForm, findLabel, plans event listeners, etc...