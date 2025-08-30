// utils/helpers.js
import { useSelector } from "react-redux";
import axios from 'axios';
  

export const numberToWords = (num) => {
    if (num === 0) return "zero";
  
    const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const teens = [
      "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
      "sixteen", "seventeen", "eighteen", "nineteen"
    ];
    const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    const thousands = ["", "thousand", "million", "billion"];
  
    // Function to convert hundreds
    const convertHundreds = (num) => {
      let result = "";
      if (num >= 100) {
        result += ones[Math.floor(num / 100)] + " hundred ";
        num %= 100;
      }
      if (num >= 10 && num < 20) {
        result += teens[num - 10] + " ";
        num = 0;
      } else if (num >= 20) {
        result += tens[Math.floor(num / 10)] + " ";
        num %= 10;
      }
      if (num > 0) {
        result += ones[num] + " ";
      }
      return result.trim();
    };
  
    let result = "";
    let i = 0;
    let integerPart = Math.floor(num); // Get integer part of number
    let decimalPart = num % 1; // Get decimal part of number
  
    // Handle integer part
    while (integerPart > 0) {
      if (integerPart % 1000 !== 0) {
        result = convertHundreds(integerPart % 1000) + " " + thousands[i] + " " + result;
      }
      integerPart = Math.floor(integerPart / 1000);
      i++;
    }
  
    result = result.trim();
  
    // Handle decimal part
    if (decimalPart > 0) {
      const decimalString = decimalPart.toFixed(2).split(".")[1]; // Get decimal part as string
      result += " point ";
      for (let i = 0; i < decimalString.length; i++) {
        result += ones[parseInt(decimalString.charAt(i))] + " ";
      }
    }
  
    return result.trim();
  };
  

  export const defaultCurrency = () => { 

        return 'Tk. ';
  };
  
  export const ucfirst = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };


 
  export const useUser = () => {
    return useSelector((state) => state.auth.user);
  }

  export const fetchPermissionSingleData = async (userId) => {
    if (!userId) return null; // Ensure userId is provided

    try {
        const response = await axios.get(`http://localhost:5000/api/permission/single/${userId}`);
        console.log("SINGLE API DATA", response);
        
        return response.data; // Return fetched data
    } catch (error) {
        console.error("Error fetching permissions:", error);
        return null; // Return null on error
    }
};
