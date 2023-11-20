import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import  Container  from "@mui/material/Container";
import { useState } from "react";
import { propagateFirestore } from "../helpers/firestore";
const InputFileUpload = function() {

  const [addressArray, setAddressArray] = useState([]);
  const [displayLoading,setDisplayLoading] = useState(false);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = () => {
      setAddressArray( reader.result.split(','));
    };

  };

  return (
    <div>
      <div className ="flex flex-row">
        <Stack direction="row" alignItems="center" spacing={2}>
          <label htmlFor="upload-file">
            <Button variant="contained" component="span">
              Upload
            </Button>
            <input
              id="upload-file"
              hidden
              accept=".csv,.txt"
              type="file"
              onChange={handleFileUpload}
            />
          </label>
        {(addressArray.length >0) && <div>Upload Complete</div>}    
        </Stack>
        <Button
          variant= "outlined"
          
          onClick={()=>{
  
            if(window.confirm(`Are you sure you want to create a dataset of the portfolios of ${addressArray.length} addresses?`) == true){
              setDisplayLoading(true);
              propagateFirestore(addressArray).then(() => {
                setAddressArray([]);
                setDisplayLoading(false)
              });
            }
              
          }}>
          Create Dataset 
        </Button>
        {displayLoading && <div> 
          <div
            class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status">
            <span
              class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
              >Loading...</span
            >
          </div>
                Loading... Please do not close this page until the dataset is created
          </div>}
      </div>
    </div>

    );
}

export {InputFileUpload}