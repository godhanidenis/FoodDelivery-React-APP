import { ItemList } from 'orm'

class AdminReleaseNoteList extends ItemList {
    getEntityKey() {
        return "admin/release_note"
    }
}

export const adminReleaseNoteList = new AdminReleaseNoteList("admin_release_note__default")
