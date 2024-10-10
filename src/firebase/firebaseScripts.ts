import { v4 as uuidv4 } from 'uuid';
import { storage } from './firebase';
import {ref,uploadBytes,getDownloadURL, deleteObject, getMetadata} from 'firebase/storage'

// Скрипты для работы с облачным хранилищем, думаю само их название понятно, что они делают

export async function downloadFileTo(file, folderName) {
    const fileRef = ref(storage, folderName + file['name'] + uuidv4());
    await uploadBytes(fileRef, file);
    const fileURL = await getDownloadURL(fileRef);
    console.log('here')
    return fileURL
}

export async function deleteFile(file) {
   await getMetadata(ref(storage,file)).then(async (metadata) => {
    const filePath = metadata.fullPath
    const fileRef = ref(storage,filePath)
    await deleteObject(fileRef)
   })
}

export async function updateFile(oldFile, newFile, folderName, setDownload){
    setDownload(false)
    if(oldFile === newFile){
        return oldFile;
    }
    else {
        await deleteFile(oldFile);
        const fileUrl = await downloadFileTo(newFile, folderName);
        setDownload(true)
        return fileUrl;
    }
}