const roles = {
    admin: {
        fr: 'Administrateur',
        en: 'Admin'
    },
    user: {
        fr: 'Utilisateur',
        en: 'User'
    }
}

export default function RolesTranslator(options) {

    function getTranslatedRole(role) {
        if (!role) {
            throw new Error('Please set a role')
        }
        const locale = options && options.locale && options.locale !== '' ? options.locale : 'en'
        if (!roles[role]) {
            return ''
        }
        return roles[role][locale]
    }

    return {
        getTranslatedRole
    }

}