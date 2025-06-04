import { db } from './firebase'
import { collection, doc, setDoc, updateDoc, deleteDoc, serverTimestamp, getDocs } from 'firebase/firestore'

// 🔐 Save new custom playbook
export async function saveCustomPlaybookToFirestore(playbook: any, userId: string) {
  const playbookRef = doc(collection(db, 'users', userId, 'customPlaybooks'), playbook.id)
  await setDoc(playbookRef, {
    ...playbook,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

// ✏️ Rename or update existing custom playbook
export async function updateCustomPlaybookInFirestore(playbook: any, userId: string = 'demoUser') {
  const ref = doc(collection(db, 'users', userId, 'customPlaybooks'), String(playbook.id))
  await updateDoc(ref, {
    name: playbook.name,
    description: playbook.description,
    updatedAt: serverTimestamp(),
  })
}

// 🗑 Delete custom playbook
export async function deleteCustomPlaybookFromFirestore(playbookId: string, userId: string = 'demoUser') {
  const ref = doc(collection(db, 'users', userId, 'customPlaybooks'), String(playbookId))
  await deleteDoc(ref)
}
// 📂 Fetch all custom playbooks for a user
export async function fetchCustomPlaybooksForUser(userId: string = 'demoUser') {
  const querySnapshot = await getDocs(collection(db, 'users', userId, 'customPlaybooks'))
  return querySnapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data()
  }))
}