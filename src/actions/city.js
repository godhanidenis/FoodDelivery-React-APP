import { ItemList } from '../orm'
import { get, size } from 'lodash'

class CityList extends ItemList {
    getEntityKey() {
        return "city"
    }

    filterOnCountry(country_id) {
        return this.updateListFilter({country:country_id})
    }

    filterOnProvince(province_id){
        return this.updateListFilter({province:province_id})
    }
}

export const cityList = new CityList("city__default")
