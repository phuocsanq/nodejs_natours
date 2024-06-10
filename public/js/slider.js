// //  Script.js 
// const rangevalue =  
//     document.querySelector(".slider-container .price-slider"); 
// const rangeInputvalue =  
//     document.querySelectorAll(".range-input input"); 
  
// // Set the price gap 
// let priceGap = 500; 
  
// // Adding event listners to price input elements 
// const priceInputvalue =  
//     document.querySelectorAll(".price-input input"); 
// for (let i = 0; i < priceInputvalue.length; i++) { 
//     priceInputvalue[i].addEventListener("input", e => { 
  
//         // Parse min and max values of the range input 
//         let minp = parseInt(priceInputvalue[0].value); 
//         let maxp = parseInt(priceInputvalue[1].value); 
//         let diff = maxp - minp 
  
//         if (minp < 0) { 
//             alert("minimum price cannot be less than 0"); 
//             priceInputvalue[0].value = 0; 
//             minp = 0; 
//         } 
  
//         if (maxp > 100000000) { 
//             alert("maximum price cannot be greater than 100000000"); 
//             priceInputvalue[1].value = 100000000; 
//             maxp = 100000000; 
//         } 
  
//         if (minp > maxp - priceGap) { 
//             priceInputvalue[0].value = maxp - priceGap; 
//             minp = maxp - priceGap; 
  
//             if (minp < 0) { 
//                 priceInputvalue[0].value = 0; 
//                 minp = 0; 
//             } 
//         } 
  
//         // Check if the price gap is met  
//         // and max price is within the range 
//         if (diff >= priceGap && maxp <= rangeInputvalue[1].max) { 
//             if (e.target.className === "min-input") { 
//                 rangeInputvalue[0].value = minp; 
//                 let value1 = rangeInputvalue[0].max; 
//                 rangevalue.style.left = `${(minp / value1) * 100}%`; 
//             } 
//             else { 
//                 rangeInputvalue[1].value = maxp; 
//                 let value2 = rangeInputvalue[1].max; 
//                 rangevalue.style.right =  
//                     `${100 - (maxp / value2) * 100}%`; 
//             } 
//         } 
//     }); 
  
//     // Add event listeners to range input elements 
//     for (let i = 0; i < rangeInputvalue.length; i++) { 
//         rangeInputvalue[i].addEventListener("input", e => { 
//             let minVal =  
//                 parseInt(rangeInputvalue[0].value); 
//             let maxVal =  
//                 parseInt(rangeInputvalue[1].value); 
  
//             let diff = maxVal - minVal 
              
//             // Check if the price gap is exceeded 
//             if (diff < priceGap) { 
              
//                 // Check if the input is the min range input 
//                 if (e.target.className === "min-range") { 
//                     rangeInputvalue[0].value = maxVal - priceGap; 
//                 } 
//                 else { 
//                     rangeInputvalue[1].value = minVal + priceGap; 
//                 } 
//             } 
//             else { 
              
//                 // Update price inputs and range progress 
//                 priceInputvalue[0].value = minVal; 
//                 priceInputvalue[1].value = maxVal; 
//                 rangevalue.style.left = 
//                     `${(minVal / rangeInputvalue[0].max) * 100}%`; 
//                 rangevalue.style.right = 
//                     `${100 - (maxVal / rangeInputvalue[1].max) * 100}%`; 
//             } 
//         }); 
//     } 
// }

// Script.js

// AutoNumeric instances
let minAutoNumeric, maxAutoNumeric;

document.addEventListener("DOMContentLoaded", function () {
    // Initialize AutoNumeric instances
    const minInput = document.querySelector(".min-input");
    const maxInput = document.querySelector(".max-input");

    minAutoNumeric = new AutoNumeric(minInput, {
        digitGroupSeparator: '.',
        decimalCharacter: ',',
        decimalPlaces: 0,
        currencySymbol: '',
        unformatOnSubmit: true,
    });

    maxAutoNumeric = new AutoNumeric(maxInput, {
        digitGroupSeparator: '.',
        decimalCharacter: ',',
        decimalPlaces: 0,
        currencySymbol: '',
        unformatOnSubmit: true,
    });

    // Select range and price input elements
    const rangeValue = document.querySelector(".slider-container .price-slider");
    const rangeInputValue = document.querySelectorAll(".range-input input");
    const priceInputValue = document.querySelectorAll(".price-input input");

    // Set the price gap
    let priceGap = 500;

    // Function to sync AutoNumeric input with slider
    function syncInputWithSlider(autoNumericInstance, rangeInput, slider) {
        autoNumericInstance.set(rangeInput.value);
        slider.value = autoNumericInstance.getNumber();
    }

    // Function to sync slider with AutoNumeric input
    function syncSliderWithInput(rangeInput, autoNumericInstance) {
        rangeInput.value = autoNumericInstance.getNumber();
        autoNumericInstance.set(rangeInput.value);
    }

    // Adding event listeners to price input elements
    for (let i = 0; i < priceInputValue.length; i++) {
        priceInputValue[i].addEventListener("input", e => {
            let minp = minAutoNumeric.getNumber();
            let maxp = maxAutoNumeric.getNumber();
            let diff = maxp - minp;

            if (minp < 0) {
                alert("Minimum price cannot be less than 0");
                minAutoNumeric.set(0);
                minp = 0;
            }

            if (maxp > 100000000) {
                alert("Maximum price cannot be greater than 100000000");
                maxAutoNumeric.set(100000000);
                maxp = 100000000;
            }

            if (minp > maxp - priceGap) {
                minAutoNumeric.set(maxp - priceGap);
                minp = maxp - priceGap;

                if (minp < 0) {
                    minAutoNumeric.set(0);
                    minp = 0;
                }
            }

            if (diff >= priceGap && maxp <= rangeInputValue[1].max) {
                if (e.target.classList.contains("min-input")) {
                    rangeInputValue[0].value = minp;
                    let value1 = rangeInputValue[0].max;
                    rangeValue.style.left = `${(minp / value1) * 100}%`;
                } else {
                    rangeInputValue[1].value = maxp;
                    let value2 = rangeInputValue[1].max;
                    rangeValue.style.right = `${100 - (maxp / value2) * 100}%`;
                }
            }
        });
    }

    // Add event listeners to range input elements
    for (let i = 0; i < rangeInputValue.length; i++) {
        rangeInputValue[i].addEventListener("input", e => {
            let minVal = parseInt(rangeInputValue[0].value);
            let maxVal = parseInt(rangeInputValue[1].value);
            let diff = maxVal - minVal;

            if (diff < priceGap) {
                if (e.target.classList.contains("min-range")) {
                    rangeInputValue[0].value = maxVal - priceGap;
                } else {
                    rangeInputValue[1].value = minVal + priceGap;
                }
            } else {
                syncInputWithSlider(minAutoNumeric, rangeInputValue[0], rangeInputValue[0]);
                syncInputWithSlider(maxAutoNumeric, rangeInputValue[1], rangeInputValue[1]);
                rangeValue.style.left = `${(minVal / rangeInputValue[0].max) * 100}%`;
                rangeValue.style.right = `${100 - (maxVal / rangeInputValue[1].max) * 100}%`;
            }
        });
    }
});
