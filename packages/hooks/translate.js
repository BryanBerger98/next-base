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

const errors = {
    auth: {
        'wrong-password': {
            fr: 'Mot de passe incorrect',
            en: 'Wrong password'
        },
        'invalid-token': {
            fr: 'Jeton invalide',
            en: 'Invalid token'
        },
        'wrong-token': {
            fr: 'Le jeton transmis ne correspond pas à l\'utilisateur connecté',
            en: 'Provided token does not match the user'
        },
        'user-not-found': {
            fr: 'Utilisateur inconnu',
            en: 'User not found'
        },
        'token-not-found': {
            fr: 'Jeton inconnu',
            en: 'Token not found'
        },
        'unauthorized': {
            fr: 'Non autorisé',
            en: 'Unauthorized'
        },
        'error': {
            fr: 'Une erreur est survenue',
            en: 'An error has occured'
        },
        'email-already-in-use': {
            fr: 'Adresse email déjà attribuée',
            en: 'Email already in use'
        },
        'user-already-verified': {
            fr: 'L\'email de cet utilisateur est déjà vérifié',
            en: 'User email already verified'
        }
    },
    users: {
        'invalid-input': {
            fr: 'Saisie invalide',
            en: 'Invalid input'
        },
        'missing-id': {
            fr: 'Un id utilisateur doit être fourni',
            en: 'A user id must be provided'
        },
        'user-not-found': {
            fr: 'Utilisateur inconnu',
            en: 'User not found'
        },
        'email-already-in-use': {
            fr: 'Adresse email déjà attribuée',
            en: 'Email already in use'
        }
    },
    default: {
        fr: 'Une erreur est survenue',
        en: 'An error has occured'
    }
}

/**
 * Translator Hook
 * @param {{locale: 'fr' | 'en'}} options 
 * @returns {{
 *  getTranslatedTitle: (title: string) => translatedTitle,
 *  getTranslatedRole: (role: string) => translatedRole,
 *  getTranslatedError: (errorCode: string) => translatedErrorMessage
 * }}
 */
export default function useTranslate(options) {

    /**
     * Returns translated title from english title
     * @param {String} title 
     * @returns {String} translatedTitle
     */
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

    /**
     * Returns translated role from english role
     * @param {String} role 
     * @returns {String} translatedRole
     */
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

     /**
     * Returns translated error message from error code
     * @param {String} errorCode 
     * @returns {String} errorMessage
     */
      function getTranslatedError(errorCode) {
        if (!errorCode) {
            throw new Error('Please set an error code')
        }
        const locale = options && options.locale && options.locale !== '' ? options.locale : 'en'
        const module = errorCode.split('/')[0]
        const code = errorCode.split('/')[1]
        if (!errors[module] || !errors[module][code]) {
            return !errors[module][code][locale] ? errors.default.en : errors.default[locale]
        }
        return errors[module][code][locale]
    }

    return {
        getTranslatedTitle,
        getTranslatedRole,
        getTranslatedError
    }

}