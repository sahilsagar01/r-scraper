const puppeteer = require("puppeteer");
const fs = require("fs");
const searchOption = require("./searchOption");

async function selectStateAndGetCityOptions(state) {
  console.log(state.state);

  return state.cities;
}

async function selectCityAndGetHospitalDetails(page, city) {

  for (let i = 0; i < 50; i++) {
    // Simulate pressing the "Backspace" key
    await page.keyboard.press('Backspace');
    
    // You can add a delay between clicks if needed
    await page.waitForTimeout(10); // 1000 milliseconds = 1 second
  }

  // Click on the city option
  await page.waitForTimeout(500)
  await page.type('[id="selectedBankLocationId"]', city);
  await page.waitForTimeout(1000);
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(1000)
  await page.keyboard.press("Enter");

  // Add a delay
  await page.waitForTimeout(1000); // Adjust the delay as needed
  
  for (let i = 0; i < 50; i++) {
    // Simulate pressing the "Backspace" key
    await page.keyboard.press('Backspace');
    
    // You can add a delay between clicks if needed
    await page.waitForTimeout(10); // 1000 milliseconds = 1 second
  }
  // Wait for the table to be updated
  const element = await page.$('.col-lg-10.col-md-10.col-sm-10.no-padding .row');

  if(element){
    await page.waitForSelector(`.col-lg-10.col-md-10.col-sm-10.no-padding .row`);
    
    const hospitalDetails = await page.evaluate((externalCity) => {
      const rows = document.querySelectorAll(
        `.col-lg-10.col-md-10.col-sm-10.no-padding .row`
      );
      return Array.from(rows, (row) => {
        const hospitalName = row.querySelector('.col-lg-12.col-md-12.col-sm-12 h4');
        const HospitalAddress = row.querySelector('.col-lg-9.col-md-9.col-sm-9 h6');
        const HospitalCity = externalCity.split(",")
        return {
          HospitalName: hospitalName.textContent.trim(),
          HospitalAddress: HospitalAddress.textContent.trim(),
          City: HospitalCity[0],
          State: HospitalCity[1],
          Pincode: HospitalAddress.textContent.trim().split(",").pop()
        };
      });
    },city);
    return hospitalDetails;
  }else{
    return null
  }
  


  // Extract the hospital details from the table


}

(async (searchOption) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const result = [];
  try {
    // Navigate to the page
    await page.goto(
      "https://rgi-locator.appspot.com/?Search_by=hospital&sourcesystem=website&phonenumber=&emailid=#/"
    );

    // Wait for the first select element to be present on the page

    for (let i = 1; i < searchOption.length; i++) {
      const cityOptions = await selectStateAndGetCityOptions(searchOption[i]);
      console.log(
        `City Options for State ${searchOption[i].state}:`,
        cityOptions
      );

      for (let j = 1; j < cityOptions.length; j++) {
        const hospitalDetails = await selectCityAndGetHospitalDetails(
          page,
          cityOptions[j]
        );
        console.log(
          `Hospital Details for City ${cityOptions[j]}:`,
          hospitalDetails
        );
        result.push(hospitalDetails);
        fs.writeFileSync("result.json", JSON.stringify(result));
      }
    }
  } catch (error) {
    console.error("Error navigating to the page:", error);
  } finally {
    await browser.close();
    console.log(result);
  }
})(searchOption);


