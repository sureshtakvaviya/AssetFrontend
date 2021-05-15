export default (store) => {
    const ability = store.getters.ability
    ability.update(store.state.rules)
    let rulesMap = new Map();
    return store.subscribe((mutation) => {
        let rules = []
        switch (mutation.type) {
            case 'projectStore/setAccessType':
                {
                    let accessType = mutation.payload;
                    if (accessType === 'admin' || accessType === 'write') //TODO confirm both are same
                    {
                        rules =[{ action: 'create', subject: 'aoi' },{ action: 'delete', subject: 'aoi' },{ action: 'create', subject: 'measure' },{ action: 'delete', subject: 'measure' },{ action: 'create', subject: 'cad' },{ action: 'delete', subject: 'cad' },]
                    }
                    else if (accessType === 'read') {
                        rules =[{ action: 'read', subject: 'aoi' },{ action: 'read', subject: 'measure' },{ action: 'read', subject: 'cad' },]
                    }
                    rulesMap.set('projectAuth',rules)
                    if(rulesMap.has('userAuth'))
                    {
                        rules.push(...rulesMap.get('userAuth'))
                    }
                    ability.update(rules);
                }
                break
            case 'userStore/setLoggedInUser':
                {
                    let userprofile = mutation.payload.userprofile
                    if (userprofile.subscription) {
                        switch (userprofile.subscription) {
                            case "Enterprise": {
                                rules.push({ action: 'use', subject: 'Enterprise' })
                                if (userprofile.user_type === 'Admin') {
                                    rules.push({ action: 'manage', subject: 'subusers' })
                                    rules.push({ action: 'upload', subject: 'files' })
                                    rules.push({ action: 'create', subject: 'activity' })
                                    rules.push({ action: 'delete', subject: 'activity' })
                                }
                            }
                                break;
                            case "Premium": rules.push({ action: 'use', subject: 'Premium' })
                                break;
                            default: { rules.push({ action: 'use', subject: 'Freemium' })}
                                break;
                        }
                        rulesMap.set('userAuth',rules)
                        ability.update(rules);
                    }
                }
                break
            case 'resetRoot': {
                rulesMap.clear()
                ability.update([])
            }
        }

    })
}