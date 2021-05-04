import { ItemList } from '../orm'
import { get, size } from 'lodash'

class CountryList extends ItemList {
    getEntityKey() {
        return "country"
    }
}

export const countryList = new CountryList("country__default")
