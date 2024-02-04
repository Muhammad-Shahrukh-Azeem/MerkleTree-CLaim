const axios = require('axios');
const etherscanApiKey = 'WGEQEJXBFF322ZJVZ5TFJ3TJHBKX9DPQN5'; // Replace with your API key
const tokenContractAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // Replace with the contract address

async function fetchTokenHolders() {
  try {
    const response = await axios.get(`https://api.etherscan.io/api`, {
      params: {
        module: 'token',
        action: 'tokenholderlist',
        contractaddress: tokenContractAddress,
        page: 1,
        offset: 10, // Adjust based on how many addresses you want to fetch
        apikey: etherscanApiKey
      }
    });
console.log(response);
    if (response.data.status !== '1') {
      throw new Error('API response error');
    }

    const holders = response.data.result;
    return holders.map(h => h.TokenHolderAddress);
  } catch (error) {
    console.error('Error fetching token holders:', error.message);
    if (error.response) {
      // Log the response data from Etherscan
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('Request made but no response:', error.request);
    }
  }
  
  
}

// Example usage
fetchTokenHolders().then(holders => {
  console.log('Token Holders:', holders);
});
