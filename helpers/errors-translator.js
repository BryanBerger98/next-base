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

export default function ErrorsTranslator(options) {

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
        getTranslatedError
    }

}