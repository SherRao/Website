export const keybinds = ["ctrl+shift+j", "ctrl+shift+i"];

//TODO: Make these snarky.
export const getResponseForOs = (os) => {
    switch(os) {
    case "windows":
        return "I'm a Windows user";

    case "macos":
        return "I'm a Mac user";

    case "linux":
        return "I'm a Linux user";

    case "android":
        return "I'm an Android user";

    case "ios":
        return "I'm an iOS user";

    default:
        return "I'm an undetermined user";
    }
};

export const LOADING_TIME_DURATION = 4500;
export const SOURCE_CODE_NOTIF_DELAY = 5000;
export const OS_NOTIF_DELAY = 7500;
