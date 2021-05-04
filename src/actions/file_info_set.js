import { ItemList } from '../orm'

class FileInfoSetList extends ItemList {
    getEntityKey() {
        return "file_info_set"
    }
}

export const fileInfoSetList = new FileInfoSetList("file_info_set__default")
