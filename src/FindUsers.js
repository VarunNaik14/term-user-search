'use client'
import { useState,useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { queryArkham } from './helpers/apiCaller';
import { Coin_Gecko_Token_List } from './helpers/coin_gecko_token_list';
import { ArkhamResultTable } from './components/ArkhamResultTable';
import './index.css';


export default function FindUsers(){

    const protocolSelect = ['aave','compound','notional-finance','morpho','venus','uniswap','curve-fi','makerdao','1inch','convex-finance','frax-finance'];
    const flowSelect = ['in','out'];
    const [tokenSelect,setTokenSelect] = useState(Coin_Gecko_Token_List);

    const [protocols,setProtocols] = useState(['aave','compound','notional-finance','morpho','venus']);
    const [flow,setFlow] = useState('in');
    const [transactionvalue,setTransactionValue] = useState(500000);
    const [recency,setRecency] = useState(90);
    const [tokens,setTokens] = useState([]);

    const [arkhamData,setArkhamData] = useState({});
    
    return(
        <div> 
            <div>
                <Autocomplete
                    value = {protocols}
                    onChange = {(event,newValue) => {
                        setProtocols(newValue);
                    }}
                    multiple
                    id="select-protocol"
                    options={protocolSelect}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Protocols"
                        placeholder="Protocols"
                    />
                    )}
                />

                <Autocomplete
                    value = {tokens}
                    onChange = {(event,newValue) => {
                        setTokens(newValue);
                    }}
                    multiple
                    id="select-tokens"
                    options={tokenSelect}
                    getOptionLabel = {option => `${option.name} (${option.symbol})`}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Tokens (optional)"
                        placeholder="Tokens"
                    />
                    )}
                />    

                <div className ="flex flex-row">
                    <div className = "">
                        <Autocomplete
                            value = {flow}
                            onChange = {(event,newValue) => {
                                setFlow(newValue);
                            }}
                            id="select-flow"
                            options={flowSelect}
                            renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="filled"
                                label="Flow"
                                placeholder="Flow"
                            />
                            )}
                        />
                    </div>
                    <div className ="">
                        <TextField
                            id="set-transaction-value"
                            label="Transaction Value (in USD)"
                            type="number"
                            value = {transactionvalue}
                            onChange = {(event)=>{
                                setTransactionValue(event.target.value/1);
                                
                                
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                        />
                    </div>
                    <div>
                        <TextField
                            id="set-recency"
                            label="Recency (in days)"
                            type="number"
                            value = {recency}
                            onChange = {(event)=> {
                                setRecency(event.target.value);
                                
                                
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                        />  
                    </div>
                </div>

                <Button 
                variant="outlined" 
                clasName="disabled:pointer-events-none bg-green-600"
                onClick={() => {
                    //converts inputed user filters to arkham api format
                    const protocolsToFilter = protocols.toString();
                    const tokensToFilter = tokens.length == 0 ? undefined: tokens.map(token => token.id).toString();
                    const convertedRecencyToString = recency + "d";

                    //filteredArkhamData is a mapping of address to tokens, protocols, and tx value
                    let filteredArkhamData = {};
                    queryArkham(protocolsToFilter,flow,transactionvalue,convertedRecencyToString,tokensToFilter).then(
                        (transactionData) => {
                            for(const transaction of transactionData){

                                if(!(transaction.fromIsContract && transaction.toIsContract)){
                                    let address, protocolName;
                                    if(transaction.fromIsContract){
                                        address = transaction.toAddress.address;
                                        protocolName = transaction.fromAddress.arkhamEntity.name;
                                    }

                                    else{
                                        
                                        address = transaction.fromAddress.address;
                                        protocolName = transaction.toAddress.arkhamEntity.name;

                                    }

                                    //check if the address already exists in mapping, if it does then it appends the new data
                                    filteredArkhamData.hasOwnProperty(address)?
                                        filteredArkhamData[address] = {...filteredArkhamData[address],
                                            txValue:filteredArkhamData[address].txValue + transaction.historicalUSD,
                                            transactedTokens : filteredArkhamData[address].transactedTokens.includes(transaction.tokenName)?
                                            filteredArkhamData[address].transactedTokens : [...filteredArkhamData[address].transactedTokens,transaction.tokenName],
                                            protocolsUsed : filteredArkhamData[address].protocolsUsed.includes(protocolName)?
                                            filteredArkhamData[address].protocolsUsed : [...filteredArkhamData[address].protocolsUsed,protocolName] }:

                                        filteredArkhamData[address] = { address: address,
                                            txValue:transaction.historicalUSD,
                                            transactedTokens: [transaction.tokenName],
                                            protocolsUsed: [protocolName] };
                                    
                                }
                            }
                            setArkhamData(filteredArkhamData);
                        }
                    )

 
                }}>
                Submit
                </Button>      
            </div>  

            {Object.keys(arkhamData).length > 0 && <ArkhamResultTable {...{arkhamData}} />}                
        </div>

        
    )
};
