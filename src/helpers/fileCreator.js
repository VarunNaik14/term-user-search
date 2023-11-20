import * as fs from 'fs';

const getAddressesFromFile = function(filename,splitString){
    const data = fs.readFileSync(filename,'utf8').split(splitString);
    return data;

}

const addDataToFile = function(fileNameToAdd,dataToAdd){

    fs.appendFileSync(fileNameToAdd, dataToAdd, function (err) {
        if (err) console.log(err);
    });

}

export {getAddressesFromFile,addDataToFile}