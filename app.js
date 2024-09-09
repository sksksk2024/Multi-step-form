const steps = document.querySelectorAll(".stp");
const circleSteps = document.querySelectorAll(".step");
const formInputs = document.querySelectorAll(".step-1 form input");
const plans = document.querySelectorAll(".plan-card");
const switcher = document.querySelector(".switch");
const addons = document.querySelectorAll(".box");
const total = document.querySelector(".total b");
const planPrice = document.querySelector(".plan-price");
let time;
let currentStep = 1;
let currentCircle = 0;
const obj = {
  plan: null,
  kind: null,
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
    document.querySelector(`.step-${currentStep}`).style.display = "none";
    if (currentStep < 5 && validateForm()) {
      currentStep++;
      currentCircle++;
      setTotal();
    }
    document.querySelector(`.step-${currentStep}`).style.display = "flex";
    circleSteps[currentCircle].classList.add("active");
    summary(obj);
  });
});

function summary(obj) {
  const planName = document.querySelector(".plan-name");
  const planPrice = document.querySelector(".plan-price");
  planPrice.innerHTML = `${obj.price.innerText}`;
  planName.innerHTML = `${obj.plan.innerText} (${obj.kind ? "yearly" : "monthly"})`;

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
  for (let i = 0; i < formInputs.length; i++) {
    if (!formInputs[i].value) {
      valid = false;
      formInputs[i].classList.add("err");
      findLabel(formInputs[i]).nextElementSibling.style.display = "flex";
    } else {
      valid = true;
      formInputs[i].classList.remove("err");
      findLabel(formInputs[i]).nextElementSibling.style.display = "none";
    }
  }
  return valid;
}

function findLabel(el) {
  const idVal = el.id;
  const labels = document.getElementsByTagName("label");
  for (let i = 0; i < labels.length; i++) {
    if (labels[i].htmlFor == idVal) return labels[i];
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
  const val = switcher.querySelector("input").checked;
  if (val) {
    document.querySelector(".monthly").classList.remove("sw-active");
    document.querySelector(".yearly").classList.add("sw-active");
  } else {
    document.querySelector(".monthly").classList.add("sw-active");
    document.querySelector(".yearly").classList.remove("sw-active");
  }
  switchPrice(val);
  obj.kind = val;
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

  // Update plan prices
  prices.forEach((price, index) => {
    price.innerHTML = checked
      ? `$${yearlyPrices[index].toFixed(2)}/yr`
      : `$${monthlyPrices[index].toFixed(2)}/mo`;
  });

  // Update add-on prices
  addOnPrices.forEach((price, index) => {
    price.innerHTML = checked
      ? `+$${addOnYearlyPrices[index].toFixed(2)}/yr`
      : `+$${addOnMonthlyPrices[index].toFixed(2)}/mo`;
  });

  setTime(checked); // Update the time (monthly/yearly)
  setTotal(); // Recalculate and update the total
}

// function switchPrice(checked) {
//   const yearlyPrice = [90, 120, 150];
//   const monthlyPrice = [9, 12, 15];
//   const addOnYearlyPrices = [10, 20, 20]; // Prices for add-ons in yearly mode
//   const addOnMonthlyPrices = [1, 2, 2]; // Prices for add-ons in monthly mode

//   const prices = document.querySelectorAll(".plan-priced");
//   const addOnPrices = document.querySelectorAll(".box .price"); // Select add-on prices
  
//   if (checked) {
//     prices[0].innerHTML = `$${yearlyPrice[0].toFixed(2)}/yr`;
//     prices[1].innerHTML = `$${yearlyPrice[1].toFixed(2)}/yr`;
//     prices[2].innerHTML = `$${yearlyPrice[2].toFixed(2)}/yr`;
//     setTime(true);

//     addOnPrices.forEach((price, index) => {
//       price.innerHTML = `+$${addOnYearlyPrices[index].toFixed(2)}/yr`;
//     });
//   } else {
//     prices[0].innerHTML = `$${monthlyPrice[0].toFixed(2)}/mo`;
//     prices[1].innerHTML = `$${monthlyPrice[1].toFixed(2)}/mo`;
//     prices[2].innerHTML = `$${monthlyPrice[2].toFixed(2)}/mo`;
//     setTime(false);

//     addOnPrices.forEach((price, index) => {
//       price.innerHTML = `+$${addOnMonthlyPrices[index].toFixed(2)}/mo`;
//     });
//   }
// }

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
      if (attr == ad) {
        addon.remove();
      }
    });
  }
}

function setTotal() {
  const planPriceValue = parseFloat(planPrice.innerHTML.replace(/\D/g, "")); // Get the numeric value of the plan price
  const addonPrices = document.querySelectorAll(".selected-addon .servic-price");

  let totalPrice = planPriceValue; // Start with the plan price

  addonPrices.forEach((priceElement) => {
    const addonPriceValue = parseFloat(priceElement.innerHTML.replace(/\D/g, ""));
    totalPrice += addonPriceValue; // Add each add-on price to the total
  });

  // Display the total with two decimals and the correct time unit
  total.innerHTML = `$${totalPrice.toFixed(2)}/${time ? "yr" : "mo"}`;
}

function setTime(t) {
  return (time = t);
}

function calculateTotal() {
  const planPriceValue = parseFloat(planPrice.innerHTML.replace(/\D/g, ""));
  const addonPrices = document.querySelectorAll(".selected-addon .servic-price");

  let totalPrice = planPriceValue;

  addonPrices.forEach((priceElement) => {
    const addonPriceValue = parseFloat(priceElement.innerHTML.replace(/\D/g, ""));
    totalPrice += addonPriceValue;
  });

  return totalPrice;
}