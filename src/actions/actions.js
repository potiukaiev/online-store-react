import tokenChacker from '../functions/tokenChecker'

export const actionLogIn = token => ({type: 'LOG_IN', token: token});
export const actionLogOut = () => ({type: 'LOG_OUT'});
export const actionRegistration = payload => ({type: 'REGISTRATION', payload: payload});
export const actionAd = payload => ({type: 'AD_ADD', payload: payload});
export const actionGetAd = payload => ({type: 'GET_AD', payload: payload});
export const actionGetSingleAd = payload => ({type: 'GET_SINGLE_AD', payload});
export const actionChangePassword = payload => ({type: 'CHANGE_PASSWORD', payload})


export const actionAddImage = (imageId, adId) => {
    let image = {
        _id: imageId,
        ad: {
            _id: adId
        }
    }
    return actionMutation('addGood', tokenChacker().request(`mutation addImage($image: ImageInput) {
  ImageUpsert(image: $image) {
    _id
  }
}`, {image}), imageId, adId)
};

export function actionMutation (name, promise, ...params) {

    const actionPending    = () => ({ type: 'PROMISE', status: 'PENDING', payload: null,name, error: null })
    const actionResolved    = payload => ({ type: 'PROMISE', status: 'RESOLVED', payload,name, error: null })
    const actionRejected    = error => ({ type: 'PROMISE', status: 'REJECTED', payload: null,name, error })

    return async dispatch => {
        dispatch(actionPending())
        try {
            let payload = await promise
            dispatch(actionResolved(payload))
        }
        catch (e) {
            dispatch(actionRejected(e))
        }
    }
}

export const actionUploadImage = (form) => actionPromise('UPLOAD', fetch('/upload', {
    method: "POST",
    headers: localStorage.authToken ? {Authorization: 'Bearer ' + localStorage.authToken} : {},
    body: new FormData(form)
}).then(res => res.json()));

export function actionPromise(name, promise) {
    const actionPending = () => ({type: 'PROMISE',
        status: 'PENDING',
        payload: null,
        name,
        error: null });
    const actionResolved = payload => ({type: 'PROMISE',
        status: 'RESOLVED',
        payload,
        name,
        error: null });
    const actionRejected = error => ({type: 'PROMISE',
        status: 'REJECTED',
        payload: null,
        name,
        error});

    return async dispatch => {
        dispatch(actionPending());
        try{
            let payload = await promise;
            dispatch(actionResolved(payload))
        }
        catch(e) {
            dispatch(actionRejected(e))
        }
    }
}

export function getAllGoods(){
    let gql = tokenChacker();
    let promise;
        promise = gql.request(`query goods {
            AdFind(query: "[{}]") {
                _id, 
                title, 
                description, 
                price,
                createdAt,
                images {
                    _id,
                    url
                } 
                owner {
                    _id,
                    login,
                    phones,
                    createdAt    
                }
            }
        }`);
    return async dispatch => {
        let payload = await promise;
         payload && dispatch(actionGetAd(payload))
    }
}

