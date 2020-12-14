import CountryService from "@/services/CountryService.js";

export const namespaced = true;

export const state = {
    countries: []
};

export const mutations = {
    SET_COUNTRIES (state, countries) {
        state.countries = countries;
    }
};

export const actions = {
    fetchCountries ({ commit, state }) {
        if (state.countries.length > 0) {
            return state.countries;
        } else {
            return CountryService.getCountries()
                .then(response => {
                    commit("SET_COUNTRIES", response.data);
                });
        }
    }
};

export const getters = {
    getCountryByCode: state => code => {
        let c = state.countries.find(country => country.code === code);
        return c.name + " - " + c.code;
    },
    getCountriesForSelect: state => () => {
        return state.countries.map(country => {
            return { label: country.name + " - " + country.code, code: country.code };
        });
    }
};
