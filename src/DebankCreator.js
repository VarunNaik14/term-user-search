import {default as Button} from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {default as Autocomplete} from '@mui/material/Autocomplete';
import { PortfolioResultTable } from './components/PortfolioResultTable';
import { InputFileUpload } from './components/InputFileUpload';
import { filterUsersBySearchParams, getSearchParams, getUnixes } from "./helpers/firebase";
import {useState,useEffect} from 'react';

export default function DebankCreator() {
    const MuiButton = Button;
    //protocol,supply,borrow values respectivley
    const [autoFillValues,setAutoFillValues] = useState([['loading...'],['loading...'],['loading...']]);
    const[searchValues,setSearchValues] = useState([[],[],[]]);
    const [runDate,setRunDate] = useState(null);
    const[dateValues,setDateValues] = useState(['loading...']);
    const [dateToUnix,setDateToUnix] = useState({});
    
    const [tableData,setTableData] = useState([null,null]);

    useEffect(() => {
        getUnixes().then((result) =>{
          const unixToDate = result.map(unixTime =>{
            const date = new Date(parseInt(unixTime));
            const dateToDisplay = `${date.toLocaleDateString("en-US")} @ ${date.toLocaleTimeString("en-US")}`;
            setDateToUnix(prevState => ({...prevState, [dateToDisplay]: unixTime}));
            return dateToDisplay;
          })
          setDateValues(unixToDate);
        })
      }, []);


    return(
        <div>
            Select a dataset
          <div className ="flex flex-row pt-0.25">
  
            <div className ="basis-1/2">
              <Autocomplete 
                value = {runDate}
                onChange={(event, newValue) =>{
                  setRunDate(newValue);
                }}
                id = "unix-value"
                options = {dateValues}
                renderInput={(params) => <TextField {...params} label="Select Dataset" />}
              />
            </div>
            <MuiButton 
              variant='outlined'
              onClick={() =>{
                if(runDate){
                  const unix = dateToUnix[runDate];
                  getSearchParams(unix).then((result) => {
                    setAutoFillValues([result['all_protocols_used'],result['all_supplied_tokens'],result['all_borrowed_tokens']]);
                  });
                }
              }}
              >
                Submit
            </MuiButton>
          </div>
  
          <div>
            Or Upload a .csv file of addresses to create a new dataset
            <InputFileUpload />
          </div>
  
          {(autoFillValues[0][0] != "loading...")&& <div className = "flex flex-row pt-10">
            <div className = "mx-0.5">
              
              <Autocomplete
                multiple
                value={searchValues[0]}
                onChange={(event, newValue) => {
                  const newSearchValues = searchValues.map((value,index) => {
                    if(index == 0){
                      return newValue;
                    }
  
                    else{
                      return value
                    }
                  })
                  setSearchValues(newSearchValues);
                }}
  
                id="protocol-value"
                options={autoFillValues[0]}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Protocol" />}
            />
            </div>
  
            <div className ="mx-0.5">
              <Autocomplete
                multiple
                value={searchValues[1]}
                onChange={(event, newValue) => {
                  const newSearchValues = searchValues.map((value,index) => {
                    if(index == 1){
                      return newValue;
                    }
  
                    else{
                      return value
                    }
                  })
                  setSearchValues(newSearchValues);
                }}
  
                id="supply-token-value"
                options={autoFillValues[1]}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Supply Token" />}
              />
            </div>
            
            <div className ="mx-0.5">
              <Autocomplete
                multiple
                value={searchValues[2]}
                onChange={(event, newValue) => {
                  const newSearchValues = searchValues.map((value,index) => {
                    if(index == 2){
                      return newValue;
                    }
  
                    else{
                      return value
                    }
                  })
                  setSearchValues(newSearchValues);
                }}
  
                id="borrow-token-value"
                options={autoFillValues[2]}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Borrow Token" />}
              />
            </div>
            <div className = "ml-0.5 pt-0.5">
              <MuiButton 
                variant="outlined" 
                onClick={() => {
                  const unix = dateToUnix[runDate];
                  filterUsersBySearchParams(searchValues,unix).then((filteredusers) =>{
                    setTableData([filteredusers,searchValues]);
                  })
                  
                }}>
                Submit
              </MuiButton>
            </div>
          </div>}
          <PortfolioResultTable {...{tableData}}/>
        </div>
    )
  }