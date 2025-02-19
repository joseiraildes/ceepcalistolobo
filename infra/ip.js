// https://api64.ipify.org/?format=json

async function Ip(){
  try {
    const response = await fetch('https://api.ipify.org/');
    const data = await response.text();
    return data
  } catch (error) {
    console.error('Error fetching IP:', error);
  }
}

module.exports = Ip