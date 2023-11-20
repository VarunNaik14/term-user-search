import axios from "axios";



const getPortfolioFromAddress =  async function(address) {
  let config = {
    method: 'get', 
    url: 'https://pro-openapi.debank.com/v1/user/all_complex_protocol_list',
    headers: {
      'accept': 'application/json',
      'AccessKey': '0ac87ffb582a30a47b4979d8ab704ae7c499929a', 
    },
    params: {
      id: '',
      chain_ids: 'bsc,eth,matic,op,arb,avax,evmos,tlos,nova,boba,celo',
    },
  };

config.params.id = address;
const returnData = (await axios(config)).data;

return returnData;

}

const queryArkham = async function(base_,flow_,usdGte_,timeLast_,tokens_){
  const config = {
    headers: {"API-key": "R2dr5jjQAxHwg4LMc5RSGgfNvpN0uXGE"},
    method: "get",
    url: "https://api.arkhamintelligence.com/transfers",
    params: {
      base: base_,
      flow: flow_,
      limit: "10000",
      usdGte: usdGte_,
      timeLast: timeLast_,
      tokens: tokens_
    },
  }
  const returnData = (await axios(config)).data.transfers;
  return returnData;

}

const getPortfolioFromArkham = async function(address){
  const config = {
    headers: {"API-key": "R2dr5jjQAxHwg4LMc5RSGgfNvpN0uXGE"},
    method: "get",
    url: `https://api.arkhamintelligence.com/portfolio/address/${address}`,
    params: {
      time: Date.now()
    },
  }
  const returnData = (await axios(config)).data;
  return returnData;
}

export {getPortfolioFromAddress,queryArkham,getPortfolioFromArkham};