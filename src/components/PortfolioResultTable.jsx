import * as React from 'react';
import { DataGrid,GridToolbar } from '@mui/x-data-grid';
import { formatter } from '../helpers/formatter';

const PortfolioResultTable = function({tableData}){
    
    const userData = tableData[0];
    const additionalColumns= tableData[1];

    if(tableData[0] != null){

        //fixed columns
        let columns = [
            { field: 'address', headerName: 'Address', minWidth: 350 },
            {
              field: 'total_supplied_value',
              headerName: 'Size Lender (All Protocols)',
              minWidth: 220,
              format: (value) => formatter.format(value),
            },
            {
              field: 'total_borrowed_value',
              headerName: 'Size Borrower (All Protocols)',
              minWidth: 220,
              format: (value) => formatter.format(value),
            },
          ];

        //adds dynamic columns to column array
        let index = 0;
        for(var parameters of additionalColumns){
            if(index == 0 && parameters.length != 0){
                columns.push({field: parameters.toString(),headerName:'Protocol(s)',minWidth:170})
            }
            else if(index == 1 && parameters.length != 0){
                columns.push({field: parameters.toString(),headerName:'Supply Token',minWidth:350})
            }
            else if(index == 2 && parameters.length != 0){
                columns.push({field: parameters.toString(),headerName:'Borrow Token',minWidth:350})
            }
        index++;
        }

        //creates rows for the table
        let rows = [];
        for(const user of userData){

            let rowData = {id: user.address};
            for(const col of columns){
                switch(col.headerName) {
                    case 'Size Lender (All Protocols)':
                    case 'Size Borrower (All Protocols)':
                        rowData[col.field] = formatter.format(user[col.field]);
                        break;
                    case 'Address':
                        rowData[col.field] = user[col.field];
                        break;
                    
                    case 'Protocol(s)':
                        rowData[col.field] = col.field;
                        break;
                    case 'Supply Token':
                        rowData[col.field] = `${formatter.format(user.total_supplied_tokens[col.field].value)} of ${col.field}`
                        break;
                    case 'Borrow Token':
                        rowData[col.field] = `${formatter.format(user.total_borrowed_tokens[col.field].value)} of ${col.field}`
                        break;

                }
            }
            rows.push(rowData);
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

    
}



export {PortfolioResultTable} ;