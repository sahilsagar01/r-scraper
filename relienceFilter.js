const insuranceCompanies = require('./api');
const fs = require("fs");









function main(companies) {
    return Array.from(companies, company => {
        
      return {
        name: company?.['Hospital_Name'],
        address: company?.['Address'],
        pincode: company?.['Pin_Code'],
        phone: company?.['ContactNumber'],
        email: company?.['MailId'],
        city: company?.['City'],
        state: company?.['State'],
        latitude: company?.['lat'],
        longitude: company?.['lng'],
      };
    });
  }
  fs.writeFileSync("./filltered/api.json", JSON.stringify(main(insuranceCompanies)));
  console.log(main(insuranceCompanies));
//   filltered