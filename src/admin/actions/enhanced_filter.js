import moment from 'moment'
import { size, compact, join, filter, keys, get, forEach, map, split, remove } from 'lodash'
import { adminCityList } from 'admin/components/cities/actions/admin_city'

const DATE_RANGE_FILTER_ALL_TIME = "all_time"

export class EnhancedFilter {
    // Get an instance by calling getEnhancedFilter on the ItemList object, don't construct directly

    constructor(item_list) {
        this.item_list = item_list
        this._resetLocalCache()
    }

    getInitialValues() {
        if ( ! this._cache.initial_values ) {
            const res = this.getFilterAsForm()

            const cities_for_form = {}
            const all_cities_by_id = adminCityList.getAllObjects()
            forEach(keys(all_cities_by_id), function(city_id) {
                cities_for_form[city_id] = false
            })
            if ( size(get(res, "cities")) > 0 ) {
                forEach(keys(res.cities), function(city_id) {
                    cities_for_form[city_id] = true
                })
            }
            res.cities = cities_for_form

            res.date_range_filter_type = res.date_range_filter_type || DATE_RANGE_FILTER_ALL_TIME
            
            this._cache.initial_values = res
        }
        return this._cache.initial_values
    }

    getNumFilters() {
        if ( ! this._cache.num_filters ) {
            const f = this.getFilterAsObjects()
            if ( ! f ) {
                this._cache.num_filters = 0
            } else {
                const is_date_range_filter_active = f.date_range_filter_type && f.date_range_filter_type != DATE_RANGE_FILTER_ALL_TIME
                
                this._cache.num_filters = size(f.cities) + (is_date_range_filter_active ? 1 : 0)
            }
        }
        return this._cache.num_filters
    }
    
    getFilterAsObjects() {
        if ( ! this._cache.filter_as_objects ) {
            this._cache.filter_as_objects = this._convertFilterToObjects(this.item_list.getFilter())
        }
        return this._cache.filter_as_objects
    }

    getFilterAsForm() {
        if ( ! this._cache.filter_as_form ) {
            this._cache.filter_as_form = this._convertFilterToFormValues(this.item_list.getFilter())
        }
        return this._cache.filter_as_form
    }

    getFilterAsPost() {
        if ( ! this._cache.filter_as_post ) {
            this._cache.filter_as_post = this.item_list.getFilter()
        }
        return this._cache.filter_as_post
    }

    updateFilter(values, is_in_post_data_format) {
        this._resetLocalCache()
        return (dispatch, getState) => {
            const post_values = (is_in_post_data_format === true) ? values : this._convertFormikDataToPostData(values)
            dispatch(this.item_list.updateListFilter(post_values))
            dispatch(this.item_list.fetchListIfNeeded())
        }
    }

    removeCityFilter(city_id_to_remove) {
        const f = this.item_list.getFilter()
        const city_ids = split(get(f, "cities", ""), ",")
        remove(city_ids, (city_id) => city_id === city_id_to_remove)
        f.cities = {}
        forEach(city_ids, function(city_id) {f.cities[city_id] = true})
        return this.updateFilter(f)
    }

    removeDateFilter() {
        const f = this.item_list.getFilter()
        f.date_range_filter_type = 'all_time'
        delete f.from_date
        delete f.to_date
        return this.updateFilter(f, true)
    }

    removeAnyFieldFilter() {
        const f = this.item_list.getFilter()
        delete f.any_field
        return this.updateFilter(f, true)
    }

    setAnyFieldFilter(any_field_value) {
        const f = this.item_list.getFilter()
        f.any_field = any_field_value
        return this.updateFilter(f, true)
    }

    _convertFormikDataToPostData(values) {
        const res = {}

        // cities
        const cities = get(values, "cities")
        const enabled_cities = compact(filter(keys(cities), (city_id) => cities[city_id] == true))
        const cities_as_comm_separated_string = join(enabled_cities)
        res.cities = cities_as_comm_separated_string

        // date range
        const date_range_filter_type = get(values, 'date_range_filter_type', 'all_time')
        if ( date_range_filter_type === 'single_date' ) {
            res.single_date = moment(get(values, 'single_date')).format()
            res.from_date = res.single_date
            res.to_date = res.single_date
        }
        if ( date_range_filter_type === 'date_range' ) {
            res.from_date = moment(get(values, 'from_date')).format()
            res.to_date = moment(get(values, 'to_date')).format()
        }
        res.date_range_filter_type = date_range_filter_type

        // any_field
        res.any_field = get(values, "any_field")

        return res
    }

    _convertFilterToObjects(filter_in_post_data_format) {
        const res = {}

        // cities
        const city_ids = compact(split(get(filter_in_post_data_format, "cities"), ","))
        const all_cities_by_id = adminCityList.getObjectsById()
        res.cities = map(city_ids, (city_id) => get(all_cities_by_id, city_id))

        // date range
        const date_range_filter_type = get(filter_in_post_data_format, 'date_range_filter_type', 'all_time')
        if ( date_range_filter_type === 'single_date' ) {
            res.single_date = moment(get(filter_in_post_data_format, 'single_date'))
            res.from_date = res.single_date
            res.to_date = res.single_date
        }
        if ( date_range_filter_type === 'date_range' ) {
            res.from_date = moment(get(filter_in_post_data_format, 'from_date'))
            res.to_date = moment(get(filter_in_post_data_format, 'to_date'))
        }
        res.date_range_filter_type = date_range_filter_type

        // any field
        res.any_field = filter_in_post_data_format.any_field

        return res
    }

    _convertFilterToFormValues(filter_in_post_data_format) {
        const res = this._convertFilterToObjects(filter_in_post_data_format)
        
        // cities
        const enabled_cities = get(res, "cities", [])
        res.cities = {}
        map(enabled_cities, (city) => res.cities[city.id] = true)
        
        return res
    }

    _resetLocalCache() {
        this._cache = {}
    }
    
}
