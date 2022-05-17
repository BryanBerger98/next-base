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
        }
    },
    users: {
        'invalid-input': {
            fr: 'Saisie invalide',
            en: 'Invalid input'
        },
        'users/missing-id': {
            fr: 'Un id utilisateur doit être fourni',
            en: 'A user id must be provided'
        }
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
        if (!errors[module] || !errors[module][code] || !errors[module][code][locale]) {
            return ''
        }
        return errors[module][code][locale]
    }

    return {
        getTranslatedError
    }

}