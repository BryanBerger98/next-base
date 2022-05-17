const titles = {
    dashboard: {
        fr: 'Tableau de bord',
        en: 'Dashboard'
    },
    users: {
        fr: 'Utilisateurs',
        en: 'Users'
    },
    account: {
        fr: 'Mon compte',
        en: 'Account'
    }
}

export default function PageTitleTranslator(options) {

    function getTranslatedTitle(title) {
        if (!title) {
            throw new Error('Please set a title')
        }
        const locale = options && options.locale && options.locale !== '' ? options.locale : 'en'
        if (!titles[title]) {
            return 'Next-Base'
        }
        return titles[title][locale]
    }

    return {
        getTranslatedTitle
    }

}