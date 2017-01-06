export function devToolMiddlewares() {
    if (typeof (window) === 'undefined') {
        return undefined;
    }
    return window.devToolsExtension && window.devToolsExtension();
}

export function devToolUpdateStore(store) {
    if (typeof (window) === 'undefined') {
        return;
    }
    if (window.devToolsExtension) {
        window.devToolsExtension.updateStore(store);
    }
}

export const isBrowserEnv = () => {
    return (typeof window !== 'undefined' && typeof window.grofers !== 'undefined');
}
