import { ItemList } from '../orm'
import { get, size } from 'lodash'

class ProvinceList extends ItemList {
    getEntityKey() {
        return "province"
    }

    filterOnCountry(country_id) {
        return this.updateListFilter({country:country_id})
    }
    
}

export const provinceList = new ProvinceList("province__default")
