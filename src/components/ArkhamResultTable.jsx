import * as React from 'react';
import { DataGrid, gridNumberComparator, GridToolbar } from '@mui/x-data-grid';
import { formatter } from '../helpers/formatter';







const ArkhamResultTable = function({arkhamData}){

    const columns = [
      { field: 'address', headerName: 'Address', width: 380,filterable: false,sortable: false },
      { field: 'transactionValue', headerName: 'Transaction Values', width: 200, sortComparator: gridNumberComparator },
      { field: 'tokens', headerName: 'Tokens', width: 750, sortable:false },
      {field: 'protocols', headerName: 'Protocols',width: 250, sortable:false}
    ];

    let rows = [];
    for(const key of Object.keys(arkhamData)){
      rows.push({
        id:key,
        address: arkhamData[key].address,
        transactionValue: arkhamData[key].txValue.toFixed(2),
        tokens:arkhamData[key].transactedTokens.toString(),
        protocols:arkhamData[key].protocolsUsed.toString()
      })
    }


    
    return (
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          onRowDoubleClick={(params) =>{window.open(`https://debank.com/profile/${params.row.address}`)}}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 100 },
            },
          }}
          pageSizeOptions={[5, 10,50,100]}
          //checkboxSelection 
          slots={{ toolbar: GridToolbar }}

        />
      </div>
    )
}

export {ArkhamResultTable};