import {getPortfolioFromAddress} from './apiCaller.js';
import {db} from './firebase.js';
import {arrayUnion, doc,setDoc,updateDoc} from "firebase/firestore"; 

const propagateFirestore = async function(addressArray){
    const unix = Date.now().toString()
    const usersArray = addressArray;

    const addTokenToList = function(listToAdd,tokenObj,protocolName){

        if(listToAdd.hasOwnProperty(tokenObj.symbol)){

            listToAdd[tokenObj.symbol].amount += tokenObj.amount;
            listToAdd[tokenObj.symbol].value += tokenObj.value

        }

        else{
            listToAdd[tokenObj.symbol] = tokenObj;
        }

        listToAdd[tokenObj.symbol][protocolName] = true;
    }

    const addItemIfNotIncluded = function(array, item){
        if (!array.includes(item)) {
          array.push(item);
        }
      }

    let allSuppliedTokens = [], allBorrowedTokens = [], allProtocolsUsed = [], allRewardTokens = [];

    const positionsToSearch = ['Lending','Yield','Staked','Deposit','Farming','Leveraged Farming','Rewards','Liquidity Pool'];

    /*
    Loops through addresses
    */

    for(const userAddress of usersArray){
        
        /*
        Cummilative values of positions to be added to top level of user profile
        */

        let totalNetAssetValue = 0, totalNetDebtValue = 0, totalNetValue = 0;
        let totalSuppliedTokens = {}, totalBorrowedTokens = {},totalCollateralTokens ={},totalRewardTokens = {};
        let totalSuppliedValue = 0, totalBorrowedValue = 0,totalCollateralValue = 0, totalRewardValue = 0;
        let protocolsUsedByUser = [];

        const userDocRef = doc(db,'runs',...[unix,'users',userAddress]);
        
        let userPortfolio = await getPortfolioFromAddress(userAddress);
        
        /*
        Loops through protocols used by user
        */
        
        for(const protocolObject of userPortfolio){

            const protocolName = protocolObject.name
            const protocolPic = protocolObject.logo_url
            const list = protocolObject.portfolio_item_list;

            protocolsUsedByUser.push(protocolName);
            addItemIfNotIncluded(allProtocolsUsed,protocolName);
            
            let protocolSupplyTokens = {}, protocolBorrowTokens = {}, protocolCollateralTokens = {}, protocolRewardTokens = {};
            let protocolAssetValue = 0 ,protocolDebtValue = 0;

            /*
            Loops through positions in each protocol, filters for certain positions
            */
            
            for(const positionObj of list){

                if(positionsToSearch.includes(positionObj.name)){

                    const posName = positionObj.name;

                    const assetUSDValue = positionObj.stats.asset_usd_value
                    const debtUSDValue = positionObj.stats.debt_usd_value;
                    const netUSDValue = assetUSDValue - debtUSDValue;

                    totalNetAssetValue += assetUSDValue;
                    totalNetDebtValue += debtUSDValue;
                    totalNetValue += netUSDValue;

                    protocolAssetValue += assetUSDValue;
                    protocolDebtValue += debtUSDValue; 
    
                    if(posName == 'Rewards' && positionObj.detail.hasOwnProperty('token_list')){


                        
                        for(const token of positionObj.detail.token_list){

                            let tokenObj =  {
    
                                symbol: token.symbol,
                                price: token.price,
                                amount: token.amount,
                                value: token.price * token.amount,
                                logo_url: token.logo_url,

                            }  
    
                            addTokenToList(protocolRewardTokens,tokenObj,protocolName);
                            addTokenToList(totalRewardTokens,tokenObj,protocolName);
                            addItemIfNotIncluded(allRewardTokens,tokenObj.symbol);
    
     
                            totalRewardValue += tokenObj.value;

                        }
    
                    }
    
    
                    if(positionObj.detail.hasOwnProperty("supply_token_list")){
                        
                        for(const token of positionObj.detail.supply_token_list){

                            let tokenObj =  {
    
                                symbol: token.symbol,
                                price: token.price,
                                amount: token.amount,
                                value: token.price * token.amount,
                                logo_url: token.logo_url


                            }
                            
                            addTokenToList(totalSuppliedTokens,tokenObj,protocolName)
                            addTokenToList(protocolSupplyTokens,tokenObj,protocolName);
                            addItemIfNotIncluded(allSuppliedTokens,tokenObj.symbol);
        
                            if(token.hasOwnProperty('is_collateral') && token.is_collateral === true){
                                
                                addTokenToList(totalCollateralTokens,tokenObj,protocolName);
                                addTokenToList(protocolCollateralTokens,tokenObj,protocolName);
                                
                                totalCollateralValue += tokenObj.value;
                            }
        
                            totalSuppliedValue += tokenObj.value;

                        }

                    }
    
                    if(positionObj.detail.hasOwnProperty("borrow_token_list")){

                        for(const token of positionObj.detail.borrow_token_list){
                            let tokenObj =  {
    
                                symbol: token.symbol,
                                price: token.price,
                                amount: token.amount,
                                value: token.price * token.amount,
                                logo_url: token.logo_url
        
                            }
        
                            addTokenToList(totalBorrowedTokens,tokenObj,protocolName);
                            addTokenToList(protocolBorrowTokens,tokenObj,protocolName)
                            addItemIfNotIncluded(allBorrowedTokens,tokenObj.symbol);
        
                            totalBorrowedValue += tokenObj.value;                           
                        }
        
                    }
    
                }
            }
            
            setDoc(doc(db,'runs',...[unix,'users',userAddress,'protocols',protocolName]),{
                supply_token_list: protocolSupplyTokens, 
                borrow_token_list: protocolBorrowTokens,
                reward_token_list: protocolRewardTokens,
                collateral_token_list: protocolCollateralTokens,
                asset_value: protocolAssetValue,
                debt_value: protocolDebtValue,
                net_value: protocolAssetValue - protocolDebtValue,
                logo_url : protocolPic
            },{merge: true});
        }

        await setDoc(userDocRef,{
            address: userAddress,
            protocols_used: protocolsUsedByUser,
            total_supplied_tokens: totalSuppliedTokens,
            total_borrowed_tokens: totalBorrowedTokens,
            total_collateral_tokens: totalCollateralTokens,
            total_reward_tokens: totalRewardTokens,
            total_supplied_value: totalSuppliedValue,
            total_borrowed_value: totalBorrowedValue,
            total_collateral_value: totalCollateralValue,
            total_reward_value: totalRewardValue,
            net_asset_value: totalNetAssetValue,
            net_debt_value: totalNetDebtValue,
            net_value: totalNetValue 
        },{merge:true}
        );
    } 
      
    await setDoc(doc(db,'runs',...[unix,'search','search_values']),
    {
        filled: true,
        all_supplied_tokens: allSuppliedTokens,
        all_borrowed_tokens: allBorrowedTokens,
        all_protocols_used: allProtocolsUsed,
        all_reward_tokens: allRewardTokens
    }) 

    updateDoc(doc(db,'dates',...['runDates']),{unixes: arrayUnion(unix)});
}



export {propagateFirestore};