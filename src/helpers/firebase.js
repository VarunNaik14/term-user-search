import { initializeApp } from "firebase/app";
import {getFirestore, collection,getDocs,query,where,limit,or} from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyB0_fZliqBGGx3tz6GldceqNG6eVndoIhA",
  authDomain: "debank-data-storage.firebaseapp.com",
  projectId: "debank-data-storage",
  storageBucket: "debank-data-storage.appspot.com",
  messagingSenderId: "905145888574",
  appId: "1:905145888574:web:53f7bc782655b78783c66f",
  measurementId: "G-4BGXGJYZG3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {app,db} 

export async function getUserWithAddress(address,unix){

  const userRef = collection(db,'runs',...[,unix,'users']);
  const q =  query(userRef, where('address','==',address),limit(1));
  const userDocs = await getDocs(q);

  return  userDocs.docs[0].data();
}

export async function getSearchParams(unix){

  const searchRef = collection(db,'runs',...[unix,'search']);
  const q = query(searchRef,where('filled','==',true),limit(1));

  const searchDocs = await getDocs(q);

  return searchDocs.docs[0].data();



}

export async function getUnixes(){
  const datesRef = collection(db,'dates');
  const q = query(datesRef,where('filled','==',true),limit(1));
  const dateDocs = await getDocs(q);

  return dateDocs.docs[0].data().unixes;
}

export async function filterUsersBySearchParams(searchParams,unix){

  const map = ['protocols_used','total_supplied_tokens','total_borrowed_tokens'];
  const userRef = collection(db,'runs',...[unix,'users']);
  let q = query(userRef);
  let filteredusers = [];

  let index = 0;
  for(var parameters of searchParams){

    if(index === 0 && parameters.length != 0){
      q = query(q,where(map[0],'array-contains-any', parameters));
    }

    else if(parameters.length != 0){
      if(searchParams[0].length != 0){

        for(var token of parameters){
          
          let orQueryContraints = [];

          for(var protocol of searchParams[0]){

            orQueryContraints.push(where(`${map[index]}.${token}.${protocol}`,'==',true))

          }

          q = query(q,or(...orQueryContraints));

        }
          
      }

      else{
        for(var token of parameters){

          q = query(q,where(`${map[index]}.${token}.symbol`,'in',[token]));

        }
      }
    }

    index++;
  }

  const userDocs = (await getDocs(q)).docs;
  for(var user of userDocs){
    filteredusers.push(user.data());
  }

  return filteredusers;

}