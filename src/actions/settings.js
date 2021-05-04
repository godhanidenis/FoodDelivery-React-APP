import { get } from 'lodash'
import { ItemList } from '../orm'

export const UPDATE_SETTINGS = 'UPDATE_SETTINGS'

const GLOBAL_SETTINGS_ID = "global"

class SettingsList extends ItemList {
    getEntityKey() {
        return "settings"
    }

    ensureGlobalSettingsLoaded() {
        return this.fetchListIfNeeded()
    }

    getGlobalSettings() {
        return this.getObject(GLOBAL_SETTINGS_ID)
    }

    getSetting(name) {
        return get(this.getGlobalSettings(), name)
    }
    
}

export const globalSettingsList = new SettingsList("settings__default")


export function updateSettings(new_settings) {
    return {
        type: UPDATE_SETTINGS,
        new_settings: new_settings
    }
}

export function isConfigured(state) {
    return get(state, ["settings", "configured"], false)
}
