import { ItemList } from '../orm'

class FileInfoList extends ItemList {
    getEntityKey() {
        return "file_info"
    }
}

export const fileInfoList = new FileInfoList("file_info__default")



class Base64FileInfoList extends ItemList {
    getEntityKey() {
        return "file_info/as_base64"
    }
}

export const base64FileInfoList = new Base64FileInfoList("base_64_file_info__default")

export function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new window.FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    })
}
