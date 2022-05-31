import { Injectable } from '@angular/core';
import { collectionData, docSnapshots, Firestore } from '@angular/fire/firestore';
import { collection, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private fisestore: Firestore) { }

  //agregar un contacto a la coleccion
  createContact(contact: any){
    const document = doc(collection(this.fisestore, 'contacts'));
    return setDoc(document, contact);
  }

  //traer todos los contactos almacenados en la coleccion
  getContacts(): Observable<any[]> {
    const contactsCollection = collection(this.fisestore, 'contacts');
    return collectionData(contactsCollection, {idField: 'id'})
    .pipe(map(contacts => contacts as any[]));
  }

  //tare un contacto especifico
  getContactById(id: string): Observable<any[]>{
    const document = doc(this.fisestore, `contacts/${id}`);
    return docSnapshots(document)
    .pipe(map(doc => {
      const id = doc.id;
      const data = doc.data();
      return { id, ...data } as any;
    }));
  }

  //edita un contacto especifico
  editContact(contact: any){
    const document = doc(this.fisestore, 'contacts', contact?.id);
    const { id, ...data } = contact;
    return setDoc(document, data);
  }

  //Elimiar un contacto especifico
  removeContact(id: string){
    const document = doc(this.fisestore, 'contacts', id);
    return deleteDoc(document);
  }
}
