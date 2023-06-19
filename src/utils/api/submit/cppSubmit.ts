import axios from 'axios';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeAPIRequests(code : string) {
  const firstAPIEndpoint = 'https://api.hackerearth.com/v4/partner/code-evaluation/submissions/';
  

  const firstAPIPayload = {
    lang: 'CPP17',
    memory_limit: 2463232,
    
    time_limit: 1,
    source: code,
    input: '',
    
  };

  try {
    // First API request
    const firstAPIResponse = await axios.post(firstAPIEndpoint, firstAPIPayload, {
      headers: {
        'cache-control': 'no-cache',
        'client-secret': '0e21fb8421c443061cbfac8fd4abb2727e0a5688',
        'content-type': 'application/json'
      }
    });

    console.log('First API response:', firstAPIResponse.data);

    // Delay for 10 seconds
    

    // Second API request
    let secondAPIResponse;
    do {
    secondAPIResponse = await axios.get(firstAPIResponse.data.status_update_url, {
      headers: {
        'client-secret': '0e21fb8421c443061cbfac8fd4abb2727e0a5688'
      }
    });
    console.log('Second API response:', secondAPIResponse.data);
    await delay(1000);
  } while(secondAPIResponse.data.result.run_status.output === null);
    const resultAPIResponse = await axios.get(secondAPIResponse.data.result.run_status.output);

    
    const res = (resultAPIResponse.data);
    
    if(res.substring(0,3) === "YES" ) {
      console.log("siuuuuu");
      return true;
    } else {
      return false;
    }
  }
  catch (error) {
    console.error('Error:', error);
    return false;
  }
}


export default makeAPIRequests;

