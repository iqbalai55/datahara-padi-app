import { db } from './firebase';

import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    query,
    where,
    getDocFromServer,
    updateDoc,
    deleteField,
    deleteDoc
  } from "firebase/firestore";

export async function getDocument(
    collectionName,
    documentId
  ){
    let result = null;
    let error= null;
  
    try {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        result = {
          id: docSnap.id,
          ...docSnap.data(),
        }
      } else {
        error = "No such document!";
      }
    } catch (e) {
      error = (e).message;
    }
  
    return { result, error };
  }

  export async function getFieldFromDocument(collectionName, documentId, fieldName) {
    let field = null;
    let error = null;
  
    try {
      // Create a reference to the document in the specified collection
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
  
      // Check if document exists and extract the specific field
      if (docSnap.exists()) {
        field = docSnap.get(fieldName);
        if (field === undefined) {
          error = `Field "${fieldName}" does not exist in the document!`;
        }
      } else {
        error = "No such document!";
      }
    } catch (e) {
      error = e.message;
    }
  
    return { field, error };
  }